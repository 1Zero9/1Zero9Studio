import type { SupabaseClient } from '@supabase/supabase-js';

type LogLevel = 'info' | 'warn' | 'error';

type LogInput = {
  actorUserId?: string | null;
  scope: string;
  event: string;
  message: string;
  level?: LogLevel;
  metadata?: Record<string, unknown>;
};

export async function writeSystemLog(
  supabase: SupabaseClient,
  input: LogInput
): Promise<void> {
  try {
    await supabase.from('holiday_agent_system_logs').insert({
      actor_user_id: input.actorUserId || null,
      scope: input.scope,
      event: input.event,
      level: input.level || 'info',
      message: input.message,
      metadata: input.metadata || {},
      created_at: new Date().toISOString(),
    });
  } catch {
    // Logging must never block the primary flow.
  }
}
