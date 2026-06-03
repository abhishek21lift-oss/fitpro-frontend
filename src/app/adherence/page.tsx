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

const weeklyAdherence = [
  { week: 'W1', rate: 82, completed: 34, total: 42 },
  { week: 'W2', rate: 85, completed: 38, total: 45 },
  { week: 'W3', rate: 80, completed: 32, total: 40 },
  { week: 'W4', rate: 88, completed: 42, total: 48 },
  { week: 'W5', rate: 86, completed: 45, total: 52 },
  { week: 'W6', rate: 90, completed: 45, total: 50 },
  { week: 'W7', rate: 89, completed: 49, total: 55 },
  { week: 'W8', rate: 88, completed: 49, total: 56 },
];

const complianceData = [
  { name: 'On Track', value: 76, color: '#10B981' },
  { name: 'Partial', value: 14, color: '#F59E0B' },
  { name: 'Missed', value: 10, color: '#F43F5E' },
];

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
          { label: 'Overall Adherence', value: '86%', change: '+2.1%', up: true, icon: TrendingUp, color: '#10B981' },
          { label: 'On Track', value: '76%', change: '+3%', up: true, icon: CheckCircle, color: '#10B981' },
          { label: 'Needs Attention', value: '14%', change: '-1%', up: false, icon: AlertTriangle, color: '#F59E0B' },
          { label: 'Missed Sessions', value: '10%', change: '+2%', up: false, icon: XCircle, color: '#F43F5E' },
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
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyAdherence}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" vertical={false} />
                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                  <YAxis domain={[70, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                  <Tooltip
                    contentStyle={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)', border: '1px solid rgba(16,185,129,0.12)', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.06)', padding: '10px 14px' }}
                    formatter={(value: number) => [`${value}%`, 'Adherence']}
                  />
                  <Bar dataKey="rate" radius={[6, 6, 0, 0]} maxBarSize={36}>
                    {weeklyAdherence.map((_, i) => (
                      <Cell key={i} fill={weeklyAdherence[i].rate >= 85 ? '#10B981' : weeklyAdherence[i].rate >= 75 ? '#F59E0B' : '#F43F5E'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
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
            <div style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={complianceData} cx="50%" cy="50%" innerRadius={50} outerRadius={72} paddingAngle={4} dataKey="value" startAngle={90} endAngle={-270}>
                    {complianceData.map((e, i) => (
                      <Cell key={i} fill={e.color} style={{ filter: `drop-shadow(0 0 6px ${e.color}50)` }} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.06)', padding: '8px 12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 8 }}>
              {complianceData.map(e => (
                <div key={e.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#64748B' }}>
                  <span style={{ width: 8, height: 8, borderRadius: 3, background: e.color, boxShadow: `0 0 4px ${e.color}60` }} />
                  {e.name}
                </div>
              ))}
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
