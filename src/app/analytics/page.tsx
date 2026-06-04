'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp, Users, Target, Clock, Download,
  Calendar, ArrowUpRight, ArrowDownRight, Zap,
  Dumbbell, Activity, Sparkles, Award, Flame, BarChart3,
  ChevronDown, TrendingDown, CheckCircle, Camera,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar,
  LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';
import { api } from '../../lib/api';

/* ─── Tooltip ─── */
function ChartTooltip({ active, payload, label, unit = '' }: any) {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.4)', borderRadius: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,0.06)', padding: '10px 14px',
      }}>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
          {payload[0].value}{unit}
        </p>
      </div>
    );
  }
  return null;
}

/* ─── Sparkline ─── */
function Sparkline({ data, color = '#2563EB' }: { data: { val: number }[]; color?: string }) {
  if (!data || data.length < 2) return null;
  const vals = data.map(d => d.val);
  const w = 60, h = 24;
  const mn = Math.min(...vals), mx = Math.max(...vals), r = mx - mn || 1;
  const pts = vals.map((v, i) => `${(i / (vals.length - 1)) * w},${h - ((v - mn) / r) * (h - 6) - 3}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </linearGradient>
      </defs>
      <path d={`M${pts}`} fill="none" stroke={`url(#sg-${color.replace('#','')})`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts.split(' ').pop()!.split(',')[0]} cy={pts.split(' ').pop()!.split(',')[1]} r="2" fill={color} stroke="white" strokeWidth="1" />
    </svg>
  );
}

/* ─── Colors per client ─── */
const CLIENT_COLORS = ['#2563EB', '#8B5CF6', '#F59E0B', '#10B981', '#F43F5E', '#06B6D4'];

export default function AnalyticsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showClientList, setShowClientList] = useState(false);

  useEffect(() => {
    api.clients.list().then(data => {
      setClients(data);
      if (data.length) setSelectedId(data[0].id);
    }).catch(() => setClients([]));
  }, []);

  const client = clients.find(c => c.id === selectedId) || clients[0] || null;
  const color = client ? CLIENT_COLORS[client.id % CLIENT_COLORS.length] : '#6366F1';
  const p = client?.progress || { weight: [], bodyFat: [], adherence: [], logs: [] };

  const wData = p.weight?.length ? p.weight : null;
  const bfData = p.bodyFat?.length ? p.bodyFat : null;
  const adData = p.adherence?.length ? p.adherence : null;

  /* ─── Metric calculation ─── */
  const currentWeight = wData ? wData[wData.length - 1].val : null;
  const startWeight = wData ? wData[0].val : null;
  const weightChange = currentWeight && startWeight ? ((currentWeight - startWeight) / startWeight * 100) : null;
  const currentBf = bfData ? bfData[bfData.length - 1].val : null;
  const startBf = bfData ? bfData[0].val : null;
  const bfChange = currentBf && startBf ? ((currentBf - startBf) / startBf * 100) : null;
  const avgAdherence = adData ? Math.round(adData.reduce((a, b) => a + b.val, 0) / adData.length) : null;

  const metrics = [
    { icon: Activity, label: 'Current Weight', value: currentWeight ? `${currentWeight} kg` : '—', change: weightChange, isGood: weightChange !== null && weightChange < 0, color: '#2563EB' },
    { icon: Target, label: 'Body Fat', value: currentBf ? `${currentBf}%` : '—', change: bfChange, isGood: bfChange !== null && bfChange < 0, color: '#8B5CF6' },
    { icon: Award, label: 'Avg. Adherence', value: avgAdherence ? `${avgAdherence}%` : '—', change: null, isGood: true, color: '#10B981' },
    { icon: Flame, label: 'Weeks Tracked', value: `${p.weight?.length || 0}`, change: null, isGood: true, color: '#F59E0B' },
  ];

  return (
    <div className="page-content" style={{ animation: 'slideUp 0.4s var(--ease) both' }}>
      {/* Orbs */}
      <div className="orb orb-blue animate-float-slow" style={{ top: -80, right: -120 }} />
      <div className="orb orb-purple animate-float" style={{ bottom: 150, left: -80, animationDelay: '-3s' }} />
      <div className="orb orb-rose animate-float-slow" style={{ top: '50%', right: '10%', animationDelay: '-5s', opacity: 0.05 }} />

      {/* ─── Header ─── */}
      <header style={{ position: 'relative', zIndex: 1, marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 14,
                background: 'linear-gradient(135deg, #2563EB, #8B5CF6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                boxShadow: '0 6px 20px rgba(37,99,235,0.25)',
              }}>
                <BarChart3 size={22} />
              </div>
              <h1 style={{
                fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700,
                background: 'linear-gradient(135deg, var(--text) 40%, #2563EB 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                letterSpacing: '-0.4px',
              }}>
                Progress
              </h1>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Track client progress with detailed analytics and history
            </p>
          </div>

          {/* Client selector */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowClientList(!showClientList)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 16px 8px 12px', borderRadius: 12,
                background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)',
                border: '1px solid rgba(0,0,0,0.04)', cursor: 'pointer',
                fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--text)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.04)'}
            >
                <div style={{
                  width: 26, height: 26, borderRadius: 7,
                  background: `linear-gradient(135deg, ${color}20, ${color}08)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700, color,
                }}>
                  {client?.initials || '?'}
                </div>
                {client?.name || 'Select a client'}
                <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
            </button>

            {showClientList && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 9 }} onClick={() => setShowClientList(false)} />
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: 6, zIndex: 10,
                  background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255,255,255,0.4)',
                  borderRadius: 14, boxShadow: '0 16px 48px rgba(0,0,0,0.08)',
                  padding: 6, minWidth: 200,
                }}>
                  {clients.map(c => {
                    const cc = CLIENT_COLORS[c.id % CLIENT_COLORS.length];
                    const isSel = c.id === selectedId;
                    return (
                      <button key={c.id} onClick={() => { setSelectedId(c.id); setShowClientList(false) }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                          padding: '8px 12px', borderRadius: 10, border: 'none',
                          background: isSel ? `linear-gradient(135deg, ${cc}10, ${cc}04)` : 'transparent',
                          color: isSel ? cc : 'var(--text)', fontWeight: isSel ? 600 : 500,
                          fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-sans)',
                          transition: 'all 0.1s',
                        }}
                        onMouseEnter={e => { if (!isSel) { e.currentTarget.style.background = 'rgba(0,0,0,0.02)' } }}
                        onMouseLeave={e => { if (!isSel) { e.currentTarget.style.background = 'transparent' } }}
                      >
                        <div style={{
                          width: 24, height: 24, borderRadius: 6,
                          background: `${cc}18`, display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: 9, fontWeight: 700, color: cc,
                        }}>
                          {c.initials}
                        </div>
                        {c.name}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {!client ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)', position: 'relative', zIndex: 1 }}>
          <Users size={40} style={{ opacity: 0.2, marginBottom: 12 }} />
          <p style={{ fontSize: 15, fontWeight: 600 }}>No clients yet</p>
          <p style={{ fontSize: 13 }}>Add a client to start tracking their progress</p>
        </div>
      ) : (
        <>
      {/* ─── Client Profile Card ─── */}
      <div className="card" style={{
        padding: 22, marginBottom: 24, position: 'relative', zIndex: 1,
        borderLeft: `3px solid ${color}`,
        background: `linear-gradient(135deg, rgba(255,255,255,0.9), ${color}02)`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{
            width: 54, height: 54, borderRadius: 16,
            background: `linear-gradient(135deg, ${color}22, ${color}08)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 700, color,
            boxShadow: `0 4px 14px ${color}15`,
          }}>
            {client.initials}
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 2 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{client.name}</h2>
              <span className="badge badge-success" style={{ fontSize: 11 }}>Week {client.programWeek}</span>
              <span style={{
                padding: '2px 10px', borderRadius: 5, fontSize: 10, fontWeight: 600,
                background: `${color}14`, color,
              }}>{client.goal}</span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {client.age}{client.gender} · {client.assessment?.height || ''}cm · {client.assessment?.bmi || ''} BMI · {client.split}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            {[
              { label: 'Start', val: startWeight ? `${startWeight}kg` : '—' },
              { label: 'Current', val: currentWeight ? `${currentWeight}kg` : '—' },
              { label: 'Loss', val: weightChange ? `${Math.abs(weightChange).toFixed(1)}%` : '—', color: weightChange && weightChange < 0 ? '#10B981' : '#DC2626' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: s.color || 'var(--text)' }}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Metric Cards ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 24, position: 'relative', zIndex: 1 }}>
        {metrics.map((m, i) => (
          <div key={i} className="card card-hover" style={{
            padding: '18px 20px',
            borderTop: `3px solid ${m.color}`,
            animation: `slideUp 0.3s var(--ease) ${i * 0.05}s both`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `linear-gradient(135deg, ${m.color}18, ${m.color}06)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: m.color,
              }}>
                <m.icon size={17} />
              </div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.3px' }}>
              {m.value}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{m.label}</span>
              {m.change !== null && (
                <span style={{
                  display: 'flex', alignItems: 'center', gap: 2,
                  fontSize: 11, fontWeight: 600, marginLeft: 'auto',
                  color: m.isGood ? '#059669' : '#DC2626',
                }}>
                  {m.isGood ? <ArrowDownRight size={11} /> : <ArrowUpRight size={11} />}
                  {Math.abs(m.change).toFixed(1)}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ─── Charts Row ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 24, position: 'relative', zIndex: 1 }}>
        {/* Weight */}
        <div className="card card-accent-blue" style={{ padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div className="section-heading blue" style={{ fontSize: 15 }}>Weight Trend</div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{wData ? `${wData.length} data points` : 'No data'}</p>
            </div>
            {wData && (
              <span style={{
                display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600,
                color: weightChange && weightChange < 0 ? '#059669' : '#DC2626',
              }}>
                {weightChange && weightChange < 0 ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                {weightChange ? `${Math.abs(weightChange).toFixed(1)}% total` : ''}
              </span>
            )}
          </div>
          <div style={{ height: 240 }}>
            {wData ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={wData}>
                  <defs>
                    <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563EB" stopOpacity={0.18} />
                      <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} dy={6} />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} dx={-4} />
                  <Tooltip content={<ChartTooltip unit=" kg" />} />
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.02)" vertical={false} />
                  <Area type="monotone" dataKey="val" stroke="#2563EB" strokeWidth={2.5} fill="url(#wGrad)" dot={{ fill: '#2563EB', r: 3, stroke: 'white', strokeWidth: 2 }} activeDot={{ r: 5, fill: '#2563EB', stroke: 'white', strokeWidth: 2, style: { filter: 'drop-shadow(0 0 4px rgba(37,99,235,0.3))' } }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                <Activity size={24} style={{ opacity: 0.3, marginRight: 8 }} />
                No weight data yet
              </div>
            )}
          </div>
        </div>

        {/* Body Fat */}
        <div className="card card-accent-purple" style={{ padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div className="section-heading" style={{
                fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 700, color: 'var(--text)',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ width: 4, height: 18, borderRadius: 2, background: 'linear-gradient(180deg, #8B5CF6, #7C3AED)', flexShrink: 0 }} />
                Body Fat %
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{bfData ? `${bfData.length} data points` : 'No data'}</p>
            </div>
            {bfData && (
              <span style={{
                display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600,
                color: bfChange && bfChange < 0 ? '#059669' : '#DC2626',
              }}>
                {bfChange && bfChange < 0 ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                {bfChange ? `${Math.abs(bfChange).toFixed(1)}% total` : ''}
              </span>
            )}
          </div>
          <div style={{ height: 240 }}>
            {bfData ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={bfData}>
                  <defs>
                    <linearGradient id="bfGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.18} />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} dy={6} />
                  <YAxis domain={['dataMin - 2', 'dataMax + 2']} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} dx={-4} />
                  <Tooltip content={<ChartTooltip unit="%" />} />
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.02)" vertical={false} />
                  <Area type="monotone" dataKey="val" stroke="#8B5CF6" strokeWidth={2.5} fill="url(#bfGrad)" dot={{ fill: '#8B5CF6', r: 3, stroke: 'white', strokeWidth: 2 }} activeDot={{ r: 5, fill: '#8B5CF6', stroke: 'white', strokeWidth: 2, style: { filter: 'drop-shadow(0 0 4px rgba(139,92,246,0.3))' } }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                <Activity size={24} style={{ opacity: 0.3, marginRight: 8 }} />
                No body fat data yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Adherence + Water Charts ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 24, position: 'relative', zIndex: 1 }}>
        {/* Adherence */}
        <div className="card card-accent-green" style={{ padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div className="section-heading green" style={{ fontSize: 15 }}>Adherence Rate</div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                {adData ? `Avg: ${avgAdherence}%` : 'No data'}
              </p>
            </div>
            {avgAdherence && (
              <div style={{
                padding: '4px 12px', borderRadius: 8,
                background: avgAdherence >= 85 ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                color: avgAdherence >= 85 ? '#059669' : '#D97706',
                fontSize: 18, fontWeight: 700,
              }}>
                {avgAdherence}%
              </div>
            )}
          </div>
          <div style={{ height: 180 }}>
            {adData ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={adData}>
                  <defs>
                    <linearGradient id="adGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} dy={6} />
                  <YAxis domain={[70, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} dx={-4} />
                  <Tooltip content={<ChartTooltip unit="%" />} />
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.02)" vertical={false} />
                  <Area type="monotone" dataKey="val" stroke="#10B981" strokeWidth={2.5} fill="url(#adGrad)" dot={{ fill: '#10B981', r: 3, stroke: 'white', strokeWidth: 2 }} activeDot={{ r: 5, fill: '#10B981', stroke: 'white', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                No adherence data yet
              </div>
            )}
          </div>
        </div>

        {/* Progress Photos */}
        <div className="card card-accent-rose" style={{ padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div className="section-heading" style={{
              fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 700, color: 'var(--text)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ width: 4, height: 18, borderRadius: 2, background: 'linear-gradient(180deg, #F43F5E, #E11D48)', flexShrink: 0 }} />
              Progress Photos
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'Before (Start)', color: '#F43F5E' },
              { label: 'Current (Week 4)', color: '#10B981' },
            ].map((ph, i) => (
              <div key={i} style={{
                borderRadius: 12, overflow: 'hidden',
                border: `1px solid ${ph.color}12`,
                background: `linear-gradient(135deg, ${ph.color}04, transparent)`,
              }}>
                <div style={{
                  height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `linear-gradient(135deg, ${ph.color}06, ${ph.color}02)`,
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute', top: -20, right: -20, width: 80, height: 80,
                    borderRadius: '50%', background: `radial-gradient(circle, ${ph.color}08, transparent)`,
                  }} />
                  <div style={{
                    width: 48, height: 48, borderRadius: 14,
                    background: `linear-gradient(135deg, ${ph.color}18, ${ph.color}06)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: ph.color,
                  }}>
                    <Camera size={20} />
                  </div>
                </div>
                <div style={{
                  padding: '8px 12px', textAlign: 'center',
                  fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)',
                  borderTop: `1px solid ${ph.color}08`,
                }}>
                  {ph.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Workout Logs ─── */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h3 style={{
          fontFamily: 'var(--font-heading)', fontSize: 17, fontWeight: 700, color: 'var(--text)',
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
        }}>
          <span style={{ width: 4, height: 18, borderRadius: 2, background: 'linear-gradient(180deg, #10B981, #06B6D4)' }} />
          Recent Workout Logs
        </h3>
        <div className="card" style={{ padding: 22 }}>
          {client.progress.logs && client.progress.logs.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {client.progress.logs.map((log, i) => {
                const isFull = log.adherence >= 100;
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '12px 16px', borderRadius: 12,
                    background: isFull ? 'rgba(16,185,129,0.03)' : 'rgba(245,158,11,0.03)',
                    border: `1px solid ${isFull ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)'}`,
                    transition: 'all 0.15s',
                    animation: `slideUp 0.3s var(--ease) ${i * 0.04}s both`,
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = isFull ? 'rgba(16,185,129,0.06)' : 'rgba(245,158,11,0.06)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = isFull ? 'rgba(16,185,129,0.03)' : 'rgba(245,158,11,0.03)' }}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      background: isFull
                        ? 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))'
                        : 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: isFull ? '#10B981' : '#F59E0B',
                    }}>
                      {isFull ? <CheckCircle size={16} /> : <Clock size={16} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{log.workout}</span>
                        <span className={`badge ${isFull ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: 10 }}>
                          {log.adherence}%
                        </span>
                      </div>
                      {log.notes && (
                        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                          "{log.notes}"
                        </p>
                      )}
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>
                      {log.date}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontSize: 13 }}>
              <Activity size={28} style={{ margin: '0 auto 8px', opacity: 0.3 }} />
              No workout logs yet
            </div>
          )}
        </div>
      </div>
      </>
      )}
    </div>
  );
}
