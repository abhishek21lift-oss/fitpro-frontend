"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  User, Target, Heart, Salad, Dumbbell, Sun, Brain, Activity, Scale,
  Ruler, Droplets, Flame, Zap, ChevronRight, Sparkles, Plus, BarChart3,
  ArrowUpRight, Clock, CheckCircle, TrendingUp, TrendingDown,
  ChevronLeft, Award, AlertCircle, RefreshCw, Loader2,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const COLORS = ['#2563EB', '#8B5CF6', '#10B981', '#F59E0B', '#F43F5E', '#06B6D4'];
const bg = '#F4F6F9';

function Field({ label, value, color }: { label: string; value: any; color?: string }) {
  return (
    <div>
      <p style={{ fontSize: 10, fontWeight: 600, color: color || 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
        {label}
      </p>
      <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', margin: '3px 0 0' }}>{value || "—"}</p>
    </div>
  );
}

function Skeleton({ h = 20, w = '100%', style }: { h?: number; w?: string; style?: React.CSSProperties }) {
  return (
    <div style={{
      height: h, width: w, borderRadius: 8,
      background: 'linear-gradient(90deg, rgba(0,0,0,0.02) 25%, rgba(0,0,0,0.04) 50%, rgba(0,0,0,0.02) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s ease-in-out infinite',
      ...style,
    }} />
  );
}

export default function ClientProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [client, setClient] = useState<any>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const [measurements, setMeasurements] = useState<any[]>([]);
  const [adherence, setAdherence] = useState<any[]>([]);
  const [dietPlans, setDietPlans] = useState<any[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<any[]>([]);
  const [newWeight, setNewWeight] = useState("");
  const [newNote, setNewNote] = useState("");
  const [adding, setAdding] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [engineResults, setEngineResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    const token = localStorage.getItem("fitai_token");
    if (!token) { router.push('/login'); return; }
    const id = params.id as string;
    setLoading(true);
    setError("");
    try {
      const [c, p, m, a, dp, wp] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${id}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => { if (!r.ok) throw new Error('Failed to load client'); return r.json(); }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${id}/progress`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).catch(() => []),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${id}/measurements`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).catch(() => []),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${id}/adherence`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).catch(() => []),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/diet-plans/by-client/${id}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).catch(() => []),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/workout-plans/by-client/${id}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).catch(() => []),
      ]);
      setClient(c);
      setAssessmentId(c.assessment ? `${c.id}_assessment` : null);
      setProgress(Array.isArray(p) ? p : []);
      setMeasurements(Array.isArray(m) ? m : []);
      setAdherence(Array.isArray(a) ? a : []);
      setDietPlans(Array.isArray(dp) ? dp : []);
      setWorkoutPlans(Array.isArray(wp) ? wp : []);
    } catch (e: any) {
      setError(e.message || "Failed to load client data");
    }
    setLoading(false);
  }, [params.id, router]);

  useEffect(() => { loadData() }, [loadData]);

  async function addProgress() {
    if (!newWeight) return;
    setAdding(true);
    const token = localStorage.getItem("fitai_token");
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${params.id}/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ weight: parseFloat(newWeight), note: newNote }),
    });
    loadData();
    setNewWeight(""); setNewNote(""); setAdding(false);
  }

  async function runEngine() {
    setCalculating(true);
    const token = localStorage.getItem("fitai_token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/engine/calculate/${params.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      const data = await res.json();
      setEngineResults(data);
      loadData();
    } catch {}
    setCalculating(false);
  }

  async function generateDiet() {
    const token = localStorage.getItem("fitai_token");
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/diet-plans/generate/${params.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
    loadData();
  }

  async function generateWorkout() {
    const token = localStorage.getItem("fitai_token");
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workout-plans/generate/${params.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
    loadData();
  }

  /* ─── Loading State ─── */
  if (loading) {
    return (
      <div className="page-content">
        <div className="orb orb-blue animate-float-slow" />
        <div className="orb orb-purple animate-float" style={{ animationDelay: '-2s' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Skeleton h={56} w="56px" />
            <div style={{ flex: 1 }}><Skeleton h={24} w="200px" /><Skeleton h={14} w="300px" style={{ marginTop: 8 }} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {[...Array(4)].map((_, i) => <Skeleton key={i} h={100} />)}
          </div>
          <Skeleton h={300} />
        </div>
      </div>
    );
  }

  /* ─── Error State ─── */
  if (error) {
    return (
      <div className="page-content">
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '80px 20px', textAlign: 'center', position: 'relative', zIndex: 1,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626',
            marginBottom: 16,
          }}>
            <AlertCircle size={24} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
            Failed to Load Client
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20, maxWidth: 400 }}>{error}</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={loadData} className="btn btn-primary">
              <RefreshCw size={14} /> Retry
            </button>
            <Link href="/clients" className="btn btn-secondary">Back to Clients</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!client) return null;

  const c = client;
  const initials = (c.full_name || "?").split(" ").map((s: string) => s[0]).join("").slice(0, 2).toUpperCase();
  const progressChart = progress.map((p: any) => ({
    date: p.created_at?.slice(0, 10) || "",
    weight: Number(p.weight),
  }));
  const isCalculated = c.plan_status === "calculated" || c.plan_status === "needs_update";
  const color = COLORS[(c.id || 1) % COLORS.length];
  const clientColor = COLORS[Math.abs(c.full_name?.length || 1) % COLORS.length];

  const weightChange = progress.length >= 2
    ? ((progress[progress.length - 1].weight - progress[0].weight) / progress[0].weight * 100).toFixed(1)
    : null;

  return (
    <div className="page-content" style={{ animation: 'slideUp 0.4s var(--ease) both' }}>
      <div className="orb orb-purple animate-float-slow" style={{ top: -80, right: -120 }} />
      <div className="orb orb-blue animate-float" style={{ bottom: 100, left: -60, animationDelay: '-3s' }} />
      <div className="orb orb-rose animate-float-slow" style={{ top: '40%', right: '5%', animationDelay: '-5s', opacity: 0.05 }} />

      {/* ─── Header ─── */}
      <header style={{ position: 'relative', zIndex: 1, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: `linear-gradient(135deg, ${clientColor}25, ${clientColor}08)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: clientColor, fontSize: 20, fontWeight: 700,
              boxShadow: `0 4px 16px ${clientColor}15`,
            }}>
              {initials}
            </div>
            <div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.3px', marginBottom: 2 }}>
                Client Profile
              </p>
              <h1 style={{
                fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 700,
                letterSpacing: '-0.3px', color: 'var(--text)', margin: 0, lineHeight: 1.2,
              }}>
                {c.full_name}
              </h1>
              <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                {c.goal && <span className="badge badge-info">{c.goal}</span>}
                {c.diet_type && <span className="badge badge-purple">{c.diet_type}</span>}
                {c.experience_level && <span className="badge badge-neutral">{c.experience_level}</span>}
                <span className={`badge ${isCalculated ? 'badge-success' : 'badge-warning'}`}>
                  {isCalculated ? 'AI Ready' : 'Assessment Pending'}
                </span>
              </div>
            </div>
          </div>
          <Link href="/clients" style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '7px 14px', borderRadius: 10,
            background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(0,0,0,0.04)', color: 'var(--text-secondary)',
            fontSize: 12, fontWeight: 600, textDecoration: 'none',
            transition: 'all 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.9)'; e.currentTarget.style.color = 'var(--text)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.7)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
          >
            <ChevronLeft size={14} /> Back
          </Link>
        </div>
      </header>

      {/* ─── Quick Stats ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24, position: 'relative', zIndex: 1 }}>
        {[
          { icon: Scale, label: 'Weight', value: c.weight ? `${c.weight} kg` : '—', color: '#2563EB' },
          { icon: Ruler, label: 'Height', value: c.height ? `${c.height} cm` : '—', color: '#8B5CF6' },
          { icon: Flame, label: 'Calorie Target', value: c.calorie_target ? `${c.calorie_target}` : '—', color: '#F59E0B' },
          { icon: Award, label: 'Recovery Score', value: c.recovery_score !== null ? `${c.recovery_score}%` : '—', color: '#10B981' },
        ].map((s, i) => (
          <div key={i} className="card card-hover" style={{
            padding: '16px 18px', borderTop: `3px solid ${s.color}`,
            animation: `slideUp 0.3s var(--ease) ${i * 0.04}s both`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: `linear-gradient(135deg, ${s.color}18, ${s.color}06)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color,
              }}>
                <s.icon size={16} />
              </div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.3px' }}>
              {s.value}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ─── Tabs ─── */}
      <div style={{
        display: 'flex', gap: 2, marginBottom: 24,
        background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)',
        borderRadius: 14, padding: 4, border: '1px solid rgba(255,255,255,0.4)',
        width: 'fit-content', position: 'relative', zIndex: 1, flexWrap: 'wrap',
      }}>
        {[
          { key: "overview", label: "Overview", icon: User },
          { key: "assessment", label: "Assessment", icon: Activity },
          { key: "diet", label: "Diet Plans", icon: Salad },
          { key: "workout", label: "Workout Plans", icon: Dumbbell },
          { key: "progress", label: "Progress", icon: BarChart3 },
        ].map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '7px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: activeTab === tab.key ? 'white' : 'transparent',
              color: activeTab === tab.key ? 'var(--text)' : 'var(--text-muted)',
              fontWeight: activeTab === tab.key ? 600 : 500,
              boxShadow: activeTab === tab.key ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
              fontFamily: 'var(--font-sans)', fontSize: 12,
              display: 'flex', alignItems: 'center', gap: 5,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (activeTab !== tab.key) e.currentTarget.style.color = 'var(--text)' }}
            onMouseLeave={e => { if (activeTab !== tab.key) e.currentTarget.style.color = 'var(--text-muted)' }}
          >
            <tab.icon size={13} /> {tab.label}
          </button>
        ))}
      </div>

      {/* ════════ TAB: OVERVIEW ════════ */}
      {activeTab === "overview" && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20, position: 'relative', zIndex: 1 }}>
          {/* Left: AI Engine + Chart */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {!isCalculated && (
              <div className="card" style={{
                padding: 24, borderLeft: `3px solid #8B5CF6`,
                background: 'linear-gradient(135deg, rgba(139,92,246,0.03), transparent)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.05))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7C3AED',
                  }}>
                    <Brain size={18} />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
                    AI Engine Ready
                  </h3>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 14px 46px', lineHeight: 1.5 }}>
                  Run the AI engine to calculate BMR, TDEE, calorie/macro targets, recovery score, and workout split recommendation.
                </p>
                <button onClick={runEngine} disabled={calculating} className="btn btn-gradient-purple btn-sm" style={{ marginLeft: 46 }}>
                  {calculating ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Calculating...</> : <><Sparkles size={14} /> Run AI Engine</>}
                </button>
              </div>
            )}

            {engineResults && (
              <div className="card card-accent-purple" style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669',
                    }}>
                      <Sparkles size={15} />
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                      AI Engine Results
                    </h3>
                  </div>
                  <span className="badge badge-success">Calculated</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px 20px' }}>
                  <Field label="BMR" value={`${engineResults.bmr} kcal`} color="#8B5CF6" />
                  <Field label="TDEE" value={`${engineResults.tdee} kcal`} color="#2563EB" />
                  <Field label="Calorie Target" value={`${engineResults.calorieTarget} kcal`} color="#F59E0B" />
                  <Field label="Protein" value={`${engineResults.proteinTargetG}g`} color="#2563EB" />
                  <Field label="Carbs" value={`${engineResults.carbsTargetG}g`} color="#F59E0B" />
                  <Field label="Fats" value={`${engineResults.fatTargetG}g`} color="#F43F5E" />
                  <Field label="Recovery Score" value={`${engineResults.recoveryScore}%`} color="#10B981" />
                  <Field label="Training Volume" value={`${engineResults.trainingVolumeMinutes} min/wk`} color="#8B5CF6" />
                  <Field label="Suggested Split" value={engineResults.workoutSplit} color="#06B6D4" />
                </div>
              </div>
            )}

            {progressChart.length > 1 && (
              <div className="card card-accent-blue" style={{ padding: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div>
                    <div className="section-heading blue" style={{ fontSize: 14 }}>Weight Trend</div>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{progress.length} entries</p>
                  </div>
                  {weightChange && (
                    <span style={{
                      display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600,
                      color: parseFloat(weightChange) < 0 ? '#059669' : '#DC2626',
                    }}>
                      {parseFloat(weightChange) < 0 ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                      {Math.abs(parseFloat(weightChange)).toFixed(1)}% total
                    </span>
                  )}
                </div>
                <div style={{ height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={progressChart}>
                      <defs>
                        <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563EB" stopOpacity={0.18} />
                          <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} dy={6} />
                      <YAxis domain={['dataMin - 1', 'dataMax + 1']} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} dx={-4} />
                      <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.06)', padding: '8px 12px' }} />
                      <Area type="monotone" dataKey="weight" stroke="#2563EB" strokeWidth={2.5} fill="url(#wGrad)" dot={{ fill: '#2563EB', r: 3, stroke: 'white', strokeWidth: 2 }} activeDot={{ r: 5, fill: '#2563EB', stroke: 'white', strokeWidth: 2 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* Right: Actions + Plans */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="card card-accent-orange" style={{ padding: 22 }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>
                Quick Actions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button onClick={generateDiet} disabled={!isCalculated} className="btn btn-primary btn-sm" style={{ justifyContent: 'center', width: '100%', opacity: isCalculated ? 1 : 0.5 }}>
                  <Salad size={14} /> Generate Diet Plan
                </button>
                <button onClick={generateWorkout} disabled={!isCalculated} className="btn btn-gradient-green btn-sm" style={{ justifyContent: 'center', width: '100%', opacity: isCalculated ? 1 : 0.5 }}>
                  <Dumbbell size={14} /> Generate Workout Plan
                </button>
                <button onClick={runEngine} className="btn btn-secondary btn-sm" style={{ justifyContent: 'center', width: '100%' }}>
                  <Brain size={14} /> Re-run AI Engine
                </button>
              </div>
            </div>

            {dietPlans.length > 0 && (
              <div className="card card-accent-blue" style={{ padding: 22 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                    Latest Diet Plan
                  </h3>
                  <span className="badge badge-info" style={{ fontSize: 10 }}>v{dietPlans[0].version}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Field label="Calories" value={`${dietPlans[0].total_calories} kcal`} />
                  <Field label="Protein / Carbs / Fats" value={`${dietPlans[0].protein_g}g / ${dietPlans[0].carbs_g}g / ${dietPlans[0].fats_g}g`} />
                  <Field label="Water" value={`${dietPlans[0].water_liters}L`} />
                  <Link href={`/diet-plans/${dietPlans[0].id}`} className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start', marginTop: 4 }}>
                    View Full Plan <ChevronRight size={12} />
                  </Link>
                </div>
              </div>
            )}

            {workoutPlans.length > 0 && (
              <div className="card card-accent-green" style={{ padding: 22 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                    Latest Workout
                  </h3>
                  <span className="badge badge-success" style={{ fontSize: 10 }}>v{workoutPlans[0].version}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Field label="Split" value={workoutPlans[0].split_type} />
                  <Field label="Days/Week" value={`${workoutPlans[0].days_per_week} days`} />
                  <Field label="Session" value={`${workoutPlans[0].session_duration_minutes || 45} min`} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════ TAB: ASSESSMENT ════════ */}
      {activeTab === "assessment" && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
            <button onClick={() => router.push(`/assessments/new/${params.id}`)} className="btn btn-primary btn-sm">
              <Plus size={14} /> New Assessment
            </button>
            {assessmentId && (
              <Link href={`/assessments/${assessmentId}`} className="btn btn-ghost btn-sm" style={{ marginLeft: 8 }}>
                View Full Assessment <ChevronRight size={12} />
              </Link>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div className="card card-accent-blue" style={{ padding: 22 }}>
              <div className="section-heading blue" style={{ fontSize: 14, marginBottom: 16 }}>Personal Details</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Field label="Age" value={c.age} />
                <Field label="Gender" value={c.gender} />
                <Field label="Height" value={`${c.height || "—"} cm`} />
                <Field label="Weight" value={`${c.weight || "—"} kg`} />
                <Field label="Body Fat" value={`${c.body_fat_percentage || "—"}%`} />
              </div>
            </div>
            <div className="card card-accent-purple" style={{ padding: 22 }}>
              <div className="section-heading" style={{ fontSize: 14, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text)' }}>
                <span style={{ width: 4, height: 16, borderRadius: 2, background: 'linear-gradient(180deg, #8B5CF6, #7C3AED)', flexShrink: 0 }} />
                Goal Assessment
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Field label="Primary Goal" value={c.goal} />
                <Field label="Secondary Goals" value={c.secondary_goals?.join(", ")} />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div className="card" style={{ padding: 22, borderTop: '3px solid #F43F5E' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Heart size={14} style={{ color: '#F43F5E' }} /> Medical
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Field label="Conditions" value={c.medical_conditions} />
                <Field label="Medications" value={c.medications} />
                <Field label="Allergies" value={c.allergies} />
                <Field label="Injuries" value={c.injuries} />
                <Field label="Surgeries" value={c.surgeries} />
              </div>
            </div>
            <div className="card" style={{ padding: 22, borderTop: '3px solid #10B981' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Salad size={14} style={{ color: '#10B981' }} /> Nutrition
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Field label="Diet Type" value={c.diet_type} />
                <Field label="Meal Frequency" value={`${c.meal_frequency || "—"} meals/day`} />
                <Field label="Food Likes" value={c.food_likes} />
                <Field label="Food Dislikes" value={c.food_dislikes} />
                <Field label="Water Intake" value={`${c.water_intake_cups || "—"} cups/day`} />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div className="card" style={{ padding: 22, borderTop: '3px solid #F59E0B' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Dumbbell size={14} style={{ color: '#F59E0B' }} /> Training
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Field label="Experience" value={c.experience_level} />
                <Field label="Workout Days" value={`${c.workout_days_per_week || "—"} / week`} />
                <Field label="Duration" value={`${c.workout_duration_minutes || "—"} min`} />
                <Field label="Equipment" value={c.equipment_available} />
                <Field label="Mobility Issues" value={c.mobility_issues} />
              </div>
            </div>
            <div className="card" style={{ padding: 22, borderTop: '3px solid #06B6D4' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sun size={14} style={{ color: '#06B6D4' }} /> Lifestyle
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Field label="Occupation" value={c.occupation} />
                <Field label="Activity Level" value={c.activity_level} />
                <Field label="Sleep" value={`${c.sleep_hours || "—"} hours`} />
                <Field label="Stress Level" value={c.stress_level} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════ TAB: DIET PLANS ════════ */}
      {activeTab === "diet" && (
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button onClick={generateDiet} disabled={!isCalculated} className="btn btn-primary btn-sm" style={{ opacity: isCalculated ? 1 : 0.5 }}>
              <Sparkles size={14} /> Generate New Plan
            </button>
          </div>
          {dietPlans.length === 0 ? (
            <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14, margin: '0 auto 12px',
                background: 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(37,99,235,0.04))',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB',
              }}>
                <Salad size={22} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
                No diet plans yet
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, maxWidth: 300, margin: '0 auto 16px' }}>
                Run the AI engine first, then generate a personalized diet plan.
              </p>
              <button onClick={generateDiet} disabled={!isCalculated} className="btn btn-primary btn-sm">
                <Sparkles size={14} /> Generate Diet Plan
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {dietPlans.map((plan: any, i: number) => (
                <Link key={plan.id} href={`/diet-plans/${plan.id}`}
                  className="card card-hover"
                  style={{
                    padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    textDecoration: 'none', borderLeft: `3px solid ${COLORS[i % COLORS.length]}`,
                    animation: `slideUp 0.3s var(--ease) ${i * 0.04}s both`,
                  }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{plan.title || `Diet Plan v${plan.version}`}</h3>
                    <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                      <span className="badge badge-info">{plan.total_calories} kcal</span>
                      <span className="badge badge-success">{plan.protein_g}g protein</span>
                      <span className="badge badge-neutral">v{plan.version}</span>
                      <span className={`badge ${plan.status === "approved" ? "badge-success" : "badge-warning"}`}>{plan.status}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ════════ TAB: WORKOUT PLANS ════════ */}
      {activeTab === "workout" && (
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button onClick={generateWorkout} disabled={!isCalculated} className="btn btn-gradient-green btn-sm" style={{ opacity: isCalculated ? 1 : 0.5 }}>
              <Sparkles size={14} /> Generate New Plan
            </button>
          </div>
          {workoutPlans.length === 0 ? (
            <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14, margin: '0 auto 12px',
                background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.04))',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981',
              }}>
                <Dumbbell size={22} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
                No workout plans yet
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, maxWidth: 300, margin: '0 auto 16px' }}>
                Run the AI engine first, then generate a personalized workout plan.
              </p>
              <button onClick={generateWorkout} disabled={!isCalculated} className="btn btn-gradient-green btn-sm">
                <Sparkles size={14} /> Generate Workout Plan
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {workoutPlans.map((plan: any, i: number) => (
                <div key={plan.id} className="card card-hover" style={{
                  padding: '16px 20px', borderLeft: `3px solid ${COLORS[(i + 2) % COLORS.length]}`,
                  animation: `slideUp 0.3s var(--ease) ${i * 0.04}s both`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{plan.title || `Workout Plan v${plan.version}`}</h3>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0' }}>
                        {plan.split_type} · {plan.days_per_week} days/week · {plan.session_duration_minutes || 45} min
                      </p>
                    </div>
                    <span className={`badge ${plan.status === "approved" ? "badge-success" : "badge-warning"}`} style={{ fontSize: 10 }}>
                      {plan.status}
                    </span>
                  </div>
                  {plan.cardio_recommendation && (
                    <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 8 }}>
                      <strong>Cardio:</strong> {plan.cardio_recommendation.slice(0, 120)}...
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ════════ TAB: PROGRESS ════════ */}
      {activeTab === "progress" && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20, position: 'relative', zIndex: 1 }}>
          {/* Weight Progress */}
          <div className="card card-accent-blue" style={{ padding: 22 }}>
            <div className="section-heading blue" style={{ fontSize: 14, marginBottom: 16 }}>Weight Progress</div>
            {progress.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--text-muted)', padding: '20px 0' }}>No progress entries yet.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead><tr><th>Date</th><th>Weight</th><th>Note</th></tr></thead>
                  <tbody>
                    {progress.map((item: any) => (
                      <tr key={item.id}>
                        <td style={{ fontWeight: 500 }}>{item.created_at?.slice(0, 10)}</td>
                        <td style={{ fontWeight: 600 }}>{item.weight} kg</td>
                        <td style={{ color: 'var(--text-muted)' }}>{item.note || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(0,0,0,0.04)' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>Add New Entry</p>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div>
                  <label className="input-label">Weight (kg)</label>
                  <input type="number" step="0.1" value={newWeight} onChange={(e) => setNewWeight(e.target.value)}
                    className="input-field" style={{ width: 110 }} placeholder="68.5" />
                </div>
                <div>
                  <label className="input-label">Note</label>
                  <input type="text" value={newNote} onChange={(e) => setNewNote(e.target.value)}
                    className="input-field" style={{ width: 180 }} placeholder="Optional note" />
                </div>
                <button onClick={addProgress} disabled={adding || !newWeight} className="btn btn-primary btn-sm">
                  {adding ? "Adding..." : <><Plus size={14} /> Add Entry</>}
                </button>
              </div>
            </div>
          </div>

          {/* Measurements + Adherence */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="card card-accent-purple" style={{ padding: 22 }}>
              <div className="section-heading" style={{
                fontSize: 14, marginBottom: 16,
                display: 'flex', alignItems: 'center', gap: 10,
                fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text)',
              }}>
                <span style={{ width: 4, height: 16, borderRadius: 2, background: 'linear-gradient(180deg, #8B5CF6, #7C3AED)', flexShrink: 0 }} />
                Body Measurements
              </div>
              {measurements.length === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No measurements yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {measurements.slice(0, 5).map((m: any) => (
                    <div key={m.id} style={{
                      display: 'flex', justifyContent: 'space-between', fontSize: 12,
                      padding: '6px 10px', borderRadius: 8,
                      background: 'rgba(0,0,0,0.01)',
                    }}>
                      <span style={{ color: 'var(--text-muted)' }}>{m.measured_at?.slice(0, 10)}</span>
                      <span style={{ fontWeight: 600, color: 'var(--text)' }}>
                        {m.chest_cm && `Chest: ${m.chest_cm} `}
                        {m.waist_cm && `Waist: ${m.waist_cm} `}
                        {m.body_fat_percentage && `BF: ${m.body_fat_percentage}%`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card card-accent-green" style={{ padding: 22 }}>
              <div className="section-heading green" style={{ fontSize: 14, marginBottom: 16 }}>Adherence</div>
              {adherence.length === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No adherence data yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {adherence.slice(0, 5).map((a: any) => (
                    <div key={a.id} style={{
                      display: 'flex', justifyContent: 'space-between', fontSize: 12,
                      padding: '6px 10px', borderRadius: 8,
                      background: 'rgba(0,0,0,0.01)',
                    }}>
                      <span style={{ color: 'var(--text-muted)' }}>{a.log_date}</span>
                      <span style={{ fontWeight: 600, color: 'var(--text)' }}>
                        Diet: {a.diet_adherence}% · Workout: {a.workout_adherence}% · Water: {a.water_cups}cups
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
