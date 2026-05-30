'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import {
  Users, ClipboardList, FileText, TrendingUp,
  Activity, Search, Bell, Bot, MessageCircle, Sparkles,
  Clock, CheckCircle, AlertCircle, Dumbbell, BarChart3,
  ArrowUpRight, ArrowDownRight, ChevronRight, Plus, Eye,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { MOCK_CLIENTS, MOCK_ACTIVITY, getGreeting, formatDate } from '../../lib/mock-data';

/* ─── Sparkline ─── */
const SparklineChart = ({ data, color = '#2563EB' }: { data: number[]; color?: string }) => {
  const w = 72, h = 36;
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  return (
    <svg width={w} height={h} className="shrink-0">
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M${pts}`} fill="none" stroke={color} strokeWidth="1.5" />
      <path d={`M${pts} L${w},${h} L0,${h} Z`} fill={`url(#sg-${color.replace('#','')})`} />
    </svg>
  );
};

/* ─── Animated Counter ─── */
const AnimatedCounter = ({ value, suffix = '', decimals = 0 }: { value: number; suffix?: string; decimals?: number }) => {
  const [display, setDisplay] = useState(0);
  const start = useRef(0);
  const animate = useCallback((ts: number) => {
    if (!start.current) start.current = ts;
    const p = Math.min((ts - start.current) / 800, 1);
    const e = 1 - Math.pow(1 - p, 3);
    setDisplay(Math.round(e * value * 10 ** decimals) / 10 ** decimals);
    if (p < 1) requestAnimationFrame(animate);
  }, [value, decimals]);
  useEffect(() => { start.current = 0; requestAnimationFrame(animate); }, [animate]);
  return <>{display.toFixed(decimals)}{suffix}</>;
};

/* ─── Section header ─── */
const SectionHeader = ({ title, action }: { title: string; action?: { label: string; href?: string } }) => (
  <div className="flex items-center justify-between mb-5">
    <h2 className="text-base font-semibold text-gray-900">{title}</h2>
    {action && (
      <Link href={action.href || '#'} className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1">
        {action.label} <ChevronRight size={13} />
      </Link>
    )}
  </div>
);

/* ─── Chart Tooltip ─── */
const ChartTip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-white/90 backdrop-blur-md border border-white/50 rounded-xl px-3 py-2 shadow-lg text-xs">
      <p className="text-gray-500 mb-0.5">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="font-semibold" style={{ color: p.color }}>{p.value}{p.dataKey === 'val' ? ' kg' : ''}</p>
      ))}
    </div>
  );
};

