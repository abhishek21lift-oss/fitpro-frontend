'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Users, ClipboardList, FileText, TrendingUp,
  Activity, Search, Bell, Sparkles,
  CheckCircle, BarChart3,
  ArrowUpRight, ArrowDownRight, ChevronRight, Flame,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import {
  MOCK_CLIENTS, MOCK_ACTIVITY, MOCK_TRAINER,
  getGreeting, formatDate, getInitialsColor,
} from '../../lib/mock-data';

/* ─── Sparkline ─── */
function Sparkline({ data, color = '#2563EB', height = 40 }: { data: number[]; color?: string; height?: number }) {
  if (!data || data.length < 2) return null;
  const w = 80;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${height - ((v - min) / range) * (height - 4) - 2}`).join(' ');
  return (
    <svg width={w} height={height} viewBox={`0 0 ${w} ${height}`} style={{ flexShrink: 0 }}>
      <path d={`M${pts}`} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts.split(' ').pop()!.split(',')[0]} cy={pts.split(' ').pop()!.split(',')[1]} r="2" fill={color} />
    </svg>
  );
}

/* ─── Mini Progress Ring ─── */
function ProgressRing({ pct, size = 36, stroke = 3, color = '#2563EB' }: { pct: number; size?: number; stroke?: number; color?: string }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`} />
    </svg>
  );
}

/* ─── KPI Card ─── */
function KpiCard({ icon: Icon, label, value, prev, unit, color, sparkline }: {
  icon: any; label: string; value: string; prev: number; unit: string; color: string; sparkline: number[];
}) {
  const change = ((prev - (prev * 0.97)) / prev) * 100;
  const isUp = change > 0;
  return (
    <div className="card card-hover" style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: `linear-gradient(135deg, ${color}15, ${color}05)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0,
        }}>
          <Icon size={18} />
        </div>
        <Sparkline data={sparkline} color={color} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--text)' }}>{value}</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{unit}</span>
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

/* ─── AI Insight ─── */
function AiInsight({ text }: { text: string }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '6px 14px 6px 10px', borderRadius: 20,
      background: 'linear-gradient(135deg, rgba(37,99,235,0.06), rgba(79,70,229,0.04))',
      border: '1px solid rgba(37,99,235,0.08)',
      fontSize: 12, fontWeight: 500, color: 'var(--accent)',
    }}>
      <Sparkles size={12} />
      {text}
    </div>
  );
}

/* ─── Counter ─── */
function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number>(0);
  useEffect(() => {
    const start = performance.now();
    const dur = 1000;
    const from = ref.current;
    const to = value;
    function tick(now: number) {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      const cur = Math.round(from + (to - from) * ease);
      setDisplay(cur);
      if (t < 1) requestAnimationFrame(tick);
    }
    ref.current = to;
    requestAnimationFrame(tick);
  }, [value]);
  return <>{display}{suffix}</>;
}

/* ─── Compliance Donut ─── */
const complianceData = [
  { name: 'On Track', value: 76, color: '#10B981' },
  { name: 'Missed', value: 12, color: '#EF4444' },
  { name: 'Partial', value: 12, color: '#F59E0B' },
];

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
      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
      background: `linear-gradient(135deg, ${color}12, ${color}06)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', color,
    }}>
      <Icon size={14} />
    </div>
  );
}

