'use client';

import { useState, useEffect } from 'react';
import {
  Trophy, Target, Zap, Award, TrendingUp,
  ArrowUpRight, ArrowDownRight, CheckCircle,
  ChevronRight, Clock, Flame, Star, Sparkles,
} from 'lucide-react';
import {
  RadialBarChart, RadialBar, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell,
} from 'recharts';
import { api } from '../../lib/api';

const goalTypes = [
  { label: 'Fat Loss', icon: Flame, color: '#F43F5E', color2: '#EC4899' },
  { label: 'Muscle Gain', icon: Zap, color: '#8B5CF6', color2: '#6366F1' },
  { label: 'Weight Loss', icon: Target, color: '#F59E0B', color2: '#F97316' },
  { label: 'General Fitness', icon: Star, color: '#10B981', color2: '#059669' },
];

const monthlyGoals = [
  { month: 'Jan', achieved: 8, total: 10 },
  { month: 'Feb', achieved: 9, total: 10 },
  { month: 'Mar', achieved: 7, total: 10 },
  { month: 'Apr', achieved: 10, total: 10 },
  { month: 'May', achieved: 8, total: 10 },
  { month: 'Jun', achieved: 9, total: 10 },
];

const COLORS = ['#F43F5E', '#8B5CF6', '#F59E0B', '#10B981', '#6366F1', '#06B6D4'];

export default function GoalsPage() {
  const [view, setView] = useState<'overview' | 'clients'>('overview');
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    api.clients.list().then(setClients).catch(() => setClients([]));
  }, []);

  const clientGoals = clients.map((c, i) => ({
    id: c.id, name: c.name, initials: c.initials,
    goal: c.goal,
    achieved: 0, total: 0,
    rate: 0,
    streak: 0,
    status: c.status,
  }));

  const totalHit = clientGoals.reduce((s, c) => s + c.achieved, 0);
  const totalGoals = clientGoals.reduce((s, c) => s + c.total, 0);
  const overallRate = totalGoals > 0 ? Math.round((totalHit / totalGoals) * 100) : 0;

  return (
    <div className="page-content" style={{ animation: 'slideUp 0.4s var(--ease) both' }}>
      <div style={{ position: 'absolute', top: -80, right: -60, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.08), transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: 150, left: -100, width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.06), transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', marginBottom: 28, position: 'relative', zIndex: 1 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: 'linear-gradient(135deg, #F59E0B, #F97316)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
              boxShadow: '0 6px 20px rgba(245,158,11,0.25)',
            }}>
              <Trophy size={22} />
            </div>
            <h1 style={{
              fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700, letterSpacing: '-0.4px',
              background: 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Goals
            </h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
            Track goal achievement and client progress milestones
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
              }}>{v === 'overview' ? 'Overview' : 'By Client'}</button>
          ))}
        </div>
      </header>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24, position: 'relative', zIndex: 1 }}>
        {[
          { label: 'Goals Achieved', value: String(totalHit), change: '+12%', up: true, icon: Trophy, color: '#F59E0B' },
          { label: 'Success Rate', value: `${overallRate}%`, change: '+4%', up: true, icon: Target, color: '#10B981' },
          { label: 'Avg Streak', value: '4.7 wk', change: '+1.2', up: true, icon: Award, color: '#8B5CF6' },
          { label: 'On Track', value: '76%', change: '+3%', up: true, icon: TrendingUp, color: '#6366F1' },
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

      {/* Overview */}
      {view === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, position: 'relative', zIndex: 1 }}>
          {/* Goal Type Breakdown */}
          <div style={{
            background: 'white', borderRadius: 20, padding: 24,
            border: '1px solid rgba(245,158,11,0.1)',
            boxShadow: '0 4px 24px rgba(245,158,11,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 18 }}>
              <span style={{ width: 4, height: 18, borderRadius: 2, background: 'linear-gradient(180deg, #F59E0B, #F97316)', flexShrink: 0 }} />
              Goal Type Breakdown
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {goalTypes.map((g, i) => {
                const Icon = g.icon;
                const count = clients.filter(c => c.goal === g.label).length;
                const achieved = clientGoals.filter(cg => cg.goal === g.label).reduce((s, c) => s + c.achieved, 0);
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: `linear-gradient(135deg, ${g.color}20, ${g.color}08)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: g.color, boxShadow: `0 2px 8px ${g.color}12`,
                    }}>
                      <Icon size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{g.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{count} clients · {achieved} goals hit</div>
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: g.color }}>{count}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monthly Trend */}
          <div style={{
            background: 'white', borderRadius: 20, padding: 24,
            border: '1px solid rgba(139,92,246,0.1)',
            boxShadow: '0 4px 24px rgba(139,92,246,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                <span style={{ width: 4, height: 18, borderRadius: 2, background: 'linear-gradient(180deg, #8B5CF6, #EC4899)', flexShrink: 0 }} />
                Monthly Progress
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#8B5CF6', display: 'flex', alignItems: 'center', gap: 3 }}>
                <ArrowUpRight size={12} /> +1 vs May
              </span>
            </div>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyGoals} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                  <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)', border: '1px solid rgba(139,92,246,0.12)', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.06)', padding: '10px 14px' }} />
                  <Bar dataKey="total" radius={[4, 4, 0, 0]} maxBarSize={20} fill="rgba(139,92,246,0.12)" />
                  <Bar dataKey="achieved" radius={[4, 4, 0, 0]} maxBarSize={20}>
                    {monthlyGoals.map((_, i) => {
                      const c = ['#8B5CF6', '#6366F1', '#10B981', '#F59E0B', '#F43F5E', '#06B6D4'][i];
                      return <Cell key={i} fill={c} style={{ filter: `drop-shadow(0 0 4px ${c}50)` }} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* By Client */}
      {view === 'clients' && (
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {clientGoals.map((c, i) => {
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{c.name}</span>
                    <span style={{
                      padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700,
                      background: `linear-gradient(135deg, ${color}12, ${color}06)`,
                      color,
                    }}>
                      {c.goal}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle size={12} style={{ color }} /> {c.achieved}/{c.total} goals
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Award size={12} style={{ color }} /> {c.streak} wk streak
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ position: 'relative', width: 44, height: 44 }}>
                    <svg width="44" height="44" viewBox="0 0 44 44" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="4" />
                      <circle cx="22" cy="22" r="18" fill="none" stroke={color} strokeWidth="4" strokeDasharray={`${2 * Math.PI * 18}`} strokeDashoffset={`${2 * Math.PI * 18 * (1 - c.rate / 100)}`} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 4px ${color}60)` }} />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color }}>{c.rate}%</div>
                  </div>
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
