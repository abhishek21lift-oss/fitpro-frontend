'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Users, ClipboardList, FileText, TrendingUp, Plus, ChevronRight,
  Activity, X, Search, Bell, Bot, MessageCircle, Sparkles,
  Clock, CheckCircle, AlertCircle, Dumbbell, BarChart3,
  ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { MOCK_CLIENTS, MOCK_ACTIVITY, getGreeting, formatDate } from '../../lib/mock-data';

/* ─── Sparkline SVG ─── */
const SparklineChart = ({ data, color = '#2563EB', height = 40 }: { data: number[]; color?: string; height?: number }) => {
  const w = 80;
  const h = height;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  return (
    <svg width={w} height={h} className="sparkline">
      <defs>
        <linearGradient id={`spark-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M${points}`} fill="none" stroke={color} strokeWidth="1.5" />
      <path d={`M${points} L${w},${h} L0,${h} Z`} fill={`url(#spark-${color.replace('#','')})`} />
    </svg>
  );
};

/* ─── Progress Ring ─── */
const ProgressRing = ({ progress, size = 44, stroke = 3, color = '#2563EB' }: { progress: number; size?: number; stroke?: number; color?: string }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;
  return (
    <svg width={size} height={size} className="progress-ring">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
        strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" className="progress-ring-circle"
      />
    </svg>
  );
};

/* ─── Animated Counter ─── */
const AnimatedCounter = ({ value, suffix = '', decimals = 0 }: { value: number; suffix?: string; decimals?: number }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number>(0);
  const startTime = useRef<number>(0);
  const duration = 800;

  const animate = useCallback((timestamp: number) => {
    if (!startTime.current) startTime.current = timestamp;
    const elapsed = timestamp - startTime.current;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    ref.current = Math.round(eased * value * Math.pow(10, decimals)) / Math.pow(10, decimals);
    setDisplay(ref.current);
    if (progress < 1) requestAnimationFrame(animate);
  }, [value, decimals]);

  useEffect(() => {
    startTime.current = 0;
    requestAnimationFrame(animate);
  }, [animate]);

  return <>{display.toFixed(decimals)}{suffix}</>;
};

/* ─── Header ─── */
function PremiumHeader() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <div className="flex items-start justify-between mb-8">
      <div className="animate-slide-up" style={{ animationDelay: '0ms' }}>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
            {getGreeting()}, Dr. Mehta
          </h1>
          <span className="badge badge-info text-xs">
            <Sparkles size={11} className="mr-1" />
            AI Active
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>{formatDate()}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span>{timeStr}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <Activity size={13} />
            12 clients active today
          </span>
        </div>
        <p className="text-xs text-blue-600 mt-1.5 flex items-center gap-1.5">
          <Sparkles size={11} className="text-blue-500" />
          AI Insight: 3 plans pending review — highest this month
        </p>
      </div>

      <div className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <div className="hidden md:flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl px-4 py-2.5 shadow-sm min-w-[240px]">
          <Search size={16} className="text-gray-400" />
          <input className="bg-transparent border-none outline-none text-sm text-gray-700 w-full placeholder:text-gray-400" placeholder="Search clients, plans..." />
          <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-mono">⌘K</span>
        </div>
        <button className="relative w-10 h-10 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:shadow-md transition-all" aria-label="Notifications">
          <Bell size={18} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>
        <button className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all" aria-label="AI Assistant">
          <Bot size={18} />
        </button>
        <button className="w-10 h-10 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:shadow-md transition-all" aria-label="Messages">
          <MessageCircle size={18} />
        </button>
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-md cursor-pointer hover:shadow-lg transition-all">
          AM
        </div>
      </div>
    </div>
  );
}

