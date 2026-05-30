'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Users, Plus, Search, ChevronRight, Target, Zap,
  Dumbbell, Heart, Activity, ArrowUpRight, ArrowDownRight,
  Flame, Clock, Award, Sparkles, SlidersHorizontal,
} from 'lucide-react';
import { MOCK_CLIENTS } from '../../lib/mock-data';

/* ─── Color palette ─── */
const COLORS = ['#2563EB', '#8B5CF6', '#F59E0B', '#10B981', '#F43F5E', '#06B6D4'];
const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  active: { bg: 'rgba(16,185,129,0.12)', text: '#059669', dot: '#10B981' },
  review: { bg: 'rgba(245,158,11,0.12)', text: '#D97706', dot: '#F59E0B' },
  delivered: { bg: 'rgba(37,99,235,0.12)', text: '#2563EB', dot: '#2563EB' },
};
const GOAL_COLORS: Record<string, string> = {
  'Fat Loss': '#F43F5E', 'Weight Loss': '#F59E0B',
  'Muscle Gain': '#8B5CF6', 'General Fitness': '#10B981',
};

/* ─── Mini Sparkline ─── */
function MiniSpark({ data, color }: { data?: { val: number }[]; color: string }) {
  if (!data || data.length < 2) return null;
  const vals = data.map(d => d.val);
  const w = 56, h = 24;
  const mn = Math.min(...vals), mx = Math.max(...vals), r = mx - mn || 1;
  const pts = vals.map((v, i) => `${(i / (vals.length - 1)) * w},${h - ((v - mn) / r) * (h - 6) - 3}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <path d={`M${pts}`} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity={0.6} />
    </svg>
  );
}

/* ─── Ring ─── */
function Ring({ pct, size = 28, stroke = 2.5, color }: { pct: number; size?: number; stroke?: number; color: string }) {
  const r = (size - stroke) / 2, circ = 2 * Math.PI * r, off = circ - Math.min(pct / 100, 1) * circ;
  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ filter: `drop-shadow(0 0 2px ${color}50)` }} />
    </svg>
  );
}

export default function ClientsPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = useMemo(() =>
    MOCK_CLIENTS.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) &&
      (filterStatus === 'all' || c.status === filterStatus)
    ), [search, filterStatus]);

  const total = MOCK_CLIENTS.length;
  const activeCount = MOCK_CLIENTS.filter(c => c.status === 'active').length;
  const fatLoss = MOCK_CLIENTS.filter(c => c.goal.toLowerCase().includes('fat')).length;
  const muscleGain = MOCK_CLIENTS.filter(c => c.goal.toLowerCase().includes('muscle')).length;

  return (
    <div className="page-content" style={{ animation: 'slideUp 0.4s var(--ease) both' }}>
      {/* Orbs */}
      <div className="orb orb-blue animate-float-slow" style={{ top: -80, right: -100 }} />
      <div className="orb orb-rose animate-float" style={{ bottom: 100, left: -60, animationDelay: '-2s' }} />
      <div className="orb orb-emerald animate-float-slow" style={{ top: '40%', right: '20%', animationDelay: '-4s' }} />

      {/* ─── Header ─── */}
      <header style={{ position: 'relative', zIndex: 1, marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 14,
                background: 'linear-gradient(135deg, #8B5CF6, #F43F5E)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                boxShadow: '0 6px 20px rgba(139,92,246,0.25)',
              }}>
                <Users size={22} />
              </div>
              <h1 style={{
                fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700,
                background: 'linear-gradient(135deg, var(--text) 50%, #8B5CF6 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                letterSpacing: '-0.4px',
              }}>
                Clients
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 13, flexWrap: 'wrap' }}>
              <span>{total} total</span>
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--text-muted)' }} />
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#059669' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
                {activeCount} active
              </span>
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--text-muted)' }} />
              <span style={{ color: '#F43F5E', fontWeight: 500 }}>{fatLoss}</span> on fat loss
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--text-muted)' }} />
              <span style={{ color: '#8B5CF6', fontWeight: 500 }}>{muscleGain}</span> on muscle gain
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field"
                style={{ padding: '9px 14px 9px 36px', fontSize: 13, width: 200 }}
              />
            </div>
            <button className="btn btn-primary" style={{ padding: '9px 18px', gap: 6 }}>
              <Plus size={16} />
              New Assessment
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: 6, marginTop: 16, flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: 'All', color: '#6B7280' },
            { key: 'active', label: 'Active', color: '#10B981' },
            { key: 'review', label: 'Review', color: '#F59E0B' },
            { key: 'delivered', label: 'Delivered', color: '#2563EB' },
          ].map(f => (
            <button key={f.key} onClick={() => setFilterStatus(f.key)} style={{
              padding: '5px 16px', borderRadius: 20, border: 'none',
              fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.15s',
              background: filterStatus === f.key
                ? `linear-gradient(135deg, ${f.color}18, ${f.color}08)`
                : 'rgba(0,0,0,0.02)',
              color: filterStatus === f.key ? f.color : 'var(--text-muted)',
              boxShadow: filterStatus === f.key ? `0 2px 8px ${f.color}12` : 'none',
            }}
              onMouseEnter={e => { if (filterStatus !== f.key) { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = 'var(--text)' } }}
              onMouseLeave={e => { if (filterStatus !== f.key) { e.currentTarget.style.background = 'rgba(0,0,0,0.02)'; e.currentTarget.style.color = 'var(--text-muted)' } }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      {/* ─── Client Cards ─── */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtered.map((c, i) => {
          const color = COLORS[c.id % COLORS.length];
          const goalColor = GOAL_COLORS[c.goal] || color;
          const statusStyle = STATUS_STYLES[c.status];
          const wData = c.progress?.weight;
          const change = wData && wData.length >= 2 ? ((wData[wData.length - 1].val - wData[0].val) / wData[0].val * 100).toFixed(1) : null;
          const isDown = change && parseFloat(change) < 0;
          const progPct = Math.min(Math.round(((c.progress?.weight?.length || 0) / 12) * 100), 100);

          return (
            <div
              key={c.id}
              className="card card-hover"
              style={{
                padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16,
                cursor: 'pointer', position: 'relative', overflow: 'hidden',
                borderLeft: `3px solid ${color}`,
                animation: `slideUp 0.35s var(--ease) ${i * 0.05}s both`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = `linear-gradient(135deg, rgba(255,255,255,0.95), ${color}04)`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.85)';
              }}
            >
              {/* Decorative bg glow */}
              <div style={{
                position: 'absolute', top: -30, right: -30, width: 120, height: 120,
                borderRadius: '50%', background: `radial-gradient(circle, ${color}08, transparent)`,
                pointerEvents: 'none',
              }} />

              {/* Initials */}
              <div style={{
                width: 46, height: 46, borderRadius: 14, flexShrink: 0,
                background: `linear-gradient(135deg, ${color}25, ${color}08)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15, fontWeight: 700, color,
                boxShadow: `0 4px 14px ${color}15`,
              }}>
                {c.initials}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{c.name}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.age}{c.gender}</span>
                  <span style={{
                    padding: '2px 10px', borderRadius: 5, fontSize: 10, fontWeight: 600,
                    background: `${goalColor}14`, color: goalColor,
                  }}>
                    {c.goal}
                  </span>
                  <span style={{
                    padding: '2px 8px', borderRadius: 5, fontSize: 10, fontWeight: 600,
                    background: statusStyle.bg, color: statusStyle.text,
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: statusStyle.dot }} />
                    {c.status === 'active' ? 'Active' : c.status === 'review' ? 'Review' : 'Delivered'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 11, color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Flame size={11} style={{ color: '#F59E0B' }} />
                    {c.calories} kcal
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Dumbbell size={11} style={{ color: '#8B5CF6' }} />
                    {c.split}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Heart size={11} style={{ color: '#F43F5E' }} />
                    BMI {c.assessment.bmi}
                  </span>
                  {wData && wData.length >= 2 && (
                    <span style={{
                      display: 'flex', alignItems: 'center', gap: 3,
                      color: isDown ? '#059669' : '#DC2626', fontWeight: 500,
                    }}>
                      {isDown ? <ArrowDownRight size={10} /> : <ArrowUpRight size={10} />}
                      {Math.abs(parseFloat(change!))}%
                    </span>
                  )}
                </div>
              </div>

              {/* Sparkline + Ring */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <MiniSpark data={wData} color={color} />
                  <span style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 500 }}>Weight</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <Ring pct={progPct} color={color} />
                  <span style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 500 }}>W{c.programWeek}</span>
                </div>
              </div>

              <ChevronRight size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)',
            fontSize: 14, borderRadius: 16,
            background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)',
          }}>
            <Users size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            No clients found for this filter
          </div>
        )}
      </div>

      {/* Stats footer */}
      <div style={{
        marginTop: 28, padding: '16px 20px', borderRadius: 14,
        background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16, position: 'relative', zIndex: 1,
        fontSize: 12, color: 'var(--text-muted)',
      }}>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <span>Avg. Age: <strong style={{ color: 'var(--text)' }}>32.2</strong></span>
          <span>Avg. BMI: <strong style={{ color: 'var(--text)' }}>25.4</strong></span>
          <span>Avg. Calories: <strong style={{ color: 'var(--text)' }}>2,217</strong></span>
        </div>
        <span>Last updated: Today 14:32</span>
      </div>
    </div>
  );
}
