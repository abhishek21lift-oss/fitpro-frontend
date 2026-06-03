'use client';

import { useState, useEffect } from 'react';
import {
  Flame, Clock, Users, TrendingUp, Calendar,
  ChevronRight, ArrowUpRight, ArrowDownRight, Zap,
  Dumbbell, Search, Sparkles,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line,
  AreaChart, Area,
} from 'recharts';
import { api } from '../../lib/api';

const weeklyData = [
  { week: 'W1', sessions: 42, avgDuration: 48, adherence: 82 },
  { week: 'W2', sessions: 45, avgDuration: 50, adherence: 85 },
  { week: 'W3', sessions: 40, avgDuration: 47, adherence: 80 },
  { week: 'W4', sessions: 48, avgDuration: 52, adherence: 88 },
  { week: 'W5', sessions: 52, avgDuration: 51, adherence: 86 },
  { week: 'W6', sessions: 50, avgDuration: 53, adherence: 90 },
  { week: 'W7', sessions: 55, avgDuration: 54, adherence: 89 },
  { week: 'W8', sessions: 56, avgDuration: 52, adherence: 88 },
];

const COLORS = ['#6366F1', '#8B5CF6', '#10B981', '#F59E0B', '#F43F5E', '#06B6D4'];
const dayColors = ['#F43F5E', '#F59E0B', '#10B981', '#6366F1', '#8B5CF6', '#06B6D4', '#EC4899'];