/* ─── Tools ─── */
const insightTexts = [
  "Priya's adherence dropped to 85% — consider a diet check-in",
  "Rohit is progressing well on his strength program",
  "Vikram's weight loss is on track at -0.8kg/week",
  "Neha's new program starts next week — prep ready?",
];
const randomInsight = insightTexts[Math.floor(Math.random() * insightTexts.length)];

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
    { icon: Users, label: 'Active Clients', value: `${activeClients.length}`, prev: 5, unit: '', color: '#2563EB', sparkline: [3, 4, 3, 5, 4, 6, 5, 7, 6] },
    { icon: ClipboardList, label: 'Total Programs', value: `${MOCK_CLIENTS.length}`, prev: 5, unit: '', color: '#8B5CF6', sparkline: [2, 4, 3, 5, 4, 6, 5, 6, 7] },
    { icon: TrendingUp, label: 'Avg. Adherence', value: `${avgAdherence}`, prev: 85, unit: '%', color: '#10B981', sparkline: [82, 85, 84, 86, 88, 87, 89, 90, 88] },
    { icon: Flame, label: 'Weekly Sessions', value: `${totalSessions}`, prev: 22, unit: '', color: '#F59E0B', sparkline: [18, 20, 22, 21, 24, 23, 25, 24, totalSessions] },
  ];

  const weightData = MOCK_CLIENTS[0].progress.weight;
  const chartData = weightData.map(d => ({ name: d.week.replace('Week ', 'W'), weight: d.val }));

  return (
    <div className="page-content" style={{ animation: 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
      {/* ─── Header ─── */}
      <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, gap: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.3px' }}>
              {getGreeting()}, {MOCK_TRAINER.name.split(' ')[0]}
            </h1>
            <div style={{
              padding: '3px 12px 3px 10px', borderRadius: 20,
              background: 'linear-gradient(135deg, rgba(37,99,235,0.07), rgba(79,70,229,0.04))',
              border: '1px solid rgba(37,99,235,0.08)',
              fontSize: 12, fontWeight: 600, color: 'var(--accent)',
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <Sparkles size={12} />
              {randomInsight}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', fontSize: 13 }}>
            <span>{formatDate()}</span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--text-muted)' }} />
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{time}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            position: 'relative', transition: 'all 0.2s',
            width: searchFocused ? 280 : 200,
          }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input
              type="text" placeholder="Search clients, plans..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={{
                width: '100%', padding: '9px 14px 9px 36px', borderRadius: 12,
                border: '1px solid rgba(0,0,0,0.04)', outline: 'none',
                fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text)',
                background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(12px)',
                transition: 'all 0.2s', WebkitBackdropFilter: 'blur(12px)',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.9)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.04)'; e.currentTarget.style.background = 'rgba(255,255,255,0.75)' }}
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
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.7)'; e.currentTarget.style.color = 'var(--text-muted)' }}
          >
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ animation: `slideUp 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 0.07}s both` }}>
            <KpiCard {...m} />
          </div>
        ))}
      </div>

      {/* ─── Analytics Row ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20, marginBottom: 28 }}>
        {/* Weight Trend */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 17, fontWeight: 700, color: 'var(--text)' }}>Weight Trend</h2>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Client: Priya Sharma • 8-week progression</p>
            </div>
            <Link href="/analytics" style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4 }}>
              Full Report <ChevronRight size={12} />
            </Link>
          </div>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} dy={8} />
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
                <Area type="monotone" dataKey="weight" stroke="#2563EB" strokeWidth={2} fill="url(#weightGrad)" dot={false} activeDot={{ r: 4, fill: '#2563EB', stroke: 'white', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Compliance */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 17, fontWeight: 700, color: 'var(--text)' }}>Adherence</h2>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Overall compliance rate</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)' }}>76%</span>
              <span style={{ fontSize: 11, color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2 }}>
                <ArrowUpRight size={10} /> +3%
              </span>
            </div>
          </div>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={complianceData} cx="50%" cy="50%" innerRadius={48} outerRadius={68} paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270}>
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
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 4 }}>
            {complianceData.map(e => (
              <div key={e.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: e.color }} />
                {e.name}
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>{e.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Bottom Section ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
        {/* Activity Feed */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 17, fontWeight: 700, color: 'var(--text)' }}>Activity</h2>
            <button style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.15s', fontFamily: 'var(--font-sans)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >View All</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {MOCK_ACTIVITY.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, animation: i === 0 ? 'slideUp 0.3s ease-out both' : undefined }}>
                <ActIcon type={a.type} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{a.client}</span>
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)', marginLeft: 4 }}>{a.detail}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Clients */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 17, fontWeight: 700, color: 'var(--text)' }}>Priority Clients</h2>
            <Link href="/clients" style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4 }}>
              All Clients <ChevronRight size={12} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {MOCK_CLIENTS.filter(c => c.status !== 'delivered').map(c => {
              const prog = c.progress?.weight?.length || 0;
              const progPct = Math.min(Math.round((prog / 12) * 100), 100);
              const calColor = getInitialsColor(c.id);
              return (
                <div key={c.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 14px', borderRadius: 12,
                  transition: 'all 0.15s', cursor: 'pointer',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.02)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >
                  <div style={{
                    width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                    background: `linear-gradient(135deg, ${calColor}15, ${calColor}05)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700, color: calColor,
                  }}>
                    {c.initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{c.name}</span>
                      <span className={`badge badge-${c.status === 'active' ? 'success' : c.status === 'review' ? 'warning' : 'info'}`}>
                        {c.status === 'active' ? 'Active' : c.status === 'review' ? 'Review' : 'Delivered'}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>
                      {c.goal} • {c.split} • {c.calories} kcal
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
