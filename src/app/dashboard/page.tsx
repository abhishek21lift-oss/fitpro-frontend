'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users, ClipboardList, FileText, TrendingUp,
  Activity, Search, Bell, Sparkles,
  CheckCircle, BarChart3, Dumbbell, Zap,
  ArrowUpRight, ArrowDownRight, ChevronRight, Flame,
  Target, Heart, Award, Clock, Trophy, Star,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  BarChart, Bar, RadialBarChart, RadialBar,
} from 'recharts';
import {
  MOCK_CLIENTS, MOCK_ACTIVITY, MOCK_TRAINER,
  getGreeting, formatDate, getInitialsColor,
} from '../../lib/mock-data';

/* ─── Sparkline ─── */
function Sparkline({ data, color = '#6366F1', height = 40 }: { data: number[]; color?: string; height?: number }) {
  if (!data || data.length < 2) return null;
  const w = 90;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${height - ((v - min) / range) * (height - 8) - 4}`).join(' ');
  const fillPts = `M0,${height} L${pts.split(' ').map((p, i, arr) => (i === 0 ? `0,${p.split(',')[1]}` : p)).join(' L ')} L${w},${height} Z`;
  return (
    <svg width={w} height={height} viewBox={`0 0 ${w} ${height}`} style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id={`sg-${color.replace('#', '')}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </linearGradient>
        <linearGradient id={`fill-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M${pts}`} fill="none" stroke={`url(#sg-${color.replace('#', '')})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle
        cx={pts.split(' ').pop()!.split(',')[0]}
        cy={pts.split(' ').pop()!.split(',')[1]}
        r="3" fill={color} stroke="white" strokeWidth="1.5"
        style={{ filter: `drop-shadow(0 0 4px ${color}80)` }}
      />
    </svg>
  );
}

/* ─── Mini Ring ─── */
function ProgressRing({ pct, size = 40, stroke = 3.5, color = '#6366F1' }: { pct: number; size?: number; stroke?: number; color?: string }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id={`ring-${color.replace('#', '')}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={color} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={`url(#ring-${color.replace('#', '')})`}
        strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ filter: `drop-shadow(0 0 4px ${color}60)` }}
      />
    </svg>
  );
}

/* ─── KPI Card (premium colourful) ─── */
interface KpiProps {
  icon: any; label: string; value: string; unit: string;
  color: string; color2: string; sparkline: number[];
  change: number; isUp: boolean; bg: string;
}
function KpiCard({ icon: Icon, label, value, unit, color, color2, sparkline, change, isUp, bg }: KpiProps) {
  return (
    <div style={{
      background: bg,
      borderRadius: 20,
      padding: '22px 22px 18px',
      display: 'flex', flexDirection: 'column', gap: 14,
      position: 'relative', overflow: 'hidden',
      border: `1px solid ${color}20`,
      boxShadow: `0 4px 24px ${color}18, 0 1px 4px ${color}10`,
      transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
      cursor: 'default',
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px) scale(1.01)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 16px 48px ${color}30, 0 4px 16px ${color}18`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = '';
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 24px ${color}18, 0 1px 4px ${color}10`;
      }}
    >
      {/* Background glow blob */}
      <div style={{
        position: 'absolute', top: -30, right: -30, width: 120, height: 120,
        borderRadius: '50%', background: `radial-gradient(circle, ${color}18, transparent)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -20, left: -10, width: 80, height: 80,
        borderRadius: '50%', background: `radial-gradient(circle, ${color2}12, transparent)`,
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: 46, height: 46, borderRadius: 14, flexShrink: 0,
          background: `linear-gradient(135deg, ${color}, ${color2})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white',
          boxShadow: `0 6px 20px ${color}40`,
        }}>
          <Icon size={20} />
        </div>
        <Sparkline data={sparkline} color={color} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600, letterSpacing: '0.3px', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{
            fontSize: 30, fontWeight: 800, letterSpacing: '-1px',
            background: `linear-gradient(135deg, ${color}, ${color2})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>{value}</span>
          {unit && <span style={{ fontSize: 13, color: '#94A3B8', fontWeight: 500 }}>{unit}</span>}
        </div>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700,
        color: isUp ? '#10B981' : '#F43F5E',
        padding: '4px 10px', borderRadius: 8,
        background: isUp ? 'rgba(16,185,129,0.08)' : 'rgba(244,63,94,0.08)',
        alignSelf: 'flex-start',
      }}>
        {isUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
        <span>{Math.abs(change).toFixed(1)}%</span>
        <span style={{ color: '#94A3B8', fontWeight: 400 }}>vs last month</span>
      </div>
    </div>
  );
}

/* ─── Activity Icon ─── */
function ActIcon({ type }: { type: string }) {
  const map: Record<string, [any, string, string]> = {
    assessment: [ClipboardList, '#6366F1', '#8B5CF6'],
    plan: [FileText, '#EC4899', '#F43F5E'],
    delivery: [CheckCircle, '#10B981', '#059669'],
    progress: [TrendingUp, '#F59E0B', '#F97316'],
  };
  const [Icon, c1, c2] = map[type] || [Activity, '#6B7280', '#9CA3AF'];
  return (
    <div style={{
      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
      background: `linear-gradient(135deg, ${c1}, ${c2})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'white', boxShadow: `0 4px 12px ${c1}30`,
    }}>
      <Icon size={15} />
    </div>
  );
}

