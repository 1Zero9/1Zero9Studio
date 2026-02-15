import { createClient } from '@supabase/supabase-js';
import { getServiceSupabase } from '@/lib/supabase';

export type AuthenticatedUser = {
  id: string;
  email: string | null;
  token: string;
};

function getEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return { url, anon, service };
}

export async function resolveUserIdFromBearer(authHeader: string | null): Promise<string | null> {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.replace('Bearer ', '').trim();
  const { url, anon } = getEnv();
  if (!url || !anon || !token) {
    return null;
  }

  const client = createClient(url, anon, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data, error } = await client.auth.getUser();
  if (error || !data.user) {
    return null;
  }

  return data.user.id;
}

export async function resolveUserFromBearer(authHeader: string | null): Promise<AuthenticatedUser | null> {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.replace('Bearer ', '').trim();
  const { url, anon } = getEnv();
  if (!url || !anon || !token) {
    return null;
  }

  const client = createClient(url, anon, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data, error } = await client.auth.getUser();
  if (error || !data.user) {
    return null;
  }

  return {
    id: data.user.id,
    email: data.user.email || null,
    token,
  };
}

function emailIsInAllowList(email: string | null): boolean {
  if (!email) {
    return false;
  }
  const raw = process.env.HOLIDAY_ADMIN_EMAILS || '';
  if (!raw.trim()) {
    return false;
  }
  const set = new Set(
    raw
      .split(',')
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean)
  );
  return set.has(email.toLowerCase());
}

export async function isAdminUser(user: { id: string; email: string | null }): Promise<boolean> {
  if (emailIsInAllowList(user.email)) {
    return true;
  }

  const service = getServiceSupabase();
  if (!service) {
    return false;
  }

  const { data } = await service
    .from('holiday_agent_admins')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  return Boolean(data);
}

export async function requireAdminFromBearer(authHeader: string | null): Promise<{
  ok: boolean;
  user: AuthenticatedUser | null;
  error?: string;
}> {
  const user = await resolveUserFromBearer(authHeader);
  if (!user) {
    return { ok: false, user: null, error: 'Unauthorized' };
  }

  const allowed = await isAdminUser(user);
  if (!allowed) {
    return { ok: false, user: null, error: 'Admin access required' };
  }

  return { ok: true, user };
}

export function getServiceClientForUser(token: string) {
  const { url, service } = getEnv();
  if (!url || !service || !token) {
    return null;
  }

  return createClient(url, service, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
