import { NextRequest, NextResponse } from 'next/server';
import { buildHolidayRecommendations } from '@/lib/holiday/planner';
import { buildAgentBrief } from '@/lib/holiday/advisor';
import { getServiceClientForUser, resolveUserIdFromBearer } from '@/lib/holiday/concierge/auth';
import { sendConsultationReadyEmail } from '@/lib/holiday/concierge/notify';
import { HolidaySearchRequest } from '@/lib/holiday/types';
import { getServiceSupabase } from '@/lib/supabase';
import { writeSystemLog } from '@/lib/holiday/concierge/logs';

function readToken(authHeader: string | null): string | null {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.replace('Bearer ', '').trim();
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const bearerToken = readToken(authHeader);
    const cronSecret = req.headers.get('x-cron-secret');
    const expectedSecret = process.env.CONCIERGE_CRON_SECRET;
    const isCron = Boolean(expectedSecret && (cronSecret === expectedSecret || bearerToken === expectedSecret));
    const userId = isCron ? null : await resolveUserIdFromBearer(authHeader);

    if (!isCron && (!userId || !bearerToken)) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = isCron ? getServiceSupabase() : getServiceClientForUser(bearerToken || '');

    if (!supabase) {
      return NextResponse.json({ ok: false, error: 'Supabase not configured' }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const jobId = typeof body.jobId === 'string' ? body.jobId : null;

    let query = supabase
      .from('holiday_agent_jobs')
      .select('id, user_id, session_id, status, search_payload, created_at')
      .eq('status', 'queued')
      .order('created_at', { ascending: true })
      .limit(1);

    if (jobId) {
      query = query.eq('id', jobId);
    }

    if (!isCron && userId) {
      query = query.eq('user_id', userId);
    }

    const { data: jobs, error: jobsError } = await query;

    if (jobsError) {
      return NextResponse.json({ ok: false, error: jobsError.message }, { status: 500 });
    }

    const job = jobs?.[0];
    if (!job) {
      return NextResponse.json({ ok: true, processed: false, message: 'No queued jobs' });
    }

    await writeSystemLog(supabase, {
      actorUserId: isCron ? null : userId,
      scope: 'jobs',
      event: 'job_processing_started',
      message: `Processing job ${job.id}`,
      metadata: { jobId: job.id, sessionId: job.session_id },
    });

    await supabase
      .from('holiday_agent_jobs')
      .update({ status: 'processing', started_at: new Date().toISOString() })
      .eq('id', job.id);

    const searchPayload = job.search_payload as HolidaySearchRequest;
    const recommendations = await buildHolidayRecommendations(searchPayload);
    const agentBrief = buildAgentBrief(searchPayload, recommendations);

    const { data: plan, error: planError } = await supabase
      .from('holiday_agent_plans')
      .insert({
        user_id: job.user_id,
        session_id: job.session_id,
        search_payload: searchPayload,
        recommendations,
        agent_brief: agentBrief,
      })
      .select('id')
      .single();

    if (planError || !plan) {
      await supabase
        .from('holiday_agent_jobs')
        .update({ status: 'failed', error: planError?.message || 'Failed to save plan' })
        .eq('id', job.id);
      await writeSystemLog(supabase, {
        actorUserId: isCron ? null : userId,
        scope: 'jobs',
        event: 'job_failed',
        level: 'error',
        message: `Job failed ${job.id}`,
        metadata: { jobId: job.id, error: planError?.message || 'Plan save failed' },
      });
      return NextResponse.json({ ok: false, error: planError?.message || 'Plan save failed' }, { status: 500 });
    }

    await supabase
      .from('holiday_agent_jobs')
      .update({
        status: 'completed',
        result_plan_id: plan.id,
        completed_at: new Date().toISOString(),
      })
      .eq('id', job.id);

    await supabase
      .from('holiday_agent_sessions')
      .update({
        status: 'ready',
        updated_at: new Date().toISOString(),
      })
      .eq('id', job.session_id);

    const top = recommendations[0];
    await supabase.from('holiday_agent_notifications').insert({
      user_id: job.user_id,
      kind: 'consultation_ready',
      title: 'Your holiday consultation is ready',
      body: top
        ? `Top recommendation: ${top.destination} from EUR ${top.totalEstimatedEUR.toLocaleString()}.`
        : 'Your consultation is ready to review.',
      payload: {
        jobId: job.id,
        planId: plan.id,
        topDestination: top?.destination || null,
      },
    });

    try {
      const { data: userData } = await supabase.auth.admin.getUserById(job.user_id);
      const email = userData.user?.email;
      if (email && top) {
        await sendConsultationReadyEmail({
          to: email,
          destination: top.destination,
          totalEUR: top.totalEstimatedEUR,
        });
      }
    } catch {
      // Email notification is optional and should not fail job completion.
    }

    await writeSystemLog(supabase, {
      actorUserId: isCron ? null : userId,
      scope: 'jobs',
      event: 'job_completed',
      message: `Job completed ${job.id}`,
      metadata: {
        jobId: job.id,
        planId: plan.id,
        topDestination: top?.destination || null,
      },
    });

    return NextResponse.json({ ok: true, processed: true, jobId: job.id, planId: plan.id });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
