import { NextRequest, NextResponse } from 'next/server';
import { requireAdminFromBearer } from '@/lib/holiday/concierge/auth';
import { getServiceSupabase } from '@/lib/supabase';

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

    const url = new URL(req.url);
    const scope = url.searchParams.get('scope');
    const limit = Math.min(500, Number(url.searchParams.get('limit') || 200));

    let query = supabase
      .from('holiday_agent_system_logs')
      .select('id, actor_user_id, scope, event, level, message, metadata, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (scope) {
      query = query.eq('scope', scope);
    }

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, logs: data || [] });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
