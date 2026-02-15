import { NextRequest, NextResponse } from 'next/server';
import { getServiceClientForUser, resolveUserIdFromBearer } from '@/lib/holiday/concierge/auth';
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
    const token = readToken(authHeader);
    const userId = await resolveUserIdFromBearer(authHeader);

    if (!token || !userId) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getServiceClientForUser(token);
    if (!supabase) {
      return NextResponse.json({ ok: false, error: 'Supabase not configured' }, { status: 500 });
    }

    const body = (await req.json().catch(() => ({}))) as { ids?: number[] };
    const now = new Date().toISOString();

    if (body.ids?.length) {
      await supabase
        .from('holiday_agent_notifications')
        .update({ read_at: now })
        .eq('user_id', userId)
        .in('id', body.ids);
    } else {
      await supabase
        .from('holiday_agent_notifications')
        .update({ read_at: now })
        .eq('user_id', userId)
        .is('read_at', null);
    }

    await writeSystemLog(supabase, {
      actorUserId: userId,
      scope: 'notifications',
      event: 'notifications_marked_read',
      message: 'User marked notifications as read',
      metadata: {
        count: body.ids?.length || null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
