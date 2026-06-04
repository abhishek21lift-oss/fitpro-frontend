'use client';

import { useState, useEffect } from 'react';
import {
  Utensils, Dumbbell, Pill, Activity, Check,
  Clock, Flame, Zap, Droplets, Moon, Sun,
  Sparkles, ArrowUpRight, ChevronRight, Heart,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from 'recharts';
import { api } from '../../lib/api';

/* ─── 3D Donut ─── */
function Donut3D({ data, size = 180, inner = 58, outer = 82, glow = '#2563EB' }: {
  data: { name: string; value: number; color: string }[]; size?: number;
  inner?: number; outer?: number; glow?: string;
}) {
  const total = data.reduce((a, b) => a + b.value, 0);
  const r = (size - 10) / 2;
  const cx = size / 2, cy = size / 2;

  const segments = [];
  let angle = -90;
  for (const d of data) {
    const pct = d.value / total;
    const a = pct * 360;
    segments.push({ ...d, angle: a, start: angle, end: angle + a, pct });
    angle += a;
  }

  function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
    const rad = (deg * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  }

  function arcPath(cx: number, cy: number, r: number, s: number, e: number) {
    const [x1, y1] = polar(cx, cy, r, s);
    const [x2, y2] = polar(cx, cy, r, e);
    const large = e - s > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  }

  function donutPath(cx: number, cy: number, ir: number, or: number, s: number, e: number) {
    const [x1o, y1o] = polar(cx, cy, or, s);
    const [x2o, y2o] = polar(cx, cy, or, e);
    const [x2i, y2i] = polar(cx, cy, ir, e);
    const [x1i, y1i] = polar(cx, cy, ir, s);
    const large = e - s > 180 ? 1 : 0;
    return `M ${x1o} ${y1o} A ${or} ${or} 0 ${large} 1 ${x2o} ${y2o} L ${x2i} ${y2i} A ${ir} ${ir} 0 ${large} 0 ${x1i} ${y1i} Z`;
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ filter: `drop-shadow(0 4px 20px ${glow}20)` }}>
      <defs>
        <filter id="bevel">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur" />
          <feSpecularLighting in="blur" surfaceScale="3" specularConstant="0.6" specularExponent="20" result="spec">
            <fePointLight x="100" y="50" z="100" />
          </feSpecularLighting>
          <feComposite in="SourceGraphic" in2="spec" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
        </filter>
        {segments.map((s, i) => (
          <linearGradient key={i} id={`seg-grad-${i}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={s.color} stopOpacity={0.85} />
            <stop offset="50%" stopColor={s.color} stopOpacity={1} />
            <stop offset="100%" stopColor={s.color} stopOpacity={0.7} />
          </linearGradient>
        ))}
        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={glow} stopOpacity="0.06" />
          <stop offset="100%" stopColor={glow} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Shadow ring */}
      <circle cx={cx + 2} cy={cy + 3} r={(outer + inner) / 2} fill="none"
        stroke="rgba(0,0,0,0.06)" strokeWidth={outer - inner} />

      {/* Segments */}
      {segments.map((s, i) => {
        if (s.pct >= 0.99) {
          return (
            <g key={i} filter="url(#bevel)">
              <circle cx={cx} cy={cy} r={outer} fill={`url(#seg-grad-${i})`} />
              <circle cx={cx} cy={cy} r={inner} fill="white" />
            </g>
          );
        }
        return (
          <g key={i} filter="url(#bevel)">
            <path d={donutPath(cx, cy, inner, outer, s.start, s.end)}
              fill={`url(#seg-grad-${i})`} stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
            {/* Outer highlight */}
            <path d={arcPath(cx, cy, outer, s.start, s.end)}
              fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
          </g>
        );
      })}

      {/* Inner glow */}
      <circle cx={cx} cy={cy} r={inner - 2} fill="white" />
      <circle cx={cx} cy={cy} r={inner - 2} fill="url(#centerGlow)" />
    </svg>
  );
}

