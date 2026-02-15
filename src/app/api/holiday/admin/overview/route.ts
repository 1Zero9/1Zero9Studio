import { NextRequest, NextResponse } from 'next/server';
import { requireAdminFromBearer } from '@/lib/holiday/concierge/auth';
import { getServiceSupabase } from '@/lib/supabase';
import { writeSystemLog } from '@/lib/holiday/concierge/logs';

export async function GET(req: NextRequest) {
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

    const [
      _adminUpsert,
      { count: queuedCount },
      { count: processingCount },
      { count: completedCount },
      { count: failedCount },
      { data: recentJobs },
      { data: logs },
      { data: admins },
    ] = await Promise.all([
      supabase.from('holiday_agent_admins').upsert({
        user_id: adminCheck.user.id,
        email: adminCheck.user.email,
        last_login_at: new Date().toISOString(),
      }, { onConflict: 'user_id' }),
      supabase.from('holiday_agent_jobs').select('id', { count: 'exact', head: true }).eq('status', 'queued'),
      supabase.from('holiday_agent_jobs').select('id', { count: 'exact', head: true }).eq('status', 'processing'),
      supabase.from('holiday_agent_jobs').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
      supabase.from('holiday_agent_jobs').select('id', { count: 'exact', head: true }).eq('status', 'failed'),
      supabase
        .from('holiday_agent_jobs')
        .select('id, user_id, status, error, created_at, started_at, completed_at, result_plan_id')
        .order('created_at', { ascending: false })
        .limit(50),
      supabase
        .from('holiday_agent_system_logs')
        .select('id, actor_user_id, scope, event, level, message, metadata, created_at')
        .order('created_at', { ascending: false })
        .limit(200),
      supabase
        .from('holiday_agent_admins')
        .select('id, user_id, email, notes, created_at, last_login_at')
        .order('created_at', { ascending: false }),
    ]);

    await writeSystemLog(supabase, {
      actorUserId: adminCheck.user.id,
      scope: 'admin',
      event: 'overview_viewed',
      message: 'Admin opened dashboard overview',
      metadata: {
        queued: queuedCount || 0,
        processing: processingCount || 0,
      },
    });

    return NextResponse.json({
      ok: true,
      metrics: {
        queued: queuedCount || 0,
        processing: processingCount || 0,
        completed: completedCount || 0,
        failed: failedCount || 0,
      },
      recentJobs: recentJobs || [],
      logs: logs || [],
      admins: admins || [],
      now: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
