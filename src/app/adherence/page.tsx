'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp, CheckCircle, XCircle, AlertTriangle,
  Users, Clock, ArrowUpRight, ArrowDownRight,
  ChevronRight, Search, Sparkles, Target,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  LineChart, Line,
} from 'recharts';
import { api } from '../../lib/api';

const COLORS = ['#10B981', '#6366F1', '#F59E0B', '#8B5CF6', '#F43F5E', '#06B6D4'];

export default function AdherencePage() {
  const [period, setPeriod] = useState<'weekly' | 'client'>('weekly');
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    api.clients.list().then(setClients).catch(() => setClients([]));
  }, []);

  const clientAdherence = clients.map((c, i) => ({
    id: c.id, name: c.name, initials: c.initials,
    rate: 0,
    trend: 0,
    completed: 0,
    total: 0,
    status: c.status,
  }));

  return (
    <div className="page-content" style={{ animation: 'slideUp 0.4s var(--ease) both' }}>
      <div style={{ position: 'absolute', top: -100, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.08), transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: 150, left: -100, width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.06), transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', marginBottom: 28, position: 'relative', zIndex: 1 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: 'linear-gradient(135deg, #10B981, #059669)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
              boxShadow: '0 6px 20px rgba(16,185,129,0.25)',
            }}>
              <TrendingUp size={22} />
            </div>
            <h1 style={{
              fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700, letterSpacing: '-0.4px',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Adherence
            </h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
            Track client compliance and program adherence rates
          </p>
        </div>

        <div style={{
          display: 'flex', gap: 4,
          background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(12px)',
          borderRadius: 12, padding: 4, border: '1px solid rgba(255,255,255,0.3)',
        }}>
          {(['weekly', 'client'] as const).map(v => (
            <button key={v} onClick={() => setPeriod(v)}
              style={{
                padding: '7px 18px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: period === v ? 'white' : 'transparent',
                color: period === v ? 'var(--text)' : 'var(--text-muted)',
                fontWeight: period === v ? 600 : 500,
                boxShadow: period === v ? '0 2px 6px rgba(0,0,0,0.04)' : 'none',
                fontFamily: 'var(--font-sans)', fontSize: 13, textTransform: 'capitalize',
                transition: 'all 0.15s',
              }}>{v === 'weekly' ? 'Weekly View' : 'By Client'}</button>
          ))}
        </div>
      </header>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24, position: 'relative', zIndex: 1 }}>
          {[
          { label: 'Overall Adherence', value: '—', change: '—', up: true, icon: TrendingUp, color: '#10B981' },
          { label: 'On Track', value: '—', change: '—', up: true, icon: CheckCircle, color: '#10B981' },
          { label: 'Needs Attention', value: '—', change: '—', up: false, icon: AlertTriangle, color: '#F59E0B' },
          { label: 'Missed Sessions', value: '—', change: '—', up: false, icon: XCircle, color: '#F43F5E' },
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

      {/* Weekly View */}
      {period === 'weekly' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18, position: 'relative', zIndex: 1 }}>
          {/* Adherence Trend */}
          <div style={{
            background: 'white', borderRadius: 20, padding: 24,
            border: '1px solid rgba(16,185,129,0.1)',
            boxShadow: '0 4px 24px rgba(16,185,129,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                <span style={{ width: 4, height: 18, borderRadius: 2, background: 'linear-gradient(180deg, #10B981, #059669)', flexShrink: 0 }} />
                Adherence Trend
              </div>
            </div>
            <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: 13 }}>
              No adherence data yet
            </div>
          </div>

          {/* Compliance Distribution */}
          <div style={{
            background: 'white', borderRadius: 20, padding: 24,
            border: '1px solid rgba(99,102,241,0.08)',
            boxShadow: '0 4px 24px rgba(99,102,241,0.05)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>
              <span style={{ width: 4, height: 18, borderRadius: 2, background: 'linear-gradient(180deg, #6366F1, #8B5CF6)', flexShrink: 0 }} />
              Compliance Breakdown
            </div>
            <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: 13 }}>
              No compliance data yet
            </div>
          </div>
        </div>
      )}

      {/* By Client View */}
      {period === 'client' && (
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {clientAdherence.map((c, i) => {
            const color = COLORS[i % COLORS.length];
            const pct = Math.round((c.completed / c.total) * 100);
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{c.name}</span>
                    <span style={{
                      padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700,
                      background: pct >= 85 ? 'rgba(16,185,129,0.12)' : pct >= 70 ? 'rgba(245,158,11,0.12)' : 'rgba(244,63,94,0.12)',
                      color: pct >= 85 ? '#059669' : pct >= 70 ? '#D97706' : '#E11D48',
                    }}>
                      {pct}%
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle size={12} style={{ color }} /> {c.completed}/{c.total} sessions
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Target size={12} style={{ color }} /> {c.rate}% rate
                    </span>
                  </div>
                </div>

                <div style={{ width: 80, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 2, width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}AA)`, transition: 'width 0.3s' }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 700,
                    color: c.trend >= 0 ? '#10B981' : '#F43F5E',
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