/* ─── KPI Card ─── */
function KpiCard({
  icon: Icon, label, value, change, color, gradient, chartData, suffix = '',
}: {
  icon: any; label: string; value: number; change?: number; color: string; gradient: string; chartData: number[]; suffix?: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`card card-hover p-5 ${gradient} relative overflow-hidden`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ transform: hovered ? 'translateY(-3px)' : 'translateY(0)', transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon size={22} style={{ color }} />
        </div>
        <div className="flex items-center gap-1.5">
          {change !== undefined && (
            <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full ${
              change >= 0 ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
            }`}>
              {change >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {Math.abs(change)}%
            </span>
          )}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            <AnimatedCounter value={value} suffix={suffix} />
          </div>
          <div className="text-sm text-gray-500">{label}</div>
        </div>
        <div className="shrink-0" style={{ opacity: hovered ? 1 : 0.8, transition: 'opacity 0.3s' }}>
          <SparklineChart data={chartData} color={color} />
        </div>
      </div>
      <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-[0.04]" style={{ background: `radial-gradient(circle, ${color}, transparent)`, filter: 'blur(20px)' }} />
    </div>
  );
}

/* ─── Activity Timeline Card ─── */
function ActivityCard({ item, index }: { item: typeof MOCK_ACTIVITY[0]; index: number }) {
  const icons: Record<string, any> = { assessment: ClipboardList, plan: FileText, delivery: CheckCircle, progress: TrendingUp };
  const colors: Record<string, string> = { assessment: '#2563EB', plan: '#8B5CF6', delivery: '#10B981', progress: '#F59E0B' };
  const bgColors: Record<string, string> = { assessment: 'bg-blue-50', plan: 'bg-purple-50', delivery: 'bg-emerald-50', progress: 'bg-amber-50' };
  const Icon = icons[item.type] || Activity;

  return (
    <div
      className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/60 transition-all cursor-pointer animate-slide-up group"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className={`w-11 h-11 rounded-2xl ${bgColors[item.type] || 'bg-gray-50'} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
        <Icon size={18} style={{ color: colors[item.type] || '#6B7280' }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-semibold text-sm text-gray-900">{item.client}</span>
          <span className={`badge ${
            item.type === 'delivery' ? 'badge-success' :
            item.type === 'progress' ? 'badge-info' :
            item.type === 'plan' ? 'badge-purple' : 'badge-info'
          }`}>{item.type}</span>
        </div>
        <p className="text-sm text-gray-500">{item.detail}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="text-xs text-gray-400">{item.time}</span>
          <button className="text-xs text-blue-600 hover:text-blue-700 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            View Details
          </button>
        </div>
      </div>
      <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors shrink-0 mt-1" />
    </div>
  );
}

/* ─── Client Card ─── */
function ClientPriorityCard({ client, index }: { client: typeof MOCK_CLIENTS[0]; index: number }) {
  const p = client.progress;
  const currentWeight = p.weight.length > 0 ? p.weight[p.weight.length - 1].val : null;
  const startWeight = p.weight.length > 0 ? p.weight[0].val : null;
  const progressPct = startWeight && currentWeight
    ? Math.min(100, Math.round(((startWeight - currentWeight) / (startWeight * 0.15)) * 100))
    : 60;
  const colors = ['#2563EB', '#8B5CF6', '#F59E0B', '#10B981'];

  return (
    <div className="card card-hover p-5 animate-slide-up cursor-pointer" style={{ animationDelay: `${index * 80}ms` }}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold" style={{ background: `${colors[index % 4]}15`, color: colors[index % 4] }}>
            {client.initials}
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">{client.name}</div>
            <div className="text-xs text-gray-500">{client.goal} · {client.calories} kcal</div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <ProgressRing progress={progressPct} color={colors[index % 4]} size={44} />
          <span className="text-[10px] text-gray-400 font-medium">{progressPct}%</span>
        </div>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <span className={`badge ${
          client.status === 'active' ? 'badge-success' :
          client.status === 'review' ? 'badge-warning' : 'badge-info'
        }`}>
          {client.status === 'active' ? 'Active' : client.status === 'review' ? 'Review' : 'Delivered'}
        </span>
        <span className="text-xs text-gray-400">Week {client.programWeek}</span>
        {currentWeight && <span className="text-xs text-gray-400">{currentWeight} kg</span>}
      </div>
      <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
        <button className="flex-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl py-2 transition-colors">
          Open Profile
        </button>
        <button className="flex-1 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl py-2 transition-colors">
          Generate Plan
        </button>
        <button className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors">
          <MessageCircle size={14} />
        </button>
      </div>
    </div>
  );
}

/* ─── Chart Tooltip ─── */
const ChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-md border border-white/50 rounded-2xl p-3 shadow-xl">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-sm font-bold" style={{ color: p.color }}>{p.value}{p.name === 'val' ? ' kg' : ' %'}</p>
        ))}
      </div>
    );
  }
  return null;
};