export default function SessionsPage() {
  const [view, setView] = useState<'overview' | 'clients'>('overview');
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    api.clients.list().then(setClients).catch(() => setClients([]));
  }, []);

  const clientSessions = clients.map((c, i) => ({
    id: c.id, name: c.name, initials: c.initials,
    sessions: 0, avgDuration: 0, trend: 0, status: c.status,
  }));

  return (
    <div className="page-content" style={{ animation: 'slideUp 0.4s var(--ease) both' }}>
      <div style={{ position: 'absolute', top: -80, right: -60, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,63,94,0.08), transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: 200, left: -120, width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.06), transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', marginBottom: 28, position: 'relative', zIndex: 1 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: 'linear-gradient(135deg, #F43F5E, #F59E0B)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
              boxShadow: '0 6px 20px rgba(244,63,94,0.25)',
            }}>
              <Flame size={22} />
            </div>
            <h1 style={{
              fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700, letterSpacing: '-0.4px',
              background: 'linear-gradient(135deg, #F43F5E 0%, #F59E0B 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Weekly Sessions
            </h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
            Track session volume, duration trends, and client attendance
          </p>
        </div>

        <div style={{
          display: 'flex', gap: 4,
          background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(12px)',
          borderRadius: 12, padding: 4, border: '1px solid rgba(255,255,255,0.3)',
        }}>
          {(['overview', 'clients'] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              style={{
                padding: '7px 18px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: view === v ? 'white' : 'transparent',
                color: view === v ? 'var(--text)' : 'var(--text-muted)',
                fontWeight: view === v ? 600 : 500,
                boxShadow: view === v ? '0 2px 6px rgba(0,0,0,0.04)' : 'none',
                fontFamily: 'var(--font-sans)', fontSize: 13, textTransform: 'capitalize',
                transition: 'all 0.15s',
              }}>{v}</button>
          ))}
        </div>
      </header>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24, position: 'relative', zIndex: 1 }}>
        {[
          { label: 'Total Sessions', value: '388', change: '+8.2%', up: true, icon: Flame, color: '#F43F5E' },
          { label: 'Avg Duration', value: '51 min', change: '+3.4%', up: true, icon: Clock, color: '#F59E0B' },
          { label: 'Active Clients', value: '5', change: '0%', up: true, icon: Users, color: '#6366F1' },
          { label: 'Avg Sessions/Client', value: '9.7', change: '+5.1%', up: true, icon: TrendingUp, color: '#10B981' },
        ].map((s, i) => (
          <div key={i} style={{
            padding: '16px 18px', borderRadius: 16,
            background: `linear-gradient(135deg, ${s.color}08, ${s.color}02)`,
            border: `1px solid ${s.color}12`,
            boxShadow: `0 2px 8px ${s.color}08`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${s.color}, ${s.color}CC)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: `0 4px 10px ${s.color}30` }}>
                <s.icon size={16} />
              </div>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 700, color: s.up ? '#10B981' : '#F43F5E', background: s.up ? 'rgba(16,185,129,0.08)' : 'rgba(244,63,94,0.08)', padding: '2px 8px', borderRadius: 6 }}>
                {s.up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                {s.change}
              </span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px' }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginTop: 1 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Overview View */}
      {view === 'overview' && (
        <>
          {/* Weekly trend chart */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 18, marginBottom: 24, position: 'relative', zIndex: 1 }}>
            <div style={{
              background: 'white', borderRadius: 20, padding: 24,
              border: '1px solid rgba(244,63,94,0.1)',
              boxShadow: '0 4px 24px rgba(244,63,94,0.06)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                    <span style={{ width: 4, height: 18, borderRadius: 2, background: 'linear-gradient(180deg, #F43F5E, #F59E0B)', flexShrink: 0 }} />
                    Sessions Trend
                  </div>
                  <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>8-week progression</p>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#F43F5E' }}>
                  <ArrowUpRight size={12} style={{ display: 'inline' }} /> +14 vs W1
                </span>
              </div>
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData}>
                    <defs>
                      <linearGradient id="sessionGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F43F5E" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#F43F5E" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" vertical={false} />
                    <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                    <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)', border: '1px solid rgba(244,63,94,0.12)', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.06)', padding: '10px 14px' }} />
                    <Area type="monotone" dataKey="sessions" stroke="#F43F5E" strokeWidth={3} fill="url(#sessionGrad)" dot={{ r: 4, fill: '#F43F5E', stroke: 'white', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#F43F5E', stroke: 'white', strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Day distribution */}
            <div style={{
              background: 'white', borderRadius: 20, padding: 24,
              border: '1px solid rgba(245,158,11,0.1)',
              boxShadow: '0 4px 24px rgba(245,158,11,0.06)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 18 }}>
                <span style={{ width: 4, height: 18, borderRadius: 2, background: 'linear-gradient(180deg, #F59E0B, #F97316)', flexShrink: 0 }} />
                Day Distribution
              </div>
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { day: 'Mon', sessions: 8 }, { day: 'Tue', sessions: 12 },
                    { day: 'Wed', sessions: 6 }, { day: 'Thu', sessions: 14 },
                    { day: 'Fri', sessions: 10 }, { day: 'Sat', sessions: 4 },
                    { day: 'Sun', sessions: 2 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" vertical={false} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                    <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)', border: '1px solid rgba(245,158,11,0.12)', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.06)', padding: '8px 12px' }} />
                    <Bar dataKey="sessions" radius={[6, 6, 0, 0]} maxBarSize={32}>
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
                        <rect key={d} fill={dayColors[i]} style={{ filter: `drop-shadow(0 0 4px ${dayColors[i]}50)` }} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Duration & Adherence trend */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, position: 'relative', zIndex: 1 }}>
            {[
              { label: 'Avg Session Duration', unit: 'min', dataKey: 'avgDuration' as const, color: '#8B5CF6', gradId: 'durationGrad' },
              { label: 'Adherence Rate', unit: '%', dataKey: 'adherence' as const, color: '#10B981', gradId: 'adherenceGrad' },
            ].map(card => (
              <div key={card.label} style={{
                background: 'white', borderRadius: 20, padding: 24,
                border: `1px solid ${card.color}10`,
                boxShadow: `0 4px 24px ${card.color}06`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>
                  <span style={{ width: 4, height: 16, borderRadius: 2, background: `linear-gradient(180deg, ${card.color}, ${card.color}99)`, flexShrink: 0 }} />
                  {card.label}
                </div>
                <div style={{ height: 160 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" vertical={false} />
                      <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} domain={['dataMin - 5', 'dataMax + 5']} />
                      <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)', border: `1px solid ${card.color}12`, borderRadius: 14, padding: '8px 12px' }} />
                      <Line type="monotone" dataKey={card.dataKey} stroke={card.color} strokeWidth={3} dot={{ r: 4, fill: card.color, stroke: 'white', strokeWidth: 2 }} activeDot={{ r: 6, fill: card.color, stroke: 'white', strokeWidth: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Clients View */}
      {view === 'clients' && (
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {clientSessions.map((c, i) => {
            const color = COLORS[i % COLORS.length];
            return (
              <div key={c.id} style={{
                padding: '16px 20px', borderRadius: 16,
                background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.4)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
                transition: 'all 0.2s', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 16,
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 8px 24px ${color}12`; e.currentTarget.style.borderColor = `${color}20` }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)' }}
              >
                <div style={{
                  width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                  background: `linear-gradient(135deg, ${color}, ${color}99)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 800, color: 'white',
                  boxShadow: `0 4px 12px ${color}30`,
                }}>{c.initials}</div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{c.name}</div>
                  <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Flame size={12} style={{ color }} /> {c.sessions} sessions
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} style={{ color }} /> {c.avgDuration} min avg
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 700,
                    color: c.trend >= 0 ? '#10B981' : '#F43F5E',
                    padding: '3px 10px', borderRadius: 6,
                    background: c.trend >= 0 ? 'rgba(16,185,129,0.08)' : 'rgba(244,63,94,0.08)',
                  }}>
                    {c.trend >= 0 ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                    {Math.abs(c.trend)}%
                  </span>
                  <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
