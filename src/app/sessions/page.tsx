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

const COLORS = ['#6366F1', '#8B5CF6', '#10B981', '#F59E0B', '#F43F5E', '#06B6D4'];

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
          { label: 'Total Sessions', value: '0', change: '—', up: true, icon: Flame, color: '#F43F5E' },
          { label: 'Avg Duration', value: '—', change: '—', up: true, icon: Clock, color: '#F59E0B' },
          { label: 'Active Clients', value: `${clients.length}`, change: '—', up: true, icon: Users, color: '#6366F1' },
          { label: 'Avg Sessions/Client', value: '0', change: '—', up: true, icon: TrendingUp, color: '#10B981' },
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

              </div>
              <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: 13 }}>
                No session data yet
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
              <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: 13 }}>
                No session data yet
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
                  <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: 13 }}>
                    No data yet
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
