'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import {
  HolidayHero,
  HolidayPageShell,
  HolidayPanel,
  HolidayPrimaryButton,
} from '@/components/holiday-agent/ui';
import { holidayThemes } from '@/components/holiday-agent/theme';

type AdminMetrics = {
  queued: number;
  processing: number;
  completed: number;
  failed: number;
};

type AdminJob = {
  id: string;
  user_id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  error: string | null;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  result_plan_id: string | null;
};

type AdminLog = {
  id: number;
  actor_user_id: string | null;
  scope: string;
  event: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  created_at: string;
};

type AdminUser = {
  id: string;
  user_id: string;
  email: string | null;
  created_at: string;
  last_login_at: string | null;
};

export default function HolidayAdminPage() {
  const theme = holidayThemes.admin;
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [jobs, setJobs] = useState<AdminJob[]>([]);
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [retryingJobId, setRetryingJobId] = useState<string | null>(null);

  const token = session?.access_token || null;

  const failedJobs = useMemo(() => jobs.filter((job) => job.status === 'failed'), [jobs]);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }
    void fetchOverview(token);
  }, [token]);

  async function signIn(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!supabase) {
      setError('Supabase is not configured.');
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
    }
  }

  async function signOut() {
    if (!supabase) {
      return;
    }
    await supabase.auth.signOut();
    setMetrics(null);
    setJobs([]);
    setLogs([]);
    setAdmins([]);
  }

  async function fetchOverview(accessToken: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/holiday/admin/overview', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Failed to load admin overview');
      }

      setMetrics(data.metrics as AdminMetrics);
      setJobs((data.recentJobs || []) as AdminJob[]);
      setLogs((data.logs || []) as AdminLog[]);
      setAdmins((data.admins || []) as AdminUser[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Overview request failed');
    } finally {
      setLoading(false);
    }
  }

  async function retryJob(jobId: string) {
    if (!token) {
      return;
    }

    setRetryingJobId(jobId);
    try {
      const res = await fetch('/api/holiday/admin/jobs/retry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Retry failed');
      }

      await fetchOverview(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Retry request failed');
    } finally {
      setRetryingJobId(null);
    }
  }

  return (
    <HolidayPageShell>
      <section className="container-custom">
        {!session ? (
          <form onSubmit={signIn} className="mx-auto max-w-xl">
            <HolidayPanel className="p-7">
              <p className={`holiday-kicker ${theme.primaryAccentClass}`}>Operations Access</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight">Admin login</h2>
              <p className="mt-2 text-sm text-slate-600">Sign in with an account listed in `HOLIDAY_ADMIN_EMAILS` or `holiday_agent_admins`.</p>
              <div className="mt-4 grid gap-3">
                <input
                  type="email"
                  placeholder="Admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ha-control"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="ha-control"
                  required
                />
                <HolidayPrimaryButton className="bg-gradient-to-r from-amber-300 to-orange-300 hover:from-amber-200 hover:to-orange-200">
                  Sign in
                </HolidayPrimaryButton>
              </div>
              {error && <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
            </HolidayPanel>
          </form>
        ) : (
          <div className="space-y-6">
            <HolidayHero className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className={`holiday-kicker ${theme.heroKickerClass}`}>Operations Cockpit</p>
                  <p className="mt-2 text-sm text-slate-100">Signed in as {session.user.email}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => token && fetchOverview(token)} className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs transition hover:bg-white/20">
                    Refresh
                  </button>
                  <button onClick={signOut} className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs transition hover:bg-white/20">
                    Sign out
                  </button>
                </div>
              </div>
              {error && <p className="mt-3 text-sm text-rose-200">{error}</p>}
            </HolidayHero>

            {metrics && (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm"><p className="text-xs text-slate-500">Queued</p><p className="mt-1 text-2xl font-bold text-slate-900">{metrics.queued}</p></div>
                <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm"><p className="text-xs text-slate-500">Processing</p><p className="mt-1 text-2xl font-bold text-slate-900">{metrics.processing}</p></div>
                <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm"><p className="text-xs text-slate-500">Completed</p><p className="mt-1 text-2xl font-bold text-emerald-700">{metrics.completed}</p></div>
                <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 shadow-sm"><p className="text-xs text-rose-600">Failed</p><p className="mt-1 text-2xl font-bold text-rose-700">{metrics.failed}</p></div>
              </div>
            )}

            <HolidayPanel className="border-rose-200/80">
              <h3 className="text-lg font-semibold text-slate-900">Failed jobs ({failedJobs.length})</h3>
              <div className="mt-3 space-y-2">
                {failedJobs.length === 0 ? (
                  <p className="text-sm text-slate-500">No failed jobs.</p>
                ) : (
                  failedJobs.map((job) => (
                    <div key={job.id} className="rounded-xl border border-rose-300/35 bg-rose-50/85 p-3 text-sm">
                      <p className="text-slate-900">Job {job.id.slice(0, 8)} • {job.status}</p>
                      <p className="mt-1 text-xs text-slate-500">Created: {new Date(job.created_at).toLocaleString()}</p>
                      <p className="mt-1 text-xs text-rose-700">{job.error || 'Unknown failure'}</p>
                      <button
                        onClick={() => retryJob(job.id)}
                        disabled={retryingJobId === job.id}
                        className="mt-2 rounded-full border border-rose-300 bg-white px-3 py-1 text-xs text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
                      >
                        {retryingJobId === job.id ? 'Retrying...' : 'Retry job'}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </HolidayPanel>

            <div className="grid gap-6 lg:grid-cols-2">
              <HolidayPanel>
                <h3 className="text-lg font-semibold text-slate-900">Recent jobs</h3>
                <div className="mt-3 max-h-[360px] space-y-2 overflow-y-auto">
                  {jobs.map((job) => (
                    <div key={job.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
                      <p className="text-slate-900">{job.id.slice(0, 8)} • {job.status}</p>
                      <p className="text-slate-500">Created: {new Date(job.created_at).toLocaleString()}</p>
                      <p className="text-slate-500">Started: {job.started_at ? new Date(job.started_at).toLocaleString() : '-'}</p>
                      <p className="text-slate-500">Completed: {job.completed_at ? new Date(job.completed_at).toLocaleString() : '-'}</p>
                    </div>
                  ))}
                </div>
              </HolidayPanel>

              <HolidayPanel>
                <h3 className="text-lg font-semibold text-slate-900">System logs</h3>
                <div className="mt-3 max-h-[360px] space-y-2 overflow-y-auto">
                  {logs.map((log) => (
                    <div key={log.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
                      <p className="text-slate-900">[{log.level}] {log.scope}.{log.event}</p>
                      <p className="mt-1 text-slate-700">{log.message}</p>
                      <p className="mt-1 text-slate-500">{new Date(log.created_at).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </HolidayPanel>
            </div>

            <HolidayPanel>
              <h3 className="text-lg font-semibold text-slate-900">Admin accounts</h3>
              <div className="mt-3 space-y-2">
                {admins.length === 0 ? (
                  <p className="text-sm text-slate-500">No records in `holiday_agent_admins`.</p>
                ) : (
                  admins.map((admin) => (
                    <div key={admin.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
                      <p className="text-slate-900">{admin.email || admin.user_id}</p>
                      <p className="text-slate-500">Created: {new Date(admin.created_at).toLocaleString()}</p>
                      <p className="text-slate-500">Last login: {admin.last_login_at ? new Date(admin.last_login_at).toLocaleString() : '-'}</p>
                    </div>
                  ))
                )}
              </div>
            </HolidayPanel>

            {loading && <p className="text-xs text-slate-600">Loading admin data…</p>}
          </div>
        )}
      </section>
    </HolidayPageShell>
  );
}