/* ─── Data ─── */
const complianceData = [
  { name: 'On Track', value: 76, color: '#10B981' },
  { name: 'Partial', value: 12, color: '#F59E0B' },
  { name: 'Missed', value: 12, color: '#F43F5E' },
];

const weeklySessions = [
  { day: 'Mon', sessions: 8 }, { day: 'Tue', sessions: 12 },
  { day: 'Wed', sessions: 6 }, { day: 'Thu', sessions: 14 },
  { day: 'Fri', sessions: 10 }, { day: 'Sat', sessions: 4 },
  { day: 'Sun', sessions: 2 },
];

const barColors = ['#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', '#F59E0B', '#10B981', '#06B6D4'];

const insightTexts = [
  "Priya's adherence dropped to 85% — consider a diet check-in",
  "Rohit is progressing well on his strength program",
  "Vikram's weight loss is on track at -0.8kg/week",
  "Neha's new program starts next week — prep ready?",
];

export default function Dashboard() {
  const [time, setTime] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [randomInsight] = useState(() => insightTexts[Math.floor(Math.random() * insightTexts.length)]);

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    update();
    const id = setInterval(update, 10000);
    return () => clearInterval(id);
  }, []);

  const activeClients = MOCK_CLIENTS.filter(c => c.status === 'active');
  const totalSessions = activeClients.reduce((a, c) => a + c.programWeek, 0);
  const avgAdherence = 88;

  const metrics: KpiProps[] = [
    {
      icon: Users, label: 'Active Clients', value: `${activeClients.length}`, unit: '',
      color: '#6366F1', color2: '#8B5CF6',
      bg: 'linear-gradient(145deg, #fafbff, #f0f1ff)',
      sparkline: [3, 4, 3, 5, 4, 6, 5, 7, 6],
      change: 3.0, isUp: true,
    },
    {
      icon: Flame, label: 'Weekly Sessions', value: `${totalSessions}`, unit: '',
      color: '#F43F5E', color2: '#EC4899',
      bg: 'linear-gradient(145deg, #fffafc, #fff0f4)',
      sparkline: [18, 20, 22, 21, 24, 23, 25, 24, totalSessions],
      change: 5.2, isUp: true,
    },
    {
      icon: TrendingUp, label: 'Avg. Adherence', value: `${avgAdherence}`, unit: '%',
      color: '#10B981', color2: '#059669',
      bg: 'linear-gradient(145deg, #f7fdfb, #edfaf5)',
      sparkline: [82, 85, 84, 86, 88, 87, 89, 90, 88],
      change: 2.1, isUp: true,
    },
    {
      icon: Trophy, label: 'Goals Hit', value: '14', unit: '',
      color: '#F59E0B', color2: '#F97316',
      bg: 'linear-gradient(145deg, #fffdf5, #fff8e6)',
      sparkline: [8, 9, 10, 11, 10, 12, 13, 14, 14],
      change: 1.4, isUp: false,
    },
  ];

  const weightData = MOCK_CLIENTS[0].progress.weight;
  const chartData = weightData.map(d => ({ name: d.week.replace('Week ', 'W'), weight: d.val }));

  return (
    <div className="page-content" style={{ animation: 'slideUp 0.4s var(--ease) both' }}>

      {/* ─── Mesh Gradient Orbs ─── */}
      <div className="orb orb-1" style={{ position: 'absolute', top: -120, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div className="orb orb-2" style={{ position: 'absolute', top: 200, left: -150, width: 450, height: 450, borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,63,94,0.08), transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div className="orb orb-3" style={{ position: 'absolute', bottom: 100, right: 100, width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.07), transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div className="orb orb-4" style={{ position: 'absolute', bottom: 300, left: 200, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.07), transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* ─── Header ─── */}
      <header style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        marginBottom: 32, gap: 24, flexWrap: 'wrap',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
            <h1 className="dashboard-title" style={{
              fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px',
              background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 50%, #F59E0B 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              {getGreeting()}, {MOCK_TRAINER.name.split(' ')[0]} ✨
            </h1>
          </div>
          {/* AI Insight Pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 10,
            padding: '6px 16px 6px 10px', borderRadius: 24,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(236,72,153,0.04))',
            border: '1px solid rgba(99,102,241,0.14)',
            boxShadow: '0 2px 12px rgba(99,102,241,0.08)',
            fontSize: 12, fontWeight: 600,
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: 8,
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
            }}>
              <Sparkles size={11} color="white" />
            </div>
            <span style={{
              background: 'linear-gradient(135deg, #6366F1, #EC4899)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>{randomInsight}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#64748B', fontSize: 13 }}>
            <span>{formatDate()}</span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#CBD5E1' }} />
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{time}</span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#CBD5E1' }} />
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px rgba(16,185,129,0.6)', animation: 'pulseGlow 2s ease-in-out infinite', display: 'inline-block' }} />
              <span style={{ color: '#64748B' }}>All systems operational</span>
            </span>
          </div>
        </div>

        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative', zIndex: 2 }}>
          <div className="search-wrap" style={{ position: 'relative', transition: 'all 0.25s', width: searchFocused ? 290 : 210 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none' }} />
            <input
              type="text" placeholder="Search clients, plans..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="input-field"
              style={{ padding: '9px 14px 9px 36px', fontSize: 13 }}
            />
          </div>

          <button style={{
            position: 'relative', width: 38, height: 38, borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(0,0,0,0.05)', cursor: 'pointer', color: '#64748B',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'white'; (e.currentTarget as HTMLButtonElement).style.color = '#1e293b'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.9)'; (e.currentTarget as HTMLButtonElement).style.color = '#64748B'; }}
          >
            <Bell size={16} />
            <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: '#F43F5E', border: '2px solid white', boxShadow: '0 0 6px rgba(244,63,94,0.5)' }} />
          </button>

          <Link href="/analytics" style={{
            display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px',
            borderRadius: 12, fontSize: 13, fontWeight: 700, color: 'white',
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
            transition: 'all 0.2s', textDecoration: 'none',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 24px rgba(99,102,241,0.4)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = ''; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 16px rgba(99,102,241,0.35)'; }}
          >
            <BarChart3 size={14} />
            Analytics
          </Link>
        </div>
      </header>

      {/* ─── KPI Grid ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 18, marginBottom: 28, position: 'relative', zIndex: 1 }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ animation: `slideUp 0.4s var(--ease) ${i * 0.08}s both` }}>
            <KpiCard {...m} />
          </div>
        ))}
      </div>

      {/* ─── Analytics Row ─── */}
      <div className="grid-analytics" style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.85fr 0.85fr', gap: 18, marginBottom: 28, position: 'relative', zIndex: 1 }}>

        {/* Weight Trend */}
        <div style={{
          background: 'white', borderRadius: 20, padding: 24,
          border: '1px solid rgba(99,102,241,0.1)',
          boxShadow: '0 4px 24px rgba(99,102,241,0.08)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, color: '#0f172a',
              }}>
                <span style={{ width: 4, height: 18, borderRadius: 2, background: 'linear-gradient(180deg, #6366F1, #8B5CF6)', flexShrink: 0, boxShadow: '0 0 8px rgba(99,102,241,0.4)' }} />
                Weight Trend
              </div>
              <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 3 }}>Priya Sharma • 8-week progression</p>
            </div>
          <Link href="/analytics" style={{
              fontSize: 12, fontWeight: 600,
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>Full Report <ChevronRight size={12} style={{ color: '#8B5CF6' }} /></Link>
          </div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="wg1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity={0.25} />
                    <stop offset="60%" stopColor="#EC4899" stopOpacity={0.08} />
                    <stop offset="100%" stopColor="#EC4899" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="stroke1" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} dy={6} />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} dx={-4} />
                <Tooltip
                  contentStyle={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: 14, boxShadow: '0 8px 32px rgba(99,102,241,0.12)', padding: '10px 14px' }}
                  labelStyle={{ fontSize: 12, color: '#64748B' }}
                  itemStyle={{ fontSize: 14, fontWeight: 700, color: '#6366F1' }}
                />
                <Area type="monotone" dataKey="weight" stroke="url(#stroke1)" strokeWidth={3} fill="url(#wg1)" dot={false}
                  activeDot={{ r: 6, fill: '#6366F1', stroke: 'white', strokeWidth: 2, style: { filter: 'drop-shadow(0 0 6px rgba(99,102,241,0.5))' } }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Compliance Donut */}
        <div style={{
          background: 'white', borderRadius: 20, padding: 22,
          border: '1px solid rgba(16,185,129,0.12)',
          boxShadow: '0 4px 24px rgba(16,185,129,0.08)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                <span style={{ width: 4, height: 18, borderRadius: 2, background: 'linear-gradient(180deg, #10B981, #059669)', flexShrink: 0, boxShadow: '0 0 8px rgba(16,185,129,0.4)' }} />
                Adherence
              </div>
              <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 3 }}>Overall compliance</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{
                fontSize: 24, fontWeight: 800,
                background: 'linear-gradient(135deg, #10B981, #059669)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>76%</span>
              <span style={{ fontSize: 11, color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2 }}>
                <ArrowUpRight size={10} /> +3%
              </span>
            </div>
          </div>
          <div style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={complianceData} cx="50%" cy="50%" innerRadius={44} outerRadius={62} paddingAngle={4} dataKey="value" startAngle={90} endAngle={-270}>
                  {complianceData.map((e, i) => (
                    <Cell key={i} fill={e.color} style={{ filter: `drop-shadow(0 0 6px ${e.color}50)` }} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)', border: '1px solid rgba(16,185,129,0.12)', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.06)', padding: '8px 12px' }}
                  itemStyle={{ fontSize: 13, fontWeight: 600 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 4 }}>
            {complianceData.map(e => (
              <div key={e.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#64748B' }}>
                <span style={{ width: 8, height: 8, borderRadius: 3, background: e.color, boxShadow: `0 0 4px ${e.color}60` }} />
                {e.name} <span style={{ fontWeight: 700, color: '#0f172a' }}>{e.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Sessions Bar */}
        <div style={{
          background: 'white', borderRadius: 20, padding: 22,
          border: '1px solid rgba(245,158,11,0.12)',
          boxShadow: '0 4px 24px rgba(245,158,11,0.08)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                <span style={{ width: 4, height: 18, borderRadius: 2, background: 'linear-gradient(180deg, #F59E0B, #F97316)', flexShrink: 0, boxShadow: '0 0 8px rgba(245,158,11,0.4)' }} />
                Sessions
              </div>
              <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 3 }}>This week's activity</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{
                fontSize: 24, fontWeight: 800,
                background: 'linear-gradient(135deg, #F59E0B, #F97316)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>56</span>
              <span style={{ fontSize: 11, color: '#94A3B8' }}>sessions</span>
            </div>
          </div>
          <div style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySessions}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} dy={4} />
                <Tooltip
                  contentStyle={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)', border: '1px solid rgba(245,158,11,0.12)', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.06)', padding: '8px 12px' }}
                  itemStyle={{ fontSize: 13, fontWeight: 600 }}
                />
                <Bar dataKey="sessions" radius={[6, 6, 0, 0]} maxBarSize={22}>
                  {weeklySessions.map((e, i) => (
                    <Cell key={i} fill={barColors[i]} style={{ filter: `drop-shadow(0 0 4px ${barColors[i]}50)` }} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ─── Bottom Section ─── */}
      <div className="grid-bottom" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20, position: 'relative', zIndex: 1 }}>

        {/* Activity Feed */}
        <div style={{
          background: 'white', borderRadius: 20, padding: 24,
          border: '1px solid rgba(139,92,246,0.1)',
          boxShadow: '0 4px 24px rgba(139,92,246,0.07)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-heading)', fontSize: 17, fontWeight: 700, color: '#0f172a' }}>
              <span style={{ width: 4, height: 20, borderRadius: 2, background: 'linear-gradient(180deg, #8B5CF6, #EC4899)', flexShrink: 0, boxShadow: '0 0 8px rgba(139,92,246,0.4)' }} />
              Recent Activity
            </div>
            <button style={{
              fontSize: 12, fontWeight: 700, background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', border: 'none', cursor: 'pointer',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              fontFamily: 'var(--font-sans)',
            } as any}>View All</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {MOCK_ACTIVITY.map((a, i) => (
              <div key={i} style={{
                display: 'flex', gap: 12,
                padding: '10px 14px', borderRadius: 14,
                background: 'rgba(248,250,252,0.8)',
                border: '1px solid rgba(0,0,0,0.03)',
                transition: 'all 0.2s',
                animation: `slideUp 0.3s var(--ease) ${i * 0.05}s both`,
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'white'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(139,92,246,0.08)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(248,250,252,0.8)'; (e.currentTarget as HTMLDivElement).style.boxShadow = ''; }}
              >
                <ActIcon type={a.type} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{a.client}</span>
                    <span style={{ fontSize: 13, color: '#64748B', marginLeft: 4 }}>{a.detail}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Clients */}
        <div style={{
          background: 'white', borderRadius: 20, padding: 24,
          border: '1px solid rgba(244,63,94,0.1)',
          boxShadow: '0 4px 24px rgba(244,63,94,0.07)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-heading)', fontSize: 17, fontWeight: 700, color: '#0f172a' }}>
              <span style={{ width: 4, height: 20, borderRadius: 2, background: 'linear-gradient(180deg, #F43F5E, #EC4899)', flexShrink: 0, boxShadow: '0 0 8px rgba(244,63,94,0.4)' }} />
              Priority Clients
            </div>
            <Link href="/clients" style={{
              fontSize: 12, fontWeight: 700,
              background: 'linear-gradient(135deg, #F43F5E, #EC4899)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              display: 'flex', alignItems: 'center', gap: 3,
            }}>All Clients <ChevronRight size={12} style={{ color: '#EC4899' }} /></Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {MOCK_CLIENTS.filter(c => c.status !== 'delivered').map(c => {
              const prog = c.progress?.weight?.length || 0;
              const progPct = Math.min(Math.round((prog / 12) * 100), 100);
              const calColor = getInitialsColor(c.id);
              return (
                <div key={c.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 14px', borderRadius: 14,
                  background: 'rgba(248,250,252,0.8)',
                  border: '1px solid rgba(0,0,0,0.03)',
                  transition: 'all 0.2s', cursor: 'pointer',
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.background = `linear-gradient(135deg, ${calColor}06, white)`;
                    (e.currentTarget as HTMLDivElement).style.borderColor = `${calColor}18`;
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 16px ${calColor}12`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.background = 'rgba(248,250,252,0.8)';
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0,0,0,0.03)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '';
                  }}
                >
                  <div style={{
                    width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                    background: `linear-gradient(135deg, ${calColor}, ${calColor}99)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 800, color: 'white',
                    boxShadow: `0 4px 14px ${calColor}35`,
                  }}>{c.initials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{c.name}</span>
                      <span style={{
                        padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700,
                        background: c.status === 'active'
                          ? 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(5,150,105,0.06))'
                          : c.status === 'review'
                            ? 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(249,115,22,0.06))'
                            : 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.06))',
                        color: c.status === 'active' ? '#059669' : c.status === 'review' ? '#D97706' : '#6366F1',
                      }}>
                        {c.status === 'active' ? 'Active' : c.status === 'review' ? 'Review' : 'Delivered'}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>
                      <span style={{ color: calColor, fontWeight: 600 }}>{c.goal}</span> • {c.split} • {c.calories} kcal
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <ProgressRing pct={progPct} size={36} stroke={3.5} color={calColor} />
                    <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>W{c.programWeek}</span>
                    <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600 }}></span>
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