/* ─── AI Insights Panel ─── */
function AiInsightsPanel() {
  const insights = [
    { label: 'Follow-ups needed', value: '12 clients', badge: 'warning', icon: Clock },
    { label: 'Plans ready for approval', value: '5 plans', badge: 'info', icon: FileText },
    { label: 'At risk of dropping out', value: '3 clients', badge: 'danger', icon: AlertCircle },
    { label: 'Compliance increased', value: '7% this week', badge: 'success', icon: TrendingUp },
  ];

  return (
    <div className="card p-5 h-full">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
            <Bot size={18} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">AI Insights</h3>
            <p className="text-xs text-gray-400">Real-time recommendations</p>
          </div>
        </div>
        <Sparkles size={16} className="text-blue-500" />
      </div>
      <div className="space-y-2.5">
        {insights.map((item, i) => (
          <div key={i} className="ai-insight-card flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              item.badge === 'success' ? 'bg-emerald-50 text-emerald-600' :
              item.badge === 'warning' ? 'bg-amber-50 text-amber-600' :
              item.badge === 'danger' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
            }`}>
              <item.icon size={16} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">{item.label}</div>
              <div className="text-xs text-gray-500">{item.value}</div>
            </div>
            <span className={`badge ${
              item.badge === 'success' ? 'badge-success' :
              item.badge === 'warning' ? 'badge-warning' :
              item.badge === 'danger' ? 'badge-danger' : 'badge-info'
            } text-xs`}>
              {item.badge === 'success' ? 'Improved' :
               item.badge === 'warning' ? 'Action' :
               item.badge === 'danger' ? 'Urgent' : 'Ready'}
            </span>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 text-sm text-blue-600 bg-blue-50/50 hover:bg-blue-50 rounded-2xl py-2.5 font-medium transition-colors flex items-center justify-center gap-1.5">
        <Sparkles size={14} />
        View All Recommendations
      </button>
    </div>
  );
}

/* ─── AI Coach FAB ─── */
function AiCoachFab() {
  const [open, setOpen] = useState(false);
  const actions = [
    { label: 'Ask AI', icon: Bot },
    { label: 'Generate Diet', icon: ClipboardList },
    { label: 'Generate Workout', icon: Dumbbell },
    { label: 'Analyze Client', icon: BarChart3 },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {open && (
        <div className="absolute bottom-20 right-0 mb-2 animate-scale-in">
          <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl p-2 min-w-[200px]">
            {actions.map((a, i) => (
              <button key={i} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm text-gray-700 font-medium">
                <a.icon size={16} className="text-blue-600" />
                {a.label}
              </button>
            ))}
          </div>
        </div>
      )}
      <button
        className="ai-fab"
        onClick={() => setOpen(!open)}
        aria-label="AI Coach"
      >
        <span className="ai-fab-pulse" />
        {open ? <X size={24} /> : <Bot size={24} />}
      </button>
    </div>
  );
}

/* ─── MAIN DASHBOARD ─── */
export default function DashboardPage() {
  const [weightData] = useState(MOCK_CLIENTS[0].progress.weight);
  const [bodyFatData] = useState(MOCK_CLIENTS[0].progress.bodyFat);
  const complianceData = [
    { week: 'W1', diet: 88, workout: 85, overall: 86 },
    { week: 'W2', diet: 92, workout: 88, overall: 90 },
    { week: 'W3', diet: 85, workout: 82, overall: 84 },
    { week: 'W4', diet: 90, workout: 87, overall: 88 },
  ];
  const engagementData = [
    { week: 'W1', sessions: 4, meals: 28 },
    { week: 'W2', sessions: 5, meals: 30 },
    { week: 'W3', sessions: 3, meals: 26 },
    { week: 'W4', sessions: 4, meals: 29 },
  ];
  const priorityClients = MOCK_CLIENTS.filter(c => c.status !== 'delivered').slice(0, 4);

  return (
    <div className="page-content relative" style={{ paddingBottom: 120 }}>
      {/* Decorative orbs */}
      <div className="deco-orb deco-orb-1" />
      <div className="deco-orb deco-orb-2" />
      <div className="deco-orb deco-orb-3" />

      <div className="relative" style={{ zIndex: 1 }}>
        {/* ─── Header ─── */}
        <PremiumHeader />

        {/* ─── KPI Section ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <KpiCard
            icon={Users} label="Active Clients" value={24} change={12}
            color="#2563EB" gradient="kpi-gradient-blue"
            chartData={[18, 20, 19, 22, 21, 23, 24]}
          />
          <KpiCard
            icon={ClipboardList} label="Plans Today" value={6}
            color="#8B5CF6" gradient="kpi-gradient-purple"
            chartData={[2, 4, 3, 5, 4, 6, 6]}
          />
          <KpiCard
            icon={FileText} label="Pending Review" value={3}
            color="#F59E0B" gradient="kpi-gradient-orange"
            chartData={[5, 4, 6, 3, 4, 3, 3]}
          />
          <KpiCard
            icon={TrendingUp} label="Avg Progress" value={87} change={5} suffix="%"
            color="#10B981" gradient="kpi-gradient-green"
            chartData={[72, 75, 78, 80, 82, 85, 87]}
          />
        </div>

        {/* ─── Analytics Zone ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left — Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weight + Body Comp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="card p-5 animate-slide-up" style={{ animationDelay: '200ms' }}>
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp size={15} className="text-blue-600" />
                  Weight Progress
                </h3>
                <div style={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weightData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563EB" stopOpacity={0.15} />
                          <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" />
                      <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} domain={['dataMin - 2', 'dataMax + 1']} />
                      <Tooltip content={<ChartTooltip />} />
                      <Area type="monotone" dataKey="val" stroke="#2563EB" strokeWidth={2.5} fill="url(#weightGrad)" dot={{ fill: '#2563EB', r: 3, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 5 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="card p-5 animate-slide-up" style={{ animationDelay: '250ms' }}>
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity size={15} className="text-purple-600" />
                  Body Composition
                </h3>
                <div style={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={bodyFatData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="bfGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.15} />
                          <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" />
                      <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} domain={['dataMin - 2', 'dataMax + 1']} />
                      <Tooltip content={<ChartTooltip />} />
                      <Area type="monotone" dataKey="val" stroke="#8B5CF6" strokeWidth={2.5} fill="url(#bfGrad)" dot={{ fill: '#8B5CF6', r: 3, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 5 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Compliance + Engagement */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="card p-5 animate-slide-up" style={{ animationDelay: '300ms' }}>
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle size={15} className="text-emerald-600" />
                  Compliance Score
                </h3>
                <div style={{ height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={complianceData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" />
                      <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} domain={[70, 100]} />
                      <Tooltip />
                      <Bar dataKey="diet" fill="#2563EB" radius={[6, 6, 0, 0]} barSize={12} />
                      <Bar dataKey="workout" fill="#8B5CF6" radius={[6, 6, 0, 0]} barSize={12} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="card p-5 animate-slide-up" style={{ animationDelay: '350ms' }}>
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity size={15} className="text-amber-600" />
                  Weekly Engagement
                </h3>
                <div style={{ height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={engagementData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" />
                      <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="sessions" stroke="#F59E0B" strokeWidth={2.5} dot={{ fill: '#F59E0B', r: 3 }} name="Sessions" />
                      <Line type="monotone" dataKey="meals" stroke="#10B981" strokeWidth={2.5} dot={{ fill: '#10B981', r: 3 }} name="Meals" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Right — AI Insights */}
          <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <AiInsightsPanel />
          </div>
        </div>

        {/* ─── Bottom Grid: Activity + Clients ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity */}
          <div className="lg:col-span-2 card p-5 animate-slide-up" style={{ animationDelay: '350ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Recent Activity</h2>
              <button className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">View All</button>
            </div>
            <div className="space-y-1">
              {MOCK_ACTIVITY.map((a, i) => <ActivityCard key={i} item={a} index={i} />)}
            </div>
          </div>

          {/* Priority Clients */}
          <div className="space-y-4 animate-slide-up" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">Priority Clients</h2>
              <button className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">View All</button>
            </div>
            {priorityClients.map((c, i) => <ClientPriorityCard key={c.id} client={c} index={i} />)}
          </div>
        </div>
      </div>

      {/* AI Coach Widget */}
      <AiCoachFab />
    </div>
  );
}
