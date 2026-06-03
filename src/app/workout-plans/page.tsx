'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Dumbbell, Search, Plus, Clock, Target, Flame,
  Users, Zap, ChevronRight, Sparkles, Activity,
} from 'lucide-react';
import { MOCK_CLIENTS, MOCK_WORKOUT_PLAN } from '../../lib/mock-data';

const plans = [
  {
    id: 1, clientId: 1, clientName: 'Priya Sharma',
    title: 'Upper/Lower 4x', split: 'Upper/Lower 4x',
    daysPerWeek: 4, sessionMin: 50, totalExercises: 22,
    status: 'active', progress: 65,
  },
  {
    id: 2, clientId: 2, clientName: 'Rohit Verma',
    title: 'PPL 6x', split: 'Push/Pull/Legs',
    daysPerWeek: 6, sessionMin: 60, totalExercises: 30,
    status: 'active', progress: 80,
  },
  {
    id: 3, clientId: 3, clientName: 'Ananya Patel',
    title: 'Full Body 3x', split: 'Full Body 3x',
    daysPerWeek: 3, sessionMin: 45, totalExercises: 15,
    status: 'review', progress: 30,
  },
  {
    id: 4, clientId: 4, clientName: 'Vikram Singh',
    title: '5-Day Split', split: '5-Day Split',
    daysPerWeek: 5, sessionMin: 55, totalExercises: 25,
    status: 'active', progress: 72,
  },
  {
    id: 5, clientId: 5, clientName: 'Neha Gupta',
    title: 'PPL 4x', split: 'Push/Pull/Legs',
    daysPerWeek: 4, sessionMin: 45, totalExercises: 20,
    status: 'draft', progress: 15,
  },
  {
    id: 6, clientId: 6, clientName: 'Arun Kumar',
    title: 'PPL + Arms 6x', split: 'PPL + Arms',
    daysPerWeek: 6, sessionMin: 60, totalExercises: 35,
    status: 'delivered', progress: 100,
  },
];

const statusStyles: Record<string, { bg: string; text: string }> = {
  active: { bg: 'rgba(16,185,129,0.12)', text: '#059669' },
  review: { bg: 'rgba(245,158,11,0.12)', text: '#D97706' },
  draft: { bg: 'rgba(99,102,241,0.12)', text: '#6366F1' },
  delivered: { bg: 'rgba(37,99,235,0.12)', text: '#2563EB' },
};

const planColors = ['#6366F1', '#8B5CF6', '#10B981', '#F59E0B', '#F43F5E', '#06B6D4'];