/* ─── MAIN ─── */
export default function DashboardPage() {
  const client = MOCK_CLIENTS[0];
  const { weight, bodyFat } = client.progress;
  const compliance = [
    { w: 'W1', diet: 88, workout: 85 }, { w: 'W2', diet: 92, workout: 88 },
    { w: 'W3', diet: 85, workout: 82 }, { w: 'W4', diet: 90, workout: 87 },
  ];
  const engagement = [
    { w: 'W1', sessions: 4, meals: 28 }, { w: 'W2', sessions: 5, meals: 30 },
    { w: 'W3', sessions: 3, meals: 26 }, { w: 'W4', sessions: 4, meals: 29 },
  ];
  const priorityClients = MOCK_CLIENTS.filter(c => c.status !== 'delivered').slice(0, 4);
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const insights = [
    { label: 'Follow-ups needed', value: '12 clients', color: 'bg-amber-50 text-amber-600', badge: 'badge-warning', badgeLabel: 'Action', icon: Clock },
    { label: 'Plans ready for approval', value: '5 plans', color: 'bg-blue-50 text-blue-600', badge: 'badge-info', badgeLabel: 'Ready', icon: FileText },
    { label: 'At risk of dropping out', value: '3 clients', color: 'bg-red-50 text-red-600', badge: 'badge-danger', badgeLabel: 'Urgent', icon: AlertCircle },
    { label: 'Compliance increased', value: '7% this week', color: 'bg-emerald-50 text-emerald-600', badge: 'badge-success', badgeLabel: 'Improved', icon: TrendingUp },
  ];

  return (
    <div className="page-content">
      {/* ═══ HEADER ═══ */}
      <header className="flex items-start justify-between mb-8 animate-slide-up">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
              {getGreeting()}, Dr. Mehta
            </h1>
            <span className="badge badge-info text-xs gap-1">
              <Sparkles size={10} /> AI Active
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>{formatDate()}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span>{timeStr}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <Activity size={13} /> 12 active today
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="hidden md:flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl px-3.5 py-2 shadow-sm">
            <Search size={15} className="text-gray-400" />
            <input className="bg-transparent border-none outline-none text-sm text-gray-700 w-48 placeholder:text-gray-400" placeholder="Search..." />
            <kbd className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
          </div>
          <button className="relative w-9 h-9 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:shadow-sm transition-all" aria-label="Notifications">
            <Bell size={16} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-rose-500 ring-1 ring-white" />
          </button>
          <button className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm" aria-label="AI Assistant">
            <Bot size={16} />
          </button>
          <button className="w-9 h-9 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:shadow-sm transition-all" aria-label="Messages">
            <MessageCircle size={16} />
          </button>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm cursor-pointer">
            AM
          </div>
        </div>
      </header>

      {/* ═══ KPI CARDS ═══ */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Users, label: 'Active Clients', value: 24, change: 12, color: '#2563EB', data: [18,20,19,22,21,23,24] },
          { icon: ClipboardList, label: 'Plans Today', value: 6, color: '#8B5CF6', data: [2,4,3,5,4,6,6] },
          { icon: FileText, label: 'Pending Review', value: 3, color: '#F59E0B', data: [5,4,6,3,4,3,3] },
          { icon: TrendingUp, label: 'Avg Progress', value: 87, change: 5, color: '#10B981', suffix: '%', data: [72,75,78,80,82,85,87] },
        ].map((k, i) => (
          <div key={i} className="card card-hover p-5 animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${k.color}12` }}>
                <k.icon size={20} style={{ color: k.color }} />
              </div>
              {k.change !== undefined && (
                <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                  k.change >= 0 ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
                }`}>
                  {k.change >= 0 ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                  {Math.abs(k.change)}%
                </span>
              )}
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-0.5">
                  <AnimatedCounter value={k.value} suffix={k.suffix || ''} />
                </div>
                <div className="text-sm text-gray-500">{k.label}</div>
              </div>
              <SparklineChart data={k.data} color={k.color} />
            </div>
          </div>
        ))}
      </section>

      {/* ═══ ANALYTICS + AI INSIGHTS ═══ */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
        {/* Charts area */}
        <div className="lg:col-span-2 space-y-5">
          <SectionHeader title="Client Performance" action={{ label: 'View full report', href: '/analytics' }} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={14} className="text-blue-600" />
                <h3 className="text-sm font-semibold text-gray-900">Weight Trend</h3>
              </div>
              <div style={{ height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weight} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs><linearGradient id="wG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2563EB" stopOpacity={0.12} /><stop offset="100%" stopColor="#2563EB" stopOpacity={0} /></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" />
                    <XAxis dataKey="week" tick={{ fontSize: 9, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: '#94A3B8' }} axisLine={false} tickLine={false} domain={['dataMin - 2', 'dataMax + 1']} />
                    <Tooltip content={<ChartTip />} />
                    <Area type="monotone" dataKey="val" stroke="#2563EB" strokeWidth={2} fill="url(#wG)" dot={{ fill: '#2563EB', r: 3, stroke: '#fff', strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Activity size={14} className="text-purple-600" />
                <h3 className="text-sm font-semibold text-gray-900">Body Fat %</h3>
              </div>
              <div style={{ height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={bodyFat} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs><linearGradient id="bG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.12} /><stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} /></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" />
                    <XAxis dataKey="week" tick={{ fontSize: 9, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: '#94A3B8' }} axisLine={false} tickLine={false} domain={['dataMin - 2', 'dataMax + 1']} />
                    <Tooltip content={<ChartTip />} />
                    <Area type="monotone" dataKey="val" stroke="#8B5CF6" strokeWidth={2} fill="url(#bG)" dot={{ fill: '#8B5CF6', r: 3, stroke: '#fff', strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={14} className="text-emerald-600" />
                <h3 className="text-sm font-semibold text-gray-900">Compliance Score</h3>
              </div>
              <div style={{ height: 160 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={compliance} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" />
                    <XAxis dataKey="w" tick={{ fontSize: 9, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: '#94A3B8' }} axisLine={false} tickLine={false} domain={[70, 100]} />
                    <Tooltip />
                    <Bar dataKey="diet" fill="#2563EB" radius={[4,4,0,0]} barSize={10} />
                    <Bar dataKey="workout" fill="#8B5CF6" radius={[4,4,0,0]} barSize={10} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Activity size={14} className="text-amber-600" />
                <h3 className="text-sm font-semibold text-gray-900">Weekly Engagement</h3>
              </div>
              <div style={{ height: 160 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={engagement} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" />
                    <XAxis dataKey="w" tick={{ fontSize: 9, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="sessions" stroke="#F59E0B" strokeWidth={2} dot={{ fill: '#F59E0B', r: 3 }} />
                    <Line type="monotone" dataKey="meals" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
                <Bot size={17} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">AI Insights</h3>
                <p className="text-xs text-gray-400">Real-time recommendations</p>
              </div>
            </div>
            <Sparkles size={15} className="text-blue-500" />
          </div>
          <div className="space-y-2">
            {insights.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                  <item.icon size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.value}</p>
                </div>
                <span className={`badge ${item.badge} text-xs shrink-0`}>{item.badgeLabel}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-sm text-blue-600 bg-blue-50/50 hover:bg-blue-50 rounded-xl py-2.5 font-medium transition-colors flex items-center justify-center gap-1.5">
            <Sparkles size={13} /> View All Recommendations
          </button>
        </div>
      </section>

      {/* ═══ BOTTOM: ACTIVITY + CLIENTS ═══ */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Activity */}
        <div className="lg:col-span-2 card p-5">
          <SectionHeader title="Recent Activity" action={{ label: 'View all', href: '#' }} />
          <div className="space-y-1">
            {MOCK_ACTIVITY.map((a, i) => {
              const iconMap: Record<string, any> = { assessment: ClipboardList, plan: FileText, delivery: CheckCircle, progress: TrendingUp };
              const colorMap: Record<string, string> = { assessment: 'bg-blue-50 text-blue-600', plan: 'bg-purple-50 text-purple-600', delivery: 'bg-emerald-50 text-emerald-600', progress: 'bg-amber-50 text-amber-600' };
              const Icon = iconMap[a.type] || Activity;
              return (
                <div key={i} className="flex items-start gap-3.5 p-3.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group animate-slide-up" style={{ animationDelay: `${i * 40}ms` }}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorMap[a.type] || 'bg-gray-50 text-gray-500'} group-hover:scale-110 transition-transform`}>
                    <Icon size={17} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-sm text-gray-900">{a.client}</span>
                      <span className={`badge ${
                        a.type === 'delivery' ? 'badge-success' : a.type === 'progress' ? 'badge-info' : a.type === 'plan' ? 'badge-purple' : 'badge-info'
                      } py-0.5 text-[10px]`}>{a.type}</span>
                    </div>
                    <p className="text-sm text-gray-500">{a.detail}</p>
                    <p className="text-xs text-gray-400 mt-1">{a.time}</p>
                  </div>
                  <ChevronRight size={15} className="text-gray-300 group-hover:text-gray-500 transition-colors shrink-0 mt-1" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Clients */}
        <div>
          <SectionHeader title="Priority Clients" action={{ label: 'View all', href: '/clients' }} />
          <div className="space-y-3">
            {priorityClients.map((c, i) => {
              const cw = c.progress.weight;
              const curW = cw.length > 0 ? cw[cw.length - 1].val : null;
              const stW = cw.length > 0 ? cw[0].val : null;
              const pct = stW && curW ? Math.min(100, Math.round(((stW - curW) / (stW * 0.15)) * 100)) : 60;
              const colors = ['#2563EB', '#8B5CF6', '#F59E0B', '#10B981'];
              const color = colors[i % 4];
              const r = 18, circ = 2 * Math.PI * r;
              const off = circ - (pct / 100) * circ;
              return (
                <div key={c.id} className="card card-hover p-4 animate-slide-up cursor-pointer" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold" style={{ background: `${color}15`, color }}>
                        {c.initials}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{c.name}</div>
                        <div className="text-xs text-gray-500">{c.goal} · {c.calories} kcal</div>
                      </div>
                    </div>
                    <svg width="40" height="40" className="shrink-0" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="20" cy="20" r={r} fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="3" />
                      <circle cx="20" cy="20" r={r} fill="none" stroke={color} strokeWidth="3" strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
                    </svg>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <span className={`badge ${
                      c.status === 'active' ? 'badge-success' : c.status === 'review' ? 'badge-warning' : 'badge-info'
                    } py-0.5`}>{c.status === 'active' ? 'Active' : c.status === 'review' ? 'Review' : 'Delivered'}</span>
                    <span>Week {c.programWeek}</span>
                    {curW && <span>{curW} kg</span>}
                  </div>
                  <div className="flex items-center gap-1.5 pt-3 border-t border-gray-50">
                    <button className="flex-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg py-1.5 transition-colors">Profile</button>
                    <button className="flex-1 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg py-1.5 transition-colors">Generate Plan</button>
                    <button className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors"><MessageCircle size={13} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
