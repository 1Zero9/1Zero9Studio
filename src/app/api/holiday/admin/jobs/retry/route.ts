import { NextRequest, NextResponse } from 'next/server';
import { requireAdminFromBearer } from '@/lib/holiday/concierge/auth';
import { getServiceSupabase } from '@/lib/supabase';
import { writeSystemLog } from '@/lib/holiday/concierge/logs';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const adminCheck = await requireAdminFromBearer(authHeader);
    if (!adminCheck.ok || !adminCheck.user) {
      return NextResponse.json({ ok: false, error: adminCheck.error || 'Unauthorized' }, { status: 401 });
    }

    const supabase = getServiceSupabase();
    if (!supabase) {
      return NextResponse.json({ ok: false, error: 'Supabase not configured' }, { status: 500 });
    }

    const body = (await req.json().catch(() => ({}))) as { jobId?: string };
    if (!body.jobId) {
      return NextResponse.json({ ok: false, error: 'jobId is required' }, { status: 400 });
    }

    const { data: job } = await supabase
      .from('holiday_agent_jobs')
      .select('id, status')
      .eq('id', body.jobId)
      .maybeSingle();

    if (!job) {
      return NextResponse.json({ ok: false, error: 'Job not found' }, { status: 404 });
    }

    if (!['failed', 'completed'].includes(job.status)) {
      return NextResponse.json({ ok: false, error: 'Only failed/completed jobs can be retried' }, { status: 400 });
    }

    const { error } = await supabase
      .from('holiday_agent_jobs')
      .update({
        status: 'queued',
        error: null,
        started_at: null,
        completed_at: null,
        result_plan_id: null,
      })
      .eq('id', body.jobId);

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    await writeSystemLog(supabase, {
      actorUserId: adminCheck.user.id,
      scope: 'admin',
      event: 'job_retried',
      message: `Admin retried job ${body.jobId}`,
      metadata: { jobId: body.jobId },
    });

    return NextResponse.json({ ok: true, jobId: body.jobId });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
