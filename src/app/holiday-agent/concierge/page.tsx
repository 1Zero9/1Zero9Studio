'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { HolidayPackageResult } from '@/lib/holiday/types';
import { HolidayHero, HolidayPageShell } from '@/components/holiday-agent/ui';
import { holidayThemes } from '@/components/holiday-agent/theme';

type ChatMessage = {
  id: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
};

type AgentBrief = {
  headline: string;
  recommendation: string;
  strengths: string[];
  watchouts: string[];
  actionChecklist: string[];
};

type HistoryPlan = {
  id: string;
  created_at: string;
  recommendations: HolidayPackageResult[];
  agent_brief: AgentBrief;
};

type ConciergeJob = {
  id: string;
  session_id: string | null;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  error: string | null;
  result_plan_id: string | null;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
};

type ConciergeNotification = {
  id: number;
  kind: string;
  title: string;
  body: string;
  read_at: string | null;
  created_at: string;
};

export default function ConciergePage() {
  const theme = holidayThemes.concierge;
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authCooldownSeconds, setAuthCooldownSeconds] = useState(0);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const [brief, setBrief] = useState<AgentBrief | null>(null);
  const [results, setResults] = useState<HolidayPackageResult[]>([]);
  const [history, setHistory] = useState<HistoryPlan[]>([]);
  const [jobs, setJobs] = useState<ConciergeJob[]>([]);
  const [notifications, setNotifications] = useState<ConciergeNotification[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [processingJob, setProcessingJob] = useState(false);

  const token = session?.access_token || null;

  const topResult = useMemo(() => results[0] || null, [results]);
  const unreadNotifications = useMemo(
    () => notifications.filter((n) => !n.read_at),
    [notifications]
  );
  const hasQueuedWork = useMemo(
    () => jobs.some((j) => j.status === 'queued' || j.status === 'processing'),
    [jobs]
  );
  const authMessage = useMemo(() => {
    if (authCooldownSeconds > 0) {
      return `Quick security pause. Please wait ${authCooldownSeconds}s, then try again.`;
    }
    return authError;
  }, [authCooldownSeconds, authError]);

  useEffect(() => {
    if (authCooldownSeconds <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setAuthCooldownSeconds((current) => (current <= 1 ? 0 : current - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [authCooldownSeconds]);

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

    fetchHistory(token);
  }, [token]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const timer = setInterval(() => {
      fetchHistory(token);
    }, 15000);

    return () => clearInterval(timer);
  }, [token]);

  useEffect(() => {
    if (!token || !hasQueuedWork || processingJob) {
      return;
    }

    const timer = setTimeout(() => {
      processNextJob();
    }, 2500);

    return () => clearTimeout(timer);
  }, [token, hasQueuedWork, processingJob]);

  async function handleAuth(e: FormEvent) {
    e.preventDefault();
    if (authCooldownSeconds > 0) {
      return;
    }

    setAuthError(null);
    setAuthSubmitting(true);

    if (!supabase) {
      setAuthError('Supabase env is missing. Configure NEXT_PUBLIC_SUPABASE_URL and key.');
      setAuthSubmitting(false);
      return;
    }

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: displayName,
          },
        },
      });
      if (error) {
        const cooldownMatch = error.message.match(/after\s+(\d+)\s+seconds?/i);
        if (cooldownMatch?.[1]) {
          setAuthCooldownSeconds(Number(cooldownMatch[1]));
        }
        setAuthError(error.message);
      }
      setAuthSubmitting(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      const cooldownMatch = error.message.match(/after\s+(\d+)\s+seconds?/i);
      if (cooldownMatch?.[1]) {
        setAuthCooldownSeconds(Number(cooldownMatch[1]));
      }
      setAuthError(error.message);
    }
    setAuthSubmitting(false);
  }

  async function startConciergeSession() {
    if (!token) {
      return;
    }

    setSending(true);
    try {
      const res = await fetch('/api/holiday/concierge/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ displayName }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Failed to start concierge session');
      }

      setSessionId(data.session.id as string);
      setMessages(data.messages as ChatMessage[]);
      await fetchHistory(token);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Failed to start session');
    } finally {
      setSending(false);
    }
  }

  async function fetchHistory(accessToken: string) {
    setLoadingHistory(true);
    try {
      const res = await fetch('/api/holiday/concierge/history', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        const plans = (data.plans || []) as HistoryPlan[];
        const fetchedJobs = (data.jobs || []) as ConciergeJob[];
        const fetchedNotifications = (data.notifications || []) as ConciergeNotification[];

        setHistory(plans);
        setJobs(fetchedJobs);
        setNotifications(fetchedNotifications);

        const newestPlan = plans[0];
        if (newestPlan) {
          setBrief(newestPlan.agent_brief || null);
          setResults(newestPlan.recommendations || []);
        }

        const active = fetchedJobs.find((job) => job.status === 'queued' || job.status === 'processing');
        setActiveJobId(active?.id || null);
      }
    } finally {
      setLoadingHistory(false);
    }
  }

  async function sendMessage(e: FormEvent) {
    e.preventDefault();
    if (!input.trim() || !sessionId || !token) {
      return;
    }

    setSending(true);
    const text = input;
    setInput('');

    try {
      const res = await fetch('/api/holiday/concierge/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionId,
          message: text,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setMessages(data.messages as ChatMessage[]);
      if (data.queuedJobId) {
        setActiveJobId(data.queuedJobId as string);
      }

      await fetchHistory(token);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Chat request failed');
    } finally {
      setSending(false);
    }
  }

  async function processNextJob() {
    if (!token || processingJob) {
      return;
    }

    setProcessingJob(true);
    try {
      const res = await fetch('/api/holiday/concierge/jobs/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(activeJobId ? { jobId: activeJobId } : {}),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Failed to process job');
      }

      await fetchHistory(token);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Job processing failed');
    } finally {
      setProcessingJob(false);
    }
  }

  async function markNotificationsRead() {
    if (!token || unreadNotifications.length === 0) {
      return;
    }

    await fetch('/api/holiday/concierge/notifications/read', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ids: unreadNotifications.map((n) => n.id) }),
    });

    await fetchHistory(token);
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSessionId(null);
    setMessages([]);
    setResults([]);
    setBrief(null);
    setHistory([]);
    setJobs([]);
    setNotifications([]);
    setActiveJobId(null);
  }

  return (
    <HolidayPageShell className="pb-24 pt-10">
      <section className="container-custom">
        <HolidayHero className="px-7 py-8 md:px-10 md:py-10">
          <div className="grid gap-6 lg:grid-cols-[1.65fr_1fr]">
            <div>
              <p className={`holiday-kicker ${theme.heroKickerClass}`}>AI Travel Concierge</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-5xl">A real family holiday agent, with memory and strategy.</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-200 md:text-base">
                Tell us your style, budget, flight tolerance, and family needs. The concierge interviews you, builds your profile,
                then works in the background to prepare package holidays with clear reasons.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100">Smart interview flow</span>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100">Queued agent jobs</span>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100">Package-first recommendations</span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-200">Conversation</p>
                <p className="mt-1 text-3xl font-bold">{messages.length}</p>
                <p className="text-xs text-slate-200">Messages logged</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-rose-200">Alerts</p>
                <p className="mt-1 text-3xl font-bold">{unreadNotifications.length}</p>
                <p className="text-xs text-slate-200">Unread notifications</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-200">Pipeline</p>
                <p className="mt-1 text-3xl font-bold">{jobs.length}</p>
                <p className="text-xs text-slate-200">Jobs tracked</p>
              </div>
            </div>
          </div>
        </HolidayHero>
      </section>

      <section className="container-custom mt-8 grid gap-6 xl:grid-cols-[1.02fr_1.98fr]">
        <aside className="space-y-5">
          {!session ? (
            <form onSubmit={handleAuth} className="rounded-3xl border border-slate-200/85 bg-white/90 p-6 shadow-[0_16px_50px_rgba(15,23,42,0.08)] backdrop-blur">
              <p className="holiday-kicker text-fuchsia-700">Account Setup</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Unlock your personal concierge</h2>
              <p className="mt-2 text-sm text-slate-600">Sign up once and your interviews, family profile, and plans are always ready.</p>
              <div className="mt-4 inline-flex rounded-full border border-slate-300 bg-slate-100 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`rounded-full px-3 py-1 transition ${mode === 'signup' ? 'bg-emerald-400 font-semibold text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Sign up
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className={`rounded-full px-3 py-1 transition ${mode === 'signin' ? 'bg-emerald-400 font-semibold text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Sign in
                </button>
              </div>

              <div className="mt-4 grid gap-3">
                {mode === 'signup' && (
                  <input
                    placeholder="Your first name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="ha-control"
                  />
                )}
                <input
                  type="email"
                  placeholder="Email"
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
                  minLength={6}
                />
                <button disabled={authSubmitting || authCooldownSeconds > 0} className="group ha-btn-primary">
                  <span className="inline-flex items-center gap-2">
                    {authCooldownSeconds > 0 ? `Please wait ${authCooldownSeconds}s` : authSubmitting ? 'Working...' : mode === 'signup' ? 'Create account' : 'Sign in'}
                    <span className="transition group-hover:translate-x-0.5">→</span>
                  </span>
                </button>
              </div>

              {authMessage && (
                <p
                  className={`mt-3 rounded-xl px-3 py-2 text-sm ${authCooldownSeconds > 0 ? 'border border-amber-200 bg-amber-50 text-amber-800' : 'border border-rose-200 bg-rose-50 text-rose-800'}`}
                >
                  {authMessage}
                </p>
              )}
              {mode === 'signup' && (
                <p className="mt-3 text-xs text-slate-500">If email confirmation is enabled in Supabase, check your inbox after signup.</p>
              )}
            </form>
          ) : (
            <div className="rounded-3xl border border-emerald-200/75 bg-gradient-to-br from-white via-emerald-50/75 to-sky-50/65 p-6 shadow-[0_16px_50px_rgba(15,23,42,0.08)]">
              <p className="holiday-kicker text-emerald-700">Account Active</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Welcome back</h2>
              <p className="mt-2 truncate text-sm text-slate-700">{session.user.email}</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {!sessionId && (
                  <button onClick={startConciergeSession} disabled={sending} className="rounded-xl bg-gradient-to-r from-emerald-300 to-teal-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 disabled:opacity-60">
                    Start interview
                  </button>
                )}
                <button onClick={processNextJob} disabled={!hasQueuedWork || processingJob} className="rounded-xl border border-emerald-300/70 bg-white px-4 py-2 text-sm text-emerald-800 transition hover:-translate-y-0.5 hover:bg-emerald-50 disabled:opacity-50">
                  {processingJob ? 'Processing...' : 'Process queue'}
                </button>
                <button onClick={signOut} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm transition hover:-translate-y-0.5 hover:bg-slate-50">
                  Sign out
                </button>
              </div>
              {authError && <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">{authError}</p>}
            </div>
          )}

          <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-[0_14px_42px_rgba(15,23,42,0.07)]">
            <div className="flex items-center justify-between gap-3">
              <p className="holiday-kicker text-slate-700">Notifications</p>
              <button onClick={markNotificationsRead} disabled={!unreadNotifications.length} className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold transition hover:bg-slate-50 disabled:opacity-50">
                Mark read
              </button>
            </div>
            {!notifications.length ? (
              <p className="mt-2 text-sm text-slate-600">No notifications yet.</p>
            ) : (
              <div className="mt-3 space-y-2">
                {notifications.slice(0, 6).map((n) => (
                  <div key={n.id} className={`rounded-2xl border p-3 text-sm ${n.read_at ? 'border-slate-200 bg-slate-50' : 'border-emerald-300/60 bg-emerald-50'}`}>
                    <p className="font-semibold text-slate-900">{n.title}</p>
                    <p className="mt-1 text-slate-700">{n.body}</p>
                    <p className="mt-1 text-xs text-slate-500">{new Date(n.created_at).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-[0_14px_42px_rgba(15,23,42,0.07)]">
            <p className="holiday-kicker text-slate-700">Saved Consultations</p>
            {loadingHistory ? <p className="mt-2 text-xs text-slate-600">Loading...</p> : null}
            {history.length === 0 ? (
              <p className="mt-2 text-sm text-slate-600">No saved plans yet.</p>
            ) : (
              <div className="mt-3 space-y-2">
                {history.slice(0, 5).map((plan) => (
                  <div key={plan.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs text-slate-600">{new Date(plan.created_at).toLocaleString()}</p>
                    <p className="mt-1 text-sm font-medium text-slate-800">{plan.agent_brief?.headline || 'Travel plan'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        <div className="space-y-5">
          <div className="overflow-hidden rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-white via-emerald-50/55 to-fuchsia-50/50 p-6 shadow-[0_18px_56px_rgba(15,23,42,0.1)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="holiday-kicker text-emerald-700">Concierge Interview</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Tell me exactly what your family wants</h2>
                <p className="mt-2 text-sm text-slate-600">Use plain language. Mention destinations, vibe, flight time, food needs, and budget.</p>
              </div>
              {activeJobId ? (
                <span className="rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Active job: {activeJobId.slice(0, 8)}
                </span>
              ) : null}
            </div>

            <form onSubmit={sendMessage} className="mt-4 rounded-2xl border border-slate-200/80 bg-white/90 p-3">
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={!sessionId || sending}
                  placeholder="Type naturally: 'We want sunshine, safe beach, 10 nights in August, around EUR 5k...'"
                  className="ha-control flex-1 disabled:opacity-60"
                />
                <button
                  disabled={!sessionId || sending || !input.trim()}
                  className="rounded-xl bg-gradient-to-r from-emerald-300 to-teal-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-500">Tip: mention dates, budget, flight-time limit, board basis, and kids priorities.</p>
            </form>

            <div className="mt-3 h-[340px] space-y-3 overflow-y-auto rounded-2xl border border-slate-200/80 bg-white/90 p-4 pr-2 md:h-[500px]">
              {messages.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-emerald-50 p-4 text-sm text-slate-700">
                  Start your interview and describe your ideal holiday. Example: 7 nights in late July, beach + waterpark,
                  under 5 hours flight, all-inclusive, max EUR 4,500.
                </div>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex items-start gap-2 ${
                      m.role === 'assistant' ? 'justify-start' : m.role === 'system' ? 'justify-center' : 'justify-end'
                    }`}
                  >
                    <span
                      className={`mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold tracking-wide ${
                        m.role === 'assistant'
                          ? 'bg-emerald-300 text-emerald-950'
                          : m.role === 'system'
                          ? 'bg-amber-300 text-amber-950'
                          : 'bg-fuchsia-300 text-fuchsia-950'
                      }`}
                    >
                      {m.role === 'assistant' ? 'AI' : m.role === 'system' ? 'SYS' : 'YOU'}
                    </span>
                    <div
                      className={`max-w-[85%] rounded-2xl border p-3 text-sm shadow-sm ${
                        m.role === 'assistant'
                          ? 'border-emerald-200 bg-emerald-50'
                          : m.role === 'system'
                          ? 'border-amber-200 bg-amber-50'
                          : 'border-fuchsia-200 bg-fuchsia-50'
                      }`}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{m.role}</p>
                      <p className="mt-1 whitespace-pre-wrap text-slate-900">{m.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {brief && (
            <div className="rounded-3xl border border-emerald-300/70 bg-gradient-to-br from-emerald-100 to-rose-50 p-6 shadow-[0_16px_46px_rgba(15,23,42,0.08)]">
              <p className="holiday-kicker text-emerald-700">Consultation Summary</p>
              <h3 className="mt-2 text-2xl font-bold text-emerald-900">{brief.headline}</h3>
              <p className="mt-2 text-sm text-slate-800">{brief.recommendation}</p>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-emerald-200/70 bg-white/70 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">Strengths</p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-700">
                    {brief.strengths?.slice(0, 3).map((item, i) => (
                      <li key={`${item}-${i}`}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-amber-200/70 bg-white/70 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">Watchouts</p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-700">
                    {brief.watchouts?.slice(0, 3).map((item, i) => (
                      <li key={`${item}-${i}`}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-fuchsia-200/80 bg-white/70 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-fuchsia-700">Next steps</p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-700">
                    {brief.actionChecklist?.slice(0, 3).map((item, i) => (
                      <li key={`${item}-${i}`}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {topResult && (
            <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-[0_16px_52px_rgba(15,23,42,0.08)]">
              <p className="holiday-kicker text-rose-700">Top Package Match</p>
              <h3 className="mt-1 text-3xl font-bold text-slate-900">{topResult.destination}, {topResult.country}</h3>
              <p className="mt-2 text-sm text-slate-700">{topResult.reason}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Package price</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">EUR {topResult.totalEstimatedEUR.toLocaleString()}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Sentiment</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">{topResult.sentiment.score}/5</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Family fit</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">{topResult.fitScore}/100</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-600">{topResult.hasLivePackagePricing ? 'Using live dynamic package pricing.' : 'Using estimated package pricing.'}</p>
              {topResult.packageDetails?.atGlance?.length ? (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-600">At a glance</p>
                  <div className="mt-2 grid gap-1 sm:grid-cols-2">
                    {topResult.packageDetails.atGlance.slice(0, 8).map((line, index) => (
                      <p key={`top-result-glance-${index}`} className="text-sm text-slate-700">
                        • {line}
                      </p>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </section>
    </HolidayPageShell>
  );
}
