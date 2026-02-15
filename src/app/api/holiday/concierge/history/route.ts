import { NextRequest, NextResponse } from 'next/server';
import {
  getServiceClientForUser,
  resolveUserIdFromBearer,
} from '@/lib/holiday/concierge/auth';
import { writeSystemLog } from '@/lib/holiday/concierge/logs';

function readToken(authHeader: string | null): string | null {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.replace('Bearer ', '').trim();
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = readToken(authHeader);
    const userId = await resolveUserIdFromBearer(authHeader);

    if (!userId || !token) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getServiceClientForUser(token);
    if (!supabase) {
      return NextResponse.json({ ok: false, error: 'Supabase not configured' }, { status: 500 });
    }

    const [{ data: profile }, { data: sessions }, { data: plans }, { data: jobs }, { data: notifications }] = await Promise.all([
      supabase
        .from('holiday_agent_profiles')
        .select('id, household, preferences, visited_destinations, notes, updated_at')
        .eq('user_id', userId)
        .maybeSingle(),
      supabase
        .from('holiday_agent_sessions')
        .select('id, status, draft, created_at, updated_at')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(10),
      supabase
        .from('holiday_agent_plans')
        .select('id, session_id, search_payload, recommendations, agent_brief, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10),
      supabase
        .from('holiday_agent_jobs')
        .select('id, session_id, status, error, result_plan_id, created_at, started_at, completed_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20),
      supabase
        .from('holiday_agent_notifications')
        .select('id, kind, title, body, payload, read_at, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20),
    ]);

    await writeSystemLog(supabase, {
      actorUserId: userId,
      scope: 'concierge',
      event: 'history_viewed',
      message: 'User viewed concierge history',
      metadata: {
        sessions: (sessions || []).length,
        plans: (plans || []).length,
        jobs: (jobs || []).length,
      },
    });

    return NextResponse.json({
      ok: true,
      profile: profile || null,
      sessions: sessions || [],
      plans: plans || [],
      jobs: jobs || [],
      notifications: notifications || [],
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
