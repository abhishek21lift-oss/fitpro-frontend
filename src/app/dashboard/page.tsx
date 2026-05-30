'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Users, ClipboardList, FileText, TrendingUp,
  Activity, Search, Bell, Sparkles,
  CheckCircle, BarChart3, Dumbbell, Zap,
  ArrowUpRight, ArrowDownRight, ChevronRight, Flame,
  Target, Heart, Award, Clock,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  BarChart, Bar,
} from 'recharts';
import {
  MOCK_CLIENTS, MOCK_ACTIVITY, MOCK_TRAINER,
  getGreeting, formatDate, getInitialsColor,
} from '../../lib/mock-data';

/* ─── Sparkline ─── */
function Sparkline({ data, color = '#2563EB', height = 36 }: { data: number[]; color?: string; height?: number }) {
  if (!data || data.length < 2) return null;
  const w = 80;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${height - ((v - min) / range) * (height - 6) - 3}`).join(' ');
  return (
    <svg width={w} height={height} viewBox={`0 0 ${w} ${height}`} style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </linearGradient>
      </defs>
      <path d={`M${pts}`} fill="none" stroke={`url(#sg-${color.replace('#','')})`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts.split(' ').pop()!.split(',')[0]} cy={pts.split(' ').pop()!.split(',')[1]} r="2.5" fill={color} stroke="white" strokeWidth="1" />
    </svg>
  );
}

/* ─── Mini Ring ─── */
function ProgressRing({ pct, size = 36, stroke = 3, color = '#2563EB' }: { pct: number; size?: number; stroke?: number; color?: string }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id={`ring-${color.replace('#','')}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={color} stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`url(#ring-${color.replace('#','')})`} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ filter: 'drop-shadow(0 0 3px ' + color + '40)' }} />
    </svg>
  );
}

/* ─── KPI ─── */
function KpiCard({ icon: Icon, label, value, prev, unit, color, sparkline, accent }: {
  icon: any; label: string; value: string; prev: number; unit: string; color: string; sparkline: number[]; accent: string;
}) {
  const change = ((prev - (prev * 0.97)) / prev) * 100;
  const isUp = change > 0;
  return (
    <div className={`card card-hover card-accent-${accent}`} style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: -20, right: -20, width: 100, height: 100,
        borderRadius: '50%', background: `radial-gradient(circle, ${color}06, transparent)`, pointerEvents: 'none',
      }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: `linear-gradient(135deg, ${color}18, ${color}06)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0,
          boxShadow: `0 4px 12px ${color}15`,
        }}>
          <Icon size={19} />
        </div>
        <Sparkline data={sparkline} color={color} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.2px' }}>{label}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--text)' }}>{value}</span>
          {unit && <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{unit}</span>}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: isUp ? '#059669' : '#DC2626' }}>
        {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
        <span>{Math.abs(change).toFixed(1)}%</span>
        <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: 2 }}>vs last month</span>
      </div>
    </div>
  );
}

/* ─── Activity Icon ─── */
function ActIcon({ type }: { type: string }) {
  const map: Record<string, [any, string]> = {
    assessment: [ClipboardList, '#2563EB'],
    plan: [FileText, '#8B5CF6'],
    delivery: [CheckCircle, '#10B981'],
    progress: [TrendingUp, '#F59E0B'],
  };
  const [Icon, color] = map[type] || [Activity, '#6B7280'];
  return (
    <div style={{
      width: 34, height: 34, borderRadius: 10, flexShrink: 0,
      background: `linear-gradient(135deg, ${color}20, ${color}08)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', color,
      boxShadow: `0 2px 8px ${color}12`,
    }}>
      <Icon size={15} />
    </div>
  );
}

/* ─── Insight Pill ─── */
const insightTexts = [
  "Priya's adherence dropped to 85% — consider a diet check-in",
  "Rohit is progressing well on his strength program",
  "Vikram's weight loss is on track at -0.8kg/week",
  "Neha's new program starts next week — prep ready?",
];
const randomInsight = insightTexts[Math.floor(Math.random() * insightTexts.length)];

/* ─── Compliance Data ─── */
const complianceData = [
  { name: 'On Track', value: 76, color: '#10B981' },
  { name: 'Partial', value: 12, color: '#F59E0B' },
  { name: 'Missed', value: 12, color: '#F43F5E' },
];

/* ─── Weekly session data ─── */
const weeklySessions = [
  { day: 'Mon', sessions: 8 }, { day: 'Tue', sessions: 12 },
  { day: 'Wed', sessions: 6 }, { day: 'Thu', sessions: 14 },
  { day: 'Fri', sessions: 10 }, { day: 'Sat', sessions: 4 },
  { day: 'Sun', sessions: 2 },
];

