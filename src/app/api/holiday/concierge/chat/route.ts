import { NextRequest, NextResponse } from 'next/server';
import {
  buildDefaultDraft,
  getNextQuestion,
  isDraftComplete,
  updateDraftFromUserReply,
} from '@/lib/holiday/concierge/agent';
import {
  getServiceClientForUser,
  resolveUserIdFromBearer,
} from '@/lib/holiday/concierge/auth';
import { ConciergeSessionDraft } from '@/lib/holiday/concierge/agent';
import { buildQueuedSearchPayload } from '@/lib/holiday/concierge/search';
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

    const body = (await req.json()) as { sessionId?: string; message?: string };
    const sessionId = body.sessionId as string;
    const message = String(body.message || '').trim();

    if (!sessionId || !message) {
      return NextResponse.json({ ok: false, error: 'sessionId and message are required' }, { status: 400 });
    }

    const { data: session } = await supabase
      .from('holiday_agent_sessions')
      .select('id, user_id, status, draft')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .maybeSingle();

    if (!session) {
      return NextResponse.json({ ok: false, error: 'Session not found' }, { status: 404 });
    }

    await supabase.from('holiday_agent_messages').insert({
      session_id: sessionId,
      role: 'user',
      content: message,
    });

    const currentDraft = ((session.draft as ConciergeSessionDraft | null) || buildDefaultDraft());
    const updatedDraft = updateDraftFromUserReply(currentDraft, message);

    const { data: profile } = await supabase
      .from('holiday_agent_profiles')
      .select('id, preferences, household, visited_destinations')
      .eq('user_id', userId)
      .maybeSingle();

    let assistantMessage = 'Perfect, I have noted that.';
    let queuedJobId: string | null = null;
    let complete = false;

    if (isDraftComplete(updatedDraft)) {
      complete = true;
      const searchPayload = buildQueuedSearchPayload(profile, updatedDraft);

      const { data: job, error: jobError } = await supabase
        .from('holiday_agent_jobs')
        .insert({
          user_id: userId,
          session_id: sessionId,
          status: 'queued',
          search_payload: searchPayload,
        })
        .select('id')
        .single();

      if (jobError) {
        return NextResponse.json({ ok: false, error: 'Failed to queue consultation job' }, { status: 500 });
      }

      queuedJobId = job.id as string;

      assistantMessage = [
        'Perfect, I have everything I need now.',
        'I am preparing your package consultation in the background and will notify you when it is ready.',
        `Job reference: ${queuedJobId.slice(0, 8)}.`,
      ].join(' ');

      await supabase
        .from('holiday_agent_profiles')
        .update({
          visited_destinations: Array.from(
            new Set([...(profile?.visited_destinations || []), ...(updatedDraft.spec.visitedDestinations || [])])
          ),
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      await supabase
        .from('holiday_agent_sessions')
        .update({
          status: 'processing',
          draft: updatedDraft,
          updated_at: new Date().toISOString(),
        })
        .eq('id', sessionId);
    } else {
      const nextQuestion = getNextQuestion(updatedDraft);
      if (nextQuestion && !updatedDraft.asked.includes(nextQuestion.id)) {
        updatedDraft.asked.push(nextQuestion.id);
      }

      assistantMessage = nextQuestion
        ? `Great, thank you. ${nextQuestion.question}`
        : 'Thanks, that helps. Tell me a bit more and I will keep refining your package profile.';

      await supabase
        .from('holiday_agent_sessions')
        .update({
          status: 'collecting',
          draft: updatedDraft,
          updated_at: new Date().toISOString(),
        })
        .eq('id', sessionId);
    }

    await supabase.from('holiday_agent_messages').insert({
      session_id: sessionId,
      role: 'assistant',
      content: assistantMessage,
    });

    await writeSystemLog(supabase, {
      actorUserId: userId,
      scope: 'concierge',
      event: complete ? 'consultation_queued' : 'chat_progressed',
      message: complete
        ? `Consultation queued with job ${queuedJobId}`
        : `Chat progressed for session ${sessionId}`,
      metadata: {
        sessionId,
        queuedJobId,
      },
    });

    const { data: messages } = await supabase
      .from('holiday_agent_messages')
      .select('id, role, content, created_at')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    return NextResponse.json({
      ok: true,
      complete,
      queuedJobId,
      assistantMessage,
      draft: updatedDraft,
      messages: messages || [],
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