/* ─── Macro Bar ─── */
function MacroBar({ label, value, pct, color }: { label: string; value: number; pct: number; color: string }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, color: 'var(--text)' }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
          {label}
        </span>
        <span style={{ color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--text)' }}>{value}g</strong> <span style={{ color: 'var(--text-muted)' }}>({pct}%)</span>
        </span>
      </div>
      <div style={{ width: '100%', height: 6, borderRadius: 3, background: 'rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 3, width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}CC)`, transition: 'width 0.5s var(--ease)' }} />
      </div>
    </div>
  );
}

/* ─── Data ─── */
const tabs = [
  { id: 'diet', label: 'Diet Plan', icon: Utensils },
  { id: 'workout', label: 'Workout Plan', icon: Dumbbell },
  { id: 'supplements', label: 'Supplements', icon: Pill },
  { id: 'lifestyle', label: 'Lifestyle', icon: Activity },
];

const supplements: any[] = [];

const lifestyle: Record<string, any> = {};

export default function DietPlansPage() {
  const [tab, setTab] = useState('diet');
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    api.clients.list().then(setClients).catch(() => setClients([]));
  }, []);

  const plan = { calories: 0, protein: 0, carbs: 0, fat: 0, meals: [] };
  const client = clients[0] || null;
  const workout = { split: '—', days: [] };

  const macroData = [
    { label: 'Protein', value: plan.protein, color: '#2563EB', pct: Math.round(plan.protein * 4 / plan.calories * 100) },
    { label: 'Carbs', value: plan.carbs, color: '#F59E0B', pct: Math.round(plan.carbs * 4 / plan.calories * 100) },
    { label: 'Fat', value: plan.fat, color: '#F43F5E', pct: Math.round(plan.fat * 9 / plan.calories * 100) },
  ];
  const donutData = macroData.map(m => ({ name: m.label, value: m.pct, color: m.color }));

  const dayColors = ['#2563EB', '#8B5CF6', '#10B981', '#F59E0B', '#F43F5E', '#06B6D4', '#7C3AED'];
  const dayWorkColors = ['#2563EB', '#059669', '#D97706', '#7C3AED', '#E11D48', '#0891B2', '#4F46E5'];

  return (
    <div className="page-content" style={{ animation: 'slideUp 0.4s var(--ease) both' }}>
      {/* Orbs */}
      <div className="orb orb-purple animate-float-slow" style={{ top: -60, right: -80 }} />
      <div className="orb orb-blue animate-float" style={{ bottom: 200, left: -100, animationDelay: '-3s' }} />
      <div className="orb orb-rose animate-float-slow" style={{ top: '30%', right: '5%', animationDelay: '-5s', opacity: 0.06 }} />

      {/* ─── Header ─── */}
      <header style={{ position: 'relative', zIndex: 1, marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 14,
                background: 'linear-gradient(135deg, #10B981, #06B6D4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                boxShadow: '0 6px 20px rgba(16,185,129,0.25)',
              }}>
                <Utensils size={22} />
              </div>
              <h1 style={{
                fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700,
                background: 'linear-gradient(135deg, var(--text) 40%, #10B981 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                letterSpacing: '-0.4px',
              }}>
                Plan Review
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 13, flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 500, color: 'var(--text)' }}>{client?.name || 'No client selected'}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary btn-sm" style={{ padding: '8px 14px' }}>
              <Sparkles size={14} />
              AI Adjust
            </button>
            <button className="btn btn-gradient-green btn-sm" style={{ padding: '8px 16px', gap: 6 }}>
              <Check size={14} />
              Approve & Export
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: 2, marginTop: 22,
          background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)',
          borderRadius: 14, padding: 4, border: '1px solid rgba(255,255,255,0.4)',
          width: 'fit-content',
        }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="tab-btn"
              style={{
                padding: '8px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: tab === t.id ? 'white' : 'transparent',
                color: tab === t.id ? 'var(--text)' : 'var(--text-muted)',
                fontWeight: tab === t.id ? 600 : 500,
                boxShadow: tab === t.id ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
                fontFamily: 'var(--font-sans)', fontSize: 13,
                display: 'flex', alignItems: 'center', gap: 6,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (tab !== t.id) { e.currentTarget.style.color = 'var(--text)' } }}
              onMouseLeave={e => { if (tab !== t.id) { e.currentTarget.style.color = 'var(--text-muted)' } }}
            >
              <t.icon size={14} />
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {/* ─── DIET TAB ─── */}
      {tab === 'diet' && (
        <div style={{ position: 'relative', zIndex: 1 }}>
          {!client ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <Utensils size={40} style={{ opacity: 0.2, marginBottom: 12 }} />
              <p style={{ fontSize: 15, fontWeight: 600 }}>No diet plan yet</p>
              <p style={{ fontSize: 13 }}>Create a client first to generate diet plans</p>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 20, marginBottom: 24 }}>
                <div className="card card-accent-green" style={{ padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>Caloric Distribution</h3>
                  <div style={{ position: 'relative', width: 180, height: 180 }}>
                    <Donut3D data={donutData} size={180} inner={58} outer={82} glow="#10B981" />
                    <div style={{
                      position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
                    }}>
                      <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.5px' }}>
                        {plan.calories || '—'}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>Daily Calories</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 16, marginTop: 14 }}>
                    {macroData.map((m, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-secondary)' }}>
                        <span style={{ width: 7, height: 7, borderRadius: 2, background: m.color }} />
                        {m.label} <strong style={{ color: 'var(--text)' }}>{m.pct}%</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card card-accent-purple" style={{ padding: 28 }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 18 }}>
                    Macronutrient Breakdown
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {macroData.map((m, i) => <MacroBar key={i} {...m} />)}
                  </div>
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)' }}>
                    <span>Total: <strong style={{ color: 'var(--text)' }}>{plan.calories || 0} kcal</strong></span>
                    <span>Protein: <strong style={{ color: '#2563EB' }}>{plan.protein}g</strong></span>
                    <span>Carbs: <strong style={{ color: '#F59E0B' }}>{plan.carbs}g</strong></span>
                    <span>Fat: <strong style={{ color: '#F43F5E' }}>{plan.fat}g</strong></span>
                  </div>
                </div>
              </div>

              <h3 style={{
                fontFamily: 'var(--font-heading)', fontSize: 17, fontWeight: 700, color: 'var(--text)',
                display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
              }}>
                <span style={{ width: 4, height: 18, borderRadius: 2, background: 'linear-gradient(180deg, #10B981, #06B6D4)' }} />
                Weekly Meal Schedule
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {plan.meals.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontSize: 13 }}>
                    No meals scheduled yet. Generate a diet plan to get started.
                  </div>
                ) : plan.meals.slice(0, 3).map((day, di) => (
                  <div key={di} className="card" style={{
                    padding: 20, borderLeft: `3px solid ${dayColors[di % dayColors.length]}`,
                    animation: `slideUp 0.3s var(--ease) ${di * 0.06}s both`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 8,
                        background: `${dayColors[di % dayColors.length]}14`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: dayColors[di % dayColors.length], fontSize: 12, fontWeight: 700,
                      }}>
                        {di + 1}
                      </div>
                      <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                        {day.day}
                      </h4>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={11} />
                        {day.meals[0].time} – {day.meals[day.meals.length - 1].time}
                      </span>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Meal</th><th>Time</th><th>Items</th>
                            <th style={{ textAlign: 'right' }}>Cal</th>
                            <th style={{ textAlign: 'right', color: '#2563EB' }}>P</th>
                            <th style={{ textAlign: 'right', color: '#F59E0B' }}>C</th>
                            <th style={{ textAlign: 'right', color: '#F43F5E' }}>F</th>
                          </tr>
                        </thead>
                        <tbody>
                          {day.meals.map((meal, mi) => (
                            <tr key={mi}>
                              <td style={{ fontWeight: 600, color: 'var(--text)' }}>{meal.name}</td>
                              <td style={{ color: 'var(--text-muted)' }}>{meal.time}</td>
                              <td style={{ color: 'var(--text-secondary)', maxWidth: 220 }}>{meal.items}</td>
                              <td style={{ textAlign: 'right', fontWeight: 600 }}>{meal.cals}</td>
                              <td style={{ textAlign: 'right', color: '#2563EB' }}>{meal.protein}</td>
                              <td style={{ textAlign: 'right', color: '#D97706' }}>{meal.carbs}</td>
                              <td style={{ textAlign: 'right', color: '#E11D48' }}>{meal.fat}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ─── WORKOUT TAB ─── */}
      {tab === 'workout' && (
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <div style={{
              padding: '6px 16px', borderRadius: 10,
              background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(79,70,229,0.06))',
              color: '#7C3AED', fontSize: 13, fontWeight: 600,
            }}>
              {workout.split}
            </div>
            <span className="badge badge-purple" style={{ fontSize: 11 }}>4-day split</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto' }}>
              <strong style={{ color: 'var(--text)' }}>22</strong> exercises total
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {workout.days.map((day, di) => {
              const isRest = day.type.includes('Rest');
              const dc = dayWorkColors[di % dayWorkColors.length];
              return (
                <div key={di} className="card" style={{
                  padding: 20,
                  borderLeft: `3px solid ${isRest ? '#D1D5DB' : dc}`,
                  animation: `slideUp 0.3s var(--ease) ${di * 0.05}s both`,
                  background: isRest
                    ? 'rgba(255,255,255,0.5)'
                    : 'rgba(255,255,255,0.85)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8,
                      background: isRest ? 'rgba(0,0,0,0.04)' : `${dc}14`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: isRest ? '#9CA3AF' : dc, fontSize: 12, fontWeight: 700,
                    }}>
                      {isRest ? 'R' : di + 1}
                    </div>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 700, color: isRest ? 'var(--text-muted)' : 'var(--text)' }}>
                      {day.day}
                    </h4>
                    <span style={{
                      padding: '3px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600,
                      background: isRest ? 'rgba(0,0,0,0.03)' : `${dc}14`,
                      color: isRest ? '#9CA3AF' : dc,
                    }}>
                      {day.type}
                    </span>
                    {!isRest && day.exercises && (
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto' }}>
                        {day.exercises.length} exercises
                      </span>
                    )}
                  </div>
                  {!isRest && day.exercises && day.exercises.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 8 }}>
                      {day.exercises.map((ex, ei) => (
                        <div key={ei} style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '10px 14px', borderRadius: 10,
                          background: `${dc}04`,
                          border: `1px solid ${dc}08`,
                          transition: 'all 0.15s',
                        }}
                          onMouseEnter={e => { e.currentTarget.style.background = `${dc}0A`; e.currentTarget.style.borderColor = `${dc}14` }}
                          onMouseLeave={e => { e.currentTarget.style.background = `${dc}04`; e.currentTarget.style.borderColor = `${dc}08` }}
                        >
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{ex.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>
                              {ex.sets}×{ex.reps} · RPE {ex.rpe} · Rest {ex.rest}
                            </div>
                          </div>
                          <span style={{
                            padding: '2px 8px', borderRadius: 5, fontSize: 10, fontWeight: 600,
                            background: `${dc}12`, color: dc, flexShrink: 0, marginLeft: 8,
                          }}>
                            RPE {ex.rpe}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{
                      padding: '20px', textAlign: 'center', fontSize: 13, color: 'var(--text-muted)',
                      background: 'rgba(0,0,0,0.01)', borderRadius: 10,
                      fontStyle: 'italic',
                    }}>
                      Recovery day — no training prescribed
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── SUPPLEMENTS TAB ─── */}
      {tab === 'supplements' && (
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h3 style={{
            fontFamily: 'var(--font-heading)', fontSize: 17, fontWeight: 700, color: 'var(--text)',
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
          }}>
            <span style={{ width: 4, height: 18, borderRadius: 2, background: 'linear-gradient(180deg, #8B5CF6, #F43F5E)' }} />
            Supplement Stack
          </h3>
          {supplements.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontSize: 13 }}>
              <Pill size={40} style={{ opacity: 0.2, marginBottom: 12 }} />
              <p>No supplements prescribed yet</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
              {supplements.map((s, i) => {
                const colors = ['#8B5CF6', '#2563EB', '#F59E0B', '#06B6D4', '#F43F5E', '#10B981'];
                const c = colors[i % colors.length];
                return (
                  <div key={i} className="card card-hover" style={{
                    padding: 20, borderLeft: `3px solid ${c}`,
                    animation: `slideUp 0.3s var(--ease) ${i * 0.04}s both`,
                  }}>
                    <div style={{ display: 'flex', gap: 14 }}>
                      <div style={{
                        width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                        background: `linear-gradient(135deg, ${c}20, ${c}08)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: c,
                        boxShadow: `0 3px 10px ${c}12`,
                      }}>
                        <Pill size={18} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{s.name}</h4>
                        <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.dose}</p>
                        <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                          <span style={{
                            padding: '2px 10px', borderRadius: 5, fontSize: 10, fontWeight: 600,
                            background: `${c}12`, color: c,
                          }}>
                            {s.timing}
                          </span>
                          <span style={{ fontSize: 10, color: 'var(--text-muted)', padding: '2px 0' }}>
                            {s.brand}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── LIFESTYLE TAB ─── */}
      {tab === 'lifestyle' && (
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h3 style={{
            fontFamily: 'var(--font-heading)', fontSize: 17, fontWeight: 700, color: 'var(--text)',
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
          }}>
            <span style={{ width: 4, height: 18, borderRadius: 2, background: 'linear-gradient(180deg, #F59E0B, #F97316)' }} />
            Lifestyle Prescription
          </h3>
          {Object.keys(lifestyle).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontSize: 13 }}>
              <Activity size={40} style={{ opacity: 0.2, marginBottom: 12 }} />
              <p>No lifestyle recommendations yet</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
              {Object.entries(lifestyle).map(([key, item], i) => {
                const Icon = item.icon;
                return (
                  <div key={key} className="card card-hover" style={{
                    padding: 20, borderLeft: `3px solid ${item.color}`,
                    animation: `slideUp 0.3s var(--ease) ${i * 0.05}s both`,
                  }}>
                    <div style={{ display: 'flex', gap: 14 }}>
                      <div style={{
                        width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                        background: `linear-gradient(135deg, ${item.color}20, ${item.color}08)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color,
                        boxShadow: `0 3px 10px ${item.color}12`,
                      }}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 2, textTransform: 'capitalize' }}>
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <p style={{ fontSize: 13, fontWeight: 500, color: item.color, marginBottom: 2 }}>{item.value}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.detail}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
