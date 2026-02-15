import { NextRequest, NextResponse } from 'next/server';
import {
  buildDefaultDraft,
  friendlyIntro,
  getNextQuestion,
} from '@/lib/holiday/concierge/agent';
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

export async function POST(req: NextRequest) {
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

    const body = await req.json().catch(() => ({}));
    const displayName = typeof body.displayName === 'string' ? body.displayName : null;

    const { data: existingProfile } = await supabase
      .from('holiday_agent_profiles')
      .select('id, preferences, household')
      .eq('user_id', userId)
      .maybeSingle();

    if (!existingProfile) {
      await supabase.from('holiday_agent_profiles').insert({
        user_id: userId,
        household: {
          adults: 3,
          children: 2,
          childAges: [14, 12],
        },
        preferences: {
          origin: 'DUB',
          livePackagesOnly: true,
          costMode: 'budget-first',
          preferredSuppliers: ['amadeus', 'loveholidays', 'clickandgo'],
          displayName,
        },
      });
    }

    const draft = buildDefaultDraft();
    const intro = friendlyIntro(displayName);
    const firstQuestion = getNextQuestion(draft);
    if (firstQuestion) {
      draft.asked.push(firstQuestion.id);
    }

    const { data: session, error: sessionError } = await supabase
      .from('holiday_agent_sessions')
      .insert({
        user_id: userId,
        status: 'collecting',
        draft,
      })
      .select('id, status, draft, updated_at')
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ ok: false, error: 'Failed to create session' }, { status: 500 });
    }

    await supabase.from('holiday_agent_messages').insert([
      { session_id: session.id, role: 'assistant', content: intro },
      {
        session_id: session.id,
        role: 'assistant',
        content: firstQuestion?.question || 'Tell me what kind of holiday you want and I will handle the shortlist.',
      },
    ]);

    const { data: messages } = await supabase
      .from('holiday_agent_messages')
      .select('id, role, content, created_at')
      .eq('session_id', session.id)
      .order('created_at', { ascending: true });

    await writeSystemLog(supabase, {
      actorUserId: userId,
      scope: 'concierge',
      event: 'session_started',
      message: `Concierge session started (${session.id})`,
      metadata: {
        sessionId: session.id,
        hasProfile: Boolean(existingProfile),
      },
    });

    return NextResponse.json({
      ok: true,
      session,
      messages: messages || [],
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