export default function WorkoutPlansPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');

  const filtered = plans.filter(p => {
    const matchSearch = p.clientName.toLowerCase().includes(search.toLowerCase()) || p.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.status === filter;
    return matchSearch && matchFilter;
  });

  const stats = [
    { label: 'Total Plans', value: plans.length, icon: Dumbbell, color: '#6366F1' },
    { label: 'Active', value: plans.filter(p => p.status === 'active').length, icon: Zap, color: '#10B981' },
    { label: 'In Review', value: plans.filter(p => p.status === 'review').length, icon: Activity, color: '#F59E0B' },
    { label: 'Delivered', value: plans.filter(p => p.status === 'delivered').length, icon: Users, color: '#2563EB' },
  ];

  return (
    <div className="page-content" style={{ animation: 'slideUp 0.4s var(--ease) both' }}>
      {/* Orbs */}
      <div style={{ position: 'absolute', top: -100, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.1), transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: 150, left: -100, width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.07), transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', marginBottom: 28, position: 'relative', zIndex: 1 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
              boxShadow: '0 6px 20px rgba(139,92,246,0.25)',
            }}>
              <Dumbbell size={22} />
            </div>
            <h1 style={{
              fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700, letterSpacing: '-0.4px',
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Workout Plans
            </h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
            Manage and review all client workout programs
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ position: 'relative', width: 220 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none' }} />
            <input
              type="text" placeholder="Search plans..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field"
              style={{ padding: '9px 14px 9px 36px', fontSize: 13, width: '100%' }}
            />
          </div>
          <button className="btn btn-primary" style={{ padding: '9px 18px', gap: 6 }}>
            <Plus size={15} />
            New Plan
          </button>
        </div>
      </header>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24, position: 'relative', zIndex: 1 }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            padding: '18px 20px', borderRadius: 16,
            background: `linear-gradient(135deg, ${s.color}08, ${s.color}02)`,
            border: `1px solid ${s.color}12`,
            display: 'flex', alignItems: 'center', gap: 14,
            boxShadow: `0 2px 8px ${s.color}08`,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              background: `linear-gradient(135deg, ${s.color}, ${s.color}CC)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
              boxShadow: `0 4px 12px ${s.color}30`,
            }}>
              <s.icon size={18} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{
        display: 'flex', gap: 6, marginBottom: 20,
        background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(12px)',
        borderRadius: 12, padding: 4, border: '1px solid rgba(255,255,255,0.3)',
        width: 'fit-content', position: 'relative', zIndex: 1,
      }}>
        {['all', 'active', 'review', 'draft', 'delivered'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{
              padding: '6px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: filter === f ? 'white' : 'transparent',
              color: filter === f ? 'var(--text)' : 'var(--text-muted)',
              fontWeight: filter === f ? 600 : 500,
              boxShadow: filter === f ? '0 2px 6px rgba(0,0,0,0.04)' : 'none',
              fontFamily: 'var(--font-sans)', fontSize: 13, textTransform: 'capitalize',
              transition: 'all 0.15s',
            }}>{f}</button>
        ))}
      </div>

      {/* Plan grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16, position: 'relative', zIndex: 1 }}>
        {filtered.map((p, i) => {
          const sc = planColors[i % planColors.length];
          const status = statusStyles[p.status];
          return (
            <Link key={p.id} href={`/workout-plans/${p.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                padding: 22, borderRadius: 18,
                background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.5)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
                cursor: 'pointer', position: 'relative', overflow: 'hidden',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = `0 12px 40px ${sc}15, 0 4px 16px rgba(0,0,0,0.06)`;
                  e.currentTarget.style.borderColor = `${sc}20`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                }}
              >
                {/* Glow */}
                <div style={{
                  position: 'absolute', top: -40, right: -40, width: 100, height: 100,
                  borderRadius: '50%', background: `radial-gradient(circle, ${sc}10, transparent)`,
                  pointerEvents: 'none',
                }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                      background: `linear-gradient(135deg, ${sc}, ${sc}99)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                      boxShadow: `0 4px 14px ${sc}30`,
                    }}>
                      <Dumbbell size={18} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: 0 }}>{p.title}</h3>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                        {p.clientName}
                      </p>
                    </div>
                  </div>
                  <span style={{
                    padding: '3px 10px', borderRadius: 6, fontSize: 10, fontWeight: 700,
                    background: status.bg, color: status.text, textTransform: 'capitalize',
                  }}>
                    {p.status}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)' }}>
                    <Clock size={13} style={{ color: sc }} />
                    <span>{p.daysPerWeek}d/wk</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)' }}>
                    <Target size={13} style={{ color: sc }} />
                    <span>{p.sessionMin} min</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)' }}>
                    <Zap size={13} style={{ color: sc }} />
                    <span>{p.totalExercises} exercises</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 2,
                      width: `${p.progress}%`,
                      background: `linear-gradient(90deg, ${sc}, ${sc}AA)`,
                      transition: 'width 0.3s',
                    }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: sc }}>{p.progress}%</span>
                  <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)',
          position: 'relative', zIndex: 1,
        }}>
          <Dumbbell size={40} style={{ opacity: 0.2, marginBottom: 12 }} />
          <p style={{ fontSize: 15, fontWeight: 600 }}>No workout plans found</p>
          <p style={{ fontSize: 13 }}>Try adjusting your search or filter</p>
        </div>
      )}
    </div>
  );
}