export default function Dashboard() {
  const [time, setTime] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    update();
    const id = setInterval(update, 10000);
    return () => clearInterval(id);
  }, []);

  const activeClients = MOCK_CLIENTS.filter(c => c.status === 'active');
  const totalSessions = activeClients.reduce((a, c) => a + c.programWeek, 0);
  const avgAdherence = 88;

  const metrics = [
    { icon: Users, label: 'Active Clients', value: `${activeClients.length}`, prev: 5, unit: '', color: '#2563EB', sparkline: [3, 4, 3, 5, 4, 6, 5, 7, 6], accent: 'blue' },
    { icon: ClipboardList, label: 'Total Programs', value: `${MOCK_CLIENTS.length}`, prev: 5, unit: '', color: '#8B5CF6', sparkline: [2, 4, 3, 5, 4, 6, 5, 6, 7], accent: 'purple' },
    { icon: TrendingUp, label: 'Avg. Adherence', value: `${avgAdherence}`, prev: 85, unit: '%', color: '#10B981', sparkline: [82, 85, 84, 86, 88, 87, 89, 90, 88], accent: 'green' },
    { icon: Flame, label: 'Weekly Sessions', value: `${totalSessions}`, prev: 22, unit: '', color: '#F59E0B', sparkline: [18, 20, 22, 21, 24, 23, 25, 24, totalSessions], accent: 'orange' },
  ];

  const weightData = MOCK_CLIENTS[0].progress.weight;
  const chartData = weightData.map(d => ({ name: d.week.replace('Week ', 'W'), weight: d.val }));

  return (
    <div className="page-content" style={{ animation: 'slideUp 0.4s var(--ease) both' }}>
      {/* ─── Decorative Orbs ─── */}
      <div className="orb orb-blue animate-float-slow" />
      <div className="orb orb-purple animate-float" style={{ animationDelay: '-2s' }} />
      <div className="orb orb-rose animate-float-slow" style={{ animationDelay: '-3s' }} />
      <div className="orb orb-emerald animate-float" style={{ animationDelay: '-4s' }} />

      {/* ─── Header ─── */}
      <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, gap: 24, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6, flexWrap: 'wrap' }}>
            <h1 style={{
              fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 700, letterSpacing: '-0.3px',
              background: 'linear-gradient(135deg, var(--text) 40%, var(--accent) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              {getGreeting()}, {MOCK_TRAINER.name.split(' ')[0]}
            </h1>
            <div style={{
              padding: '4px 14px 4px 10px', borderRadius: 20,
              background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(139,92,246,0.06))',
              border: '1px solid rgba(37,99,235,0.1)',
              fontSize: 12, fontWeight: 600, color: 'var(--accent)',
              display: 'flex', alignItems: 'center', gap: 6,
              boxShadow: '0 2px 8px rgba(37,99,235,0.06)',
            }}>
              <Sparkles size={12} style={{ color: '#8B5CF6' }} />
              <span style={{ background: 'linear-gradient(135deg, var(--accent), var(--purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {randomInsight}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', fontSize: 13 }}>
            <span>{formatDate()}</span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--text-muted)' }} />
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{time}</span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--text-muted)' }} />
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--success)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', animation: 'pulseGlow 2s ease-in-out infinite' }} />
              <span style={{ color: 'var(--text-muted)' }}>All systems operational</span>
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative', zIndex: 2 }}>
          <div style={{ position: 'relative', transition: 'all 0.2s', width: searchFocused ? 280 : 200 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input
              type="text" placeholder="Search clients, plans..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="input-field"
              style={{ padding: '9px 14px 9px 36px', fontSize: 13 }}
            />
          </div>

          <button style={{
            position: 'relative', width: 36, height: 36, borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(0,0,0,0.04)', cursor: 'pointer', color: 'var(--text-muted)',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.9)'; e.currentTarget.style.color = 'var(--text)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.7)'; e.currentTarget.style.color = 'var(--text-muted)' }}>
            <Bell size={16} />
            <span style={{ position: 'absolute', top: 5, right: 5, width: 7, height: 7, borderRadius: '50%', background: 'var(--rose)', border: '2px solid white' }} />
          </button>

          <Link href="/analytics" className="btn btn-primary btn-sm" style={{ padding: '8px 16px', gap: 6, fontSize: 13 }}>
            <BarChart3 size={14} />
            Analytics
          </Link>
        </div>
      </header>

      {/* ─── KPI Cards ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28, position: 'relative', zIndex: 1 }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ animation: `slideUp 0.4s var(--ease) ${i * 0.07}s both` }}>
            <KpiCard {...m} />
          </div>
        ))}
      </div>

      {/* ─── Analytics Row ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.9fr 0.9fr', gap: 18, marginBottom: 28, position: 'relative', zIndex: 1 }}>
        {/* Weight Trend */}
        <div className="card card-accent-blue" style={{ padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
              <div className="section-heading blue" style={{ fontSize: 15 }}>Weight Trend</div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Priya Sharma • 8-week progression</p>
            </div>
            <Link href="/analytics" style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4 }}>
              Full Report <ChevronRight size={12} />
            </Link>
          </div>
          <div style={{ height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity={0.2} />
                    <stop offset="50%" stopColor="#8B5CF6" stopOpacity={0.08} />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} dy={6} />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} dx={-4} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.4)', borderRadius: 12,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.06)', padding: '10px 14px',
                  }}
                  labelStyle={{ fontSize: 12, color: 'var(--text-muted)' }}
                  itemStyle={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}
                />
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.02)" vertical={false} />
                <Area type="monotone" dataKey="weight" stroke="#2563EB" strokeWidth={2.5} fill="url(#weightGrad)" dot={false} activeDot={{ r: 5, fill: '#2563EB', stroke: 'white', strokeWidth: 2, style: { filter: 'drop-shadow(0 0 4px rgba(37,99,235,0.3))' } }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Compliance */}
        <div className="card card-accent-green" style={{ padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div className="section-heading green" style={{ fontSize: 15 }}>Adherence</div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Overall compliance</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>76%</span>
              <span style={{ fontSize: 11, color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2 }}>
                <ArrowUpRight size={10} /> +3%
              </span>
            </div>
          </div>
          <div style={{ height: 158 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={complianceData} cx="50%" cy="50%" innerRadius={42} outerRadius={60} paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270}>
                  {complianceData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.4)', borderRadius: 12,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.06)', padding: '8px 12px',
                  }}
                  labelStyle={{ fontSize: 12, color: 'var(--text-muted)' }}
                  itemStyle={{ fontSize: 13, fontWeight: 600 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 2 }}>
            {complianceData.map(e => (
              <div key={e.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-secondary)' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: e.color }} />
                {e.name}
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>{e.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Sessions Bar */}
        <div className="card card-accent-orange" style={{ padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div className="section-heading orange" style={{ fontSize: 15 }}>Weekly Sessions</div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>This week's activity</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>56</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>sessions</span>
            </div>
          </div>
          <div style={{ height: 158 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySessions}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} dy={4} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.4)', borderRadius: 12,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.06)', padding: '8px 12px',
                  }}
                  itemStyle={{ fontSize: 13, fontWeight: 600 }}
                />
                <Bar dataKey="sessions" radius={[4, 4, 0, 0]} maxBarSize={24}>
                  {weeklySessions.map((e, i) => (
                    <Cell key={i} fill={e.sessions >= 10 ? '#2563EB' : e.sessions >= 6 ? '#8B5CF6' : '#F59E0B'} fillOpacity={0.7 + (e.sessions / 14) * 0.3} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ─── Bottom Section ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20, position: 'relative', zIndex: 1 }}>
        {/* Activity Feed */}
        <div className="card card-accent-purple" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div className="section-heading purple">Activity</div>
            <button style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.15s', fontFamily: 'var(--font-sans)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >View All</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {MOCK_ACTIVITY.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, animation: i === 0 ? 'slideUp 0.3s ease-out both' : undefined }}>
                <ActIcon type={a.type} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{a.client}</span>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)', marginLeft: 4 }}>{a.detail}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Clients */}
        <div className="card card-accent-rose" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div className="section-heading" style={{ gap: 10, fontFamily: 'var(--font-heading)', fontSize: 17, fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center' }}>
              <span style={{ width: 4, height: 18, borderRadius: 2, background: 'linear-gradient(180deg, #F43F5E, #E11D48)', flexShrink: 0 }} />
              Priority Clients
            </div>
            <Link href="/clients" style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4 }}>
              All Clients <ChevronRight size={12} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {MOCK_CLIENTS.filter(c => c.status !== 'delivered').map(c => {
              const prog = c.progress?.weight?.length || 0;
              const progPct = Math.min(Math.round((prog / 12) * 100), 100);
              const calColor = getInitialsColor(c.id);
              return (
                <div key={c.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 14px', borderRadius: 12,
                  transition: 'all 0.15s', cursor: 'pointer',
                  border: '1px solid transparent',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = `linear-gradient(135deg, ${calColor}06, transparent)`; e.currentTarget.style.borderColor = `${calColor}12` }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent' }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: `linear-gradient(135deg, ${calColor}20, ${calColor}08)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 700, color: calColor,
                    boxShadow: `0 3px 10px ${calColor}15`,
                  }}>
                    {c.initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{c.name}</span>
                      <span style={{
                        padding: '2px 8px', borderRadius: 5, fontSize: 10, fontWeight: 600,
                        background: c.status === 'active' ? 'rgba(16,185,129,0.12)' : c.status === 'review' ? 'rgba(245,158,11,0.12)' : 'rgba(37,99,235,0.12)',
                        color: c.status === 'active' ? '#059669' : c.status === 'review' ? '#D97706' : 'var(--accent)',
                      }}>
                        {c.status === 'active' ? 'Active' : c.status === 'review' ? 'Review' : 'Delivered'}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                      <span style={{ color: calColor, fontWeight: 500 }}>{c.goal}</span> • {c.split} • {c.calories} kcal
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <ProgressRing pct={progPct} size={34} stroke={3} color={calColor} />
                    <span style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 500 }}>W{c.programWeek}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
