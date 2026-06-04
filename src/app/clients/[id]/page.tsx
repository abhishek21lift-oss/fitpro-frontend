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
import { api } from "../../../lib/api";

const COLORS = ['#6366F1', '#8B5CF6', '#10B981', '#F59E0B', '#F43F5E', '#06B6D4'];

const THEMES = {
  overview: { gradient: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "#6366F1", bg: "rgba(99,102,241,0.06)" },
  assessment: { gradient: "linear-gradient(135deg, #F59E0B, #EF4444)", color: "#F59E0B", bg: "rgba(245,158,11,0.06)" },
  diet: { gradient: "linear-gradient(135deg, #10B981, #059669)", color: "#10B981", bg: "rgba(16,185,129,0.06)" },
  workout: { gradient: "linear-gradient(135deg, #F97316, #EF4444)", color: "#F97316", bg: "rgba(249,115,22,0.06)" },
  progress: { gradient: "linear-gradient(135deg, #06B6D4, #6366F1)", color: "#06B6D4", bg: "rgba(6,182,212,0.06)" },
};

function Field({ label, value, color }: { label: string; value: any; color?: string }) {
  return (
    <div>
      <p style={{ fontSize: 10, fontWeight: 700, color: color || '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
        {label}
      </p>
      <p style={{ fontSize: "clamp(13px,1.4vw,15px)", fontWeight: 600, color: '#1A1A2E', margin: '3px 0 0' }}>{value || "—"}</p>
    </div>
  );
}

function Skeleton({ h = 20, w = '100%', style }: { h?: number; w?: string; style?: React.CSSProperties }) {
  return (
    <div style={{
      height: h, width: w, borderRadius: 10,
      background: 'linear-gradient(90deg, rgba(99,102,241,0.04) 25%, rgba(99,102,241,0.1) 50%, rgba(99,102,241,0.04) 75%)',
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
        api.clients.get(id),
        api.clients.progress.list(id).catch(() => []),
        api.clients.measurements.list(id).catch(() => []),
        api.clients.adherence.list(id).catch(() => []),
        api.dietPlans.byClient(id).catch(() => []),
        api.workoutPlans.byClient(id).catch(() => []),
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
    try {
      await api.clients.progress.create(params.id as string, { weight: parseFloat(newWeight), note: newNote });
      loadData();
      setNewWeight(""); setNewNote("");
    } catch {}
    setAdding(false);
  }

  async function runEngine() {
    setCalculating(true);
    try {
      const data = await api.engine.calculate(params.id as string);
      setEngineResults(data);
      loadData();
    } catch {}
    setCalculating(false);
  }

  async function generateDiet() {
    try {
      await api.dietPlans.generate(params.id as string);
      loadData();
    } catch {}
  }

  async function generateWorkout() {
    try {
      await api.workoutPlans.generate(params.id as string);
      loadData();
    } catch {}
  }

  const th = THEMES[activeTab as keyof typeof THEMES] || THEMES.overview;

  /* ─── Loading ─── */
  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", padding: "clamp(16px,3vw,40px)",
        background: "linear-gradient(180deg, #F8FAFF 0%, #F0F2FE 100%)",
        display: "flex", justifyContent: "center",
      }}>
        <div style={{ width: "100%", maxWidth: 1000 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 }}>
            <Skeleton h={60} w="60px" style={{ borderRadius: 16 }} />
            <div style={{ flex: 1 }}><Skeleton h={24} w="220px" /><Skeleton h={14} w="320px" style={{ marginTop: 8 }} /></div>
          </div>
          <div className="stats-grid">
            {[...Array(4)].map((_, i) => <Skeleton key={i} h={100} style={{ borderRadius: 16 }} />)}
          </div>
          <Skeleton h={320} style={{ borderRadius: 20, marginTop: 20 }} />
        </div>
        <style>{`.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 14; }`}</style>
      </div>
    );
  }

  /* ─── Error ─── */
  if (error) {
    return (
      <div style={{
        minHeight: "100vh", padding: "clamp(16px,3vw,40px)",
        background: "linear-gradient(180deg, #FFF5F5 0%, #FFF 100%)",
        display: "flex", justifyContent: "center", alignItems: "center",
      }}>
        <div style={{
          background: "rgba(255,255,255,0.8)", backdropFilter: "blur(24px)",
          borderRadius: 24, padding: "clamp(32px,4vw,48px)",
          border: "1px solid rgba(255,255,255,0.6)",
          boxShadow: "0 8px 40px rgba(239,68,68,0.08)",
          textAlign: "center", maxWidth: 440, width: "100%",
        }}>
          <div style={{
            width: 60, height: 60, borderRadius: 16,
            background: "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))",
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: "0 auto 16px", color: '#DC2626',
          }}>
            <AlertCircle size={26} />
          </div>
          <h2 style={{ fontSize: "clamp(18px,2.5vw,22px)", fontWeight: 700, color: '#1A1A2E', marginBottom: 8 }}>
            Failed to Load Client
          </h2>
          <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 24, maxWidth: 360, margin: "0 auto 24px" }}>{error}</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button onClick={loadData} style={{
              padding: "10px 24px", borderRadius: 12, border: "none",
              background: "linear-gradient(135deg, #EF4444, #DC2626)",
              color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
              fontFamily: "var(--font-sans)",
              boxShadow: "0 4px 14px rgba(239,68,68,0.25)",
            }}>
              <RefreshCw size={14} /> Retry
            </button>
            <Link href="/clients" style={{
              padding: "10px 24px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.06)",
              background: "rgba(255,255,255,0.8)", color: '#374151',
              fontSize: 13, fontWeight: 600, textDecoration: "none",
              fontFamily: "var(--font-sans)",
            }}>Back to Clients</Link>
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

  const weightChange = progress.length >= 2
    ? ((progress[progress.length - 1].weight - progress[0].weight) / progress[0].weight * 100).toFixed(1)
    : null;

  return (
    <div style={{
      minHeight: "100vh",
      padding: "clamp(16px,3vw,40px)",
      background: "linear-gradient(180deg, #F8FAFF 0%, #F0F2FE 50%, #E8ECF4 100%)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Orbs */}
      <div style={{
        position: "absolute", top: -120, right: -80, width: 500, height: 500,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${th.color}0a, transparent 70%)`,
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -100, left: -60, width: 400, height: 400,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${COLORS[(COLORS.indexOf(th.color) + 1) % COLORS.length]}08, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* ─── Header ─── */}
        <header style={{
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: "clamp(16px,2vw,20px)",
          border: "1px solid rgba(255,255,255,0.6)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
          padding: "clamp(16px,2vw,24px) clamp(16px,2.5vw,28px)",
          marginBottom: "clamp(16px,2.5vw,24px)",
        }}>
          <div style={{
            display: "flex", alignItems: "flex-start", justifyContent: "space-between",
            gap: 16, flexWrap: "wrap",
          }}>
            <div style={{ display: "flex", gap: "clamp(12px,2vw,18px)", alignItems: "center" }}>
              <div style={{
                width: "clamp(52px,6vw,64px)", height: "clamp(52px,6vw,64px)",
                borderRadius: "clamp(14px,2vw,18px)",
                background: `linear-gradient(135deg, ${color}, ${COLORS[(COLORS.indexOf(color) + 1) % COLORS.length]})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 700,
                boxShadow: `0 8px 24px ${color}30`,
                flexShrink: 0,
              }}>
                {initials}
              </div>
              <div>
                <p style={{
                  fontSize: "clamp(10px,1.1vw,11px)", fontWeight: 600, color: '#6B7280',
                  letterSpacing: "0.3px", textTransform: "uppercase", marginBottom: 2,
                }}>
                  Client Profile
                </p>
                <h1 style={{
                  fontSize: "clamp(20px,3vw,28px)", fontWeight: 700,
                  letterSpacing: "-0.02em", color: '#1A1A2E', margin: 0, lineHeight: 1.2,
                }}>
                  {c.full_name}
                </h1>
                <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                  {c.goal && <PillBadge label={c.goal} color="#6366F1" />}
                  {c.diet_type && <PillBadge label={c.diet_type} color="#10B981" />}
                  {c.experience_level && <PillBadge label={c.experience_level} color="#F97316" />}
                  <PillBadge
                    label={isCalculated ? "AI Ready" : "Assessment Pending"}
                    color={isCalculated ? "#059669" : "#D97706"}
                  />
                </div>
              </div>
            </div>
            <Link href="/clients" style={{
              display: "flex", alignItems: "center", gap: 4,
              padding: "8px 16px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.04)",
              background: "rgba(255,255,255,0.7)", color: '#6B7280',
              fontSize: "clamp(11px,1.2vw,12px)", fontWeight: 600, textDecoration: "none",
              fontFamily: "var(--font-sans)", whiteSpace: "nowrap",
              transition: "all 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.9)'; e.currentTarget.style.color = '#1A1A2E' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.7)'; e.currentTarget.style.color = '#6B7280' }}
            >
              <ChevronLeft size={14} /> Back
            </Link>
          </div>
        </header>

        {/* ─── Quick Stats ─── */}
        <div className="stats-grid" style={{ marginBottom: "clamp(16px,2.5vw,24px)" }}>
          {[
            { icon: Scale, label: 'Weight', value: c.weight ? `${c.weight} kg` : '—', gradient: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "#6366F1" },
            { icon: Ruler, label: 'Height', value: c.height ? `${c.height} cm` : '—', gradient: "linear-gradient(135deg, #06B6D4, #6366F1)", color: "#06B6D4" },
            { icon: Flame, label: 'Calories', value: c.calorie_target ? `${c.calorie_target}` : '—', gradient: "linear-gradient(135deg, #F59E0B, #EF4444)", color: "#F59E0B" },
            { icon: Award, label: 'Recovery', value: c.recovery_score !== null ? `${c.recovery_score}%` : '—', gradient: "linear-gradient(135deg, #10B981, #059669)", color: "#10B981" },
          ].map((s, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.75)", backdropFilter: "blur(16px)",
              borderRadius: 16, padding: "clamp(14px,1.8vw,18px)",
              border: "1px solid rgba(255,255,255,0.5)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              animation: `slideUp 0.3s ease ${i * 0.06}s both`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: s.gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                  boxShadow: `0 4px 12px ${s.color}30`,
                }}>
                  <s.icon size={16} />
                </div>
              </div>
              <div style={{ fontSize: "clamp(20px,2.5vw,24px)", fontWeight: 700, color: '#1A1A2E', letterSpacing: "-0.02em" }}>
                {s.value}
              </div>
              <div style={{ fontSize: "clamp(10px,1.1vw,11px)", color: '#6B7280', fontWeight: 500, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ─── Tabs ─── */}
        <div style={{
          background: "rgba(255,255,255,0.7)", backdropFilter: "blur(20px)",
          borderRadius: 14, padding: 5,
          border: "1px solid rgba(255,255,255,0.5)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          marginBottom: "clamp(16px,2.5vw,24px)",
          display: "flex", gap: 3, flexWrap: "wrap",
        }}>
          {[
            { key: "overview", label: "Overview", icon: User, color: "#6366F1" },
            { key: "assessment", label: "Assessment", icon: Activity, color: "#F59E0B" },
            { key: "diet", label: "Diet", icon: Salad, color: "#10B981" },
            { key: "workout", label: "Workout", icon: Dumbbell, color: "#F97316" },
            { key: "progress", label: "Progress", icon: BarChart3, color: "#06B6D4" },
          ].map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                style={{
                  flex: 1, padding: "clamp(7px,1vw,10px) clamp(12px,1.8vw,18px)",
                  borderRadius: 10, border: "none", cursor: "pointer",
                  background: isActive ? tab.color : "transparent",
                  color: isActive ? "white" : '#6B7280',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: "clamp(11px,1.2vw,13px)",
                  fontFamily: "var(--font-sans)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  transition: "all 0.2s", whiteSpace: "nowrap",
                  boxShadow: isActive ? `0 4px 12px ${tab.color}30` : "none",
                }}
              >
                <tab.icon size={14} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* ═══ OVERVIEW ═══ */}
        {activeTab === "overview" && (
          <div className="overview-grid">
            <div style={{ display: "flex", flexDirection: "column", gap: "clamp(14px,2vw,18px)" }}>
              {!isCalculated && (
                <div style={{
                  background: `linear-gradient(135deg, ${THEMES.overview.bg}, transparent)`,
                  borderRadius: 16, padding: "clamp(18px,2.5vw,24px)",
                  border: "1px solid rgba(255,255,255,0.6)",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 10,
                      background: THEMES.overview.gradient,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                      boxShadow: "0 4px 12px rgba(99,102,241,0.25)",
                    }}>
                      <Brain size={18} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: "clamp(14px,1.6vw,16px)", fontWeight: 700, color: '#1A1A2E', margin: 0 }}>
                        AI Engine Ready
                      </h3>
                      <p style={{ fontSize: "clamp(11px,1.2vw,12px)", color: '#6B7280', margin: "1px 0 0" }}>
                        Calculate BMR, TDEE, macros, and recovery score
                      </p>
                    </div>
                  </div>
                  <button onClick={runEngine} disabled={calculating} style={{
                    padding: "10px 22px", borderRadius: 10, border: "none",
                    background: THEMES.overview.gradient, color: "white",
                    fontSize: "clamp(12px,1.2vw,13px)", fontWeight: 600, cursor: calculating ? "default" : "pointer",
                    display: "flex", alignItems: "center", gap: 6,
                    fontFamily: "var(--font-sans)",
                    boxShadow: "0 4px 14px rgba(99,102,241,0.25)",
                    opacity: calculating ? 0.7 : 1,
                  }}>
                    {calculating ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Calculating...</> : <><Sparkles size={14} /> Run AI Engine</>}
                  </button>
                </div>
              )}

              {engineResults && (
                <div style={{
                  background: "rgba(255,255,255,0.75)", backdropFilter: "blur(16px)",
                  borderRadius: 16, padding: "clamp(18px,2.5vw,24px)",
                  border: "1px solid rgba(255,255,255,0.5)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 10,
                        background: "linear-gradient(135deg, #10B981, #059669)",
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                        boxShadow: "0 4px 12px rgba(16,185,129,0.25)",
                      }}>
                        <Sparkles size={16} />
                      </div>
                      <h3 style={{ fontSize: "clamp(14px,1.5vw,15px)", fontWeight: 700, color: '#1A1A2E', margin: 0 }}>
                        AI Engine Results
                      </h3>
                    </div>
                    <PillBadge label="Calculated" color="#059669" />
                  </div>
                  <div className="results-grid">
                    <Field label="BMR" value={`${engineResults.bmr} kcal`} color="#8B5CF6" />
                    <Field label="TDEE" value={`${engineResults.tdee} kcal`} color="#6366F1" />
                    <Field label="Calorie Target" value={`${engineResults.calorieTarget} kcal`} color="#F59E0B" />
                    <Field label="Protein" value={`${engineResults.proteinTargetG}g`} color="#6366F1" />
                    <Field label="Carbs" value={`${engineResults.carbsTargetG}g`} color="#F59E0B" />
                    <Field label="Fats" value={`${engineResults.fatTargetG}g`} color="#F43F5E" />
                    <Field label="Recovery Score" value={`${engineResults.recoveryScore}%`} color="#10B981" />
                    <Field label="Training Volume" value={`${engineResults.trainingVolumeMinutes} min/wk`} color="#8B5CF6" />
                    <Field label="Split" value={engineResults.workoutSplit} color="#06B6D4" />
                  </div>
                </div>
              )}

              {progressChart.length > 1 && (
                <div style={{
                  background: "rgba(255,255,255,0.75)", backdropFilter: "blur(16px)",
                  borderRadius: 16, padding: "clamp(18px,2.5vw,22px)",
                  border: "1px solid rgba(255,255,255,0.5)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div>
                      <h3 style={{
                        fontSize: "clamp(13px,1.4vw,14px)", fontWeight: 700, color: '#1A1A2E', margin: 0,
                        display: 'flex', alignItems: 'center', gap: 8,
                      }}>
                        <span style={{ width: 4, height: 14, borderRadius: 2, background: THEMES.overview.gradient, flexShrink: 0 }} />
                        Weight Trend
                      </h3>
                      <p style={{ fontSize: "clamp(10px,1.1vw,11px)", color: '#6B7280', margin: "2px 0 0" }}>{progress.length} entries</p>
                    </div>
                    {weightChange && (
                      <span style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        fontSize: "clamp(11px,1.2vw,12px)", fontWeight: 600,
                        color: parseFloat(weightChange) < 0 ? '#059669' : '#DC2626',
                      }}>
                        {parseFloat(weightChange) < 0 ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                        {Math.abs(parseFloat(weightChange)).toFixed(1)}%
                      </span>
                    )}
                  </div>
                  <div style={{ height: 180 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={progressChart}>
                        <defs>
                          <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366F1" stopOpacity={0.18} />
                            <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} dy={6} />
                        <YAxis domain={['dataMin - 1', 'dataMax + 1']} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} dx={-4} />
                        <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.06)', padding: '8px 12px' }} />
                        <Area type="monotone" dataKey="weight" stroke="#6366F1" strokeWidth={2.5} fill="url(#wGrad)" dot={{ fill: '#6366F1', r: 3, stroke: 'white', strokeWidth: 2 }} activeDot={{ r: 5, fill: '#6366F1', stroke: 'white', strokeWidth: 2 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "clamp(14px,2vw,18px)" }}>
              <div style={{
                background: "rgba(255,255,255,0.75)", backdropFilter: "blur(16px)",
                borderRadius: 16, padding: "clamp(18px,2.5vw,22px)",
                border: "1px solid rgba(255,255,255,0.5)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              }}>
                <h3 style={{
                  fontSize: "clamp(14px,1.5vw,15px)", fontWeight: 700, color: '#1A1A2E', marginBottom: 14,
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ width: 4, height: 16, borderRadius: 2, background: "linear-gradient(180deg, #F97316, #EF4444)", flexShrink: 0 }} />
                  Quick Actions
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <ActionBtn onClick={generateDiet} disabled={!isCalculated} bg="linear-gradient(135deg, #10B981, #059669)" color="white" shadow="rgba(16,185,129,0.25)">
                    <Salad size={14} /> Generate Diet Plan
                  </ActionBtn>
                  <ActionBtn onClick={generateWorkout} disabled={!isCalculated} bg="linear-gradient(135deg, #F97316, #EF4444)" color="white" shadow="rgba(249,115,22,0.25)">
                    <Dumbbell size={14} /> Generate Workout Plan
                  </ActionBtn>
                  <ActionBtn onClick={runEngine} bg="rgba(255,255,255,0.8)" color="#374151" border="1px solid rgba(0,0,0,0.06)">
                    <Brain size={14} /> Re-run AI Engine
                  </ActionBtn>
                </div>
              </div>

              {dietPlans.length > 0 && (
                <div style={{
                  background: "rgba(255,255,255,0.75)", backdropFilter: "blur(16px)",
                  borderRadius: 16, padding: "clamp(18px,2.5vw,22px)",
                  border: "1px solid rgba(255,255,255,0.5)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h3 style={{ fontSize: "clamp(13px,1.4vw,14px)", fontWeight: 700, color: '#1A1A2E', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 4, height: 14, borderRadius: 2, background: "linear-gradient(180deg, #10B981, #059669)", flexShrink: 0 }} />
                      Latest Diet Plan
                    </h3>
                    <PillBadge label={`v${dietPlans[0].version}`} color="#6366F1" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <Field label="Calories" value={`${dietPlans[0].total_calories} kcal`} />
                    <Field label="Protein / Carbs / Fats" value={`${dietPlans[0].protein_g}g / ${dietPlans[0].carbs_g}g / ${dietPlans[0].fats_g}g`} />
                    <Field label="Water" value={`${dietPlans[0].water_liters}L`} />
                    <Link href={`/diet-plans/${dietPlans[0].id}`} style={{
                      alignSelf: 'flex-start', marginTop: 4, padding: "6px 14px", borderRadius: 8,
                      border: "1px solid rgba(99,102,241,0.15)", background: "rgba(99,102,241,0.04)",
                      color: "#6366F1", fontSize: "clamp(11px,1.2vw,12px)", fontWeight: 600, textDecoration: "none",
                      display: "flex", alignItems: "center", gap: 4,
                      fontFamily: "var(--font-sans)",
                    }}>
                      View Full Plan <ChevronRight size={12} />
                    </Link>
                  </div>
                </div>
              )}

              {workoutPlans.length > 0 && (
                <div style={{
                  background: "rgba(255,255,255,0.75)", backdropFilter: "blur(16px)",
                  borderRadius: 16, padding: "clamp(18px,2.5vw,22px)",
                  border: "1px solid rgba(255,255,255,0.5)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h3 style={{ fontSize: "clamp(13px,1.4vw,14px)", fontWeight: 700, color: '#1A1A2E', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 4, height: 14, borderRadius: 2, background: "linear-gradient(180deg, #F97316, #EF4444)", flexShrink: 0 }} />
                      Latest Workout
                    </h3>
                    <PillBadge label={`v${workoutPlans[0].version}`} color="#10B981" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <Field label="Split" value={workoutPlans[0].split_type} />
                    <Field label="Days/Week" value={`${workoutPlans[0].days_per_week} days`} />
                    <Field label="Session" value={`${workoutPlans[0].session_duration_minutes || 45} min`} />
                  </div>
                </div>
              )}
              {!dietPlans.length && !workoutPlans.length && (
                <div style={{
                  background: "rgba(255,255,255,0.75)", backdropFilter: "blur(16px)",
                  borderRadius: 16, padding: "clamp(24px,3vw,40px)", textAlign: "center",
                  border: "1px solid rgba(255,255,255,0.5)",
                }}>
                  <Sparkles size={28} style={{ opacity: 0.2, marginBottom: 8 }} />
                  <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Run the AI engine to generate diet and workout plans</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ ASSESSMENT ═══ */}
        {activeTab === "assessment" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(14px,2vw,18px)" }}>
            {assessmentId && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Link href={`/assessments/${assessmentId}`} style={{
                  padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(245,158,11,0.15)",
                  background: "rgba(245,158,11,0.04)", color: "#D97706",
                  fontSize: "clamp(11px,1.2vw,12px)", fontWeight: 600, textDecoration: "none",
                  display: "flex", alignItems: "center", gap: 4,
                  fontFamily: "var(--font-sans)",
                }}>
                  View Full Assessment <ChevronRight size={12} />
                </Link>
              </div>
            )}
            <div className="assess-grid">
              <AssessCard gradient="linear-gradient(135deg, #6366F1, #8B5CF6)" title="Personal Details" icon={User}>
                <div className="field-grid">
                  <Field label="Age" value={c.age} />
                  <Field label="Gender" value={c.gender} />
                  <Field label="Height" value={`${c.height || "—"} cm`} />
                  <Field label="Weight" value={`${c.weight || "—"} kg`} />
                  <Field label="Body Fat" value={`${c.body_fat_percentage || "—"}%`} />
                </div>
              </AssessCard>
              <AssessCard gradient="linear-gradient(135deg, #8B5CF6, #7C3AED)" title="Goal Assessment" icon={Target}>
                <div className="field-grid">
                  <Field label="Primary Goal" value={c.goal} color="#8B5CF6" />
                  <Field label="Secondary Goals" value={c.secondary_goals?.join(", ")} />
                </div>
              </AssessCard>
            </div>
            <div className="assess-grid">
              <AssessCard gradient="linear-gradient(135deg, #EC4899, #F43F5E)" title="Medical" icon={Heart}>
                <div className="field-grid">
                  <Field label="Conditions" value={c.medical_conditions} />
                  <Field label="Medications" value={c.medications} />
                  <Field label="Allergies" value={c.allergies} />
                  <Field label="Injuries" value={c.injuries} />
                  <Field label="Surgeries" value={c.surgeries} />
                </div>
              </AssessCard>
              <AssessCard gradient="linear-gradient(135deg, #10B981, #059669)" title="Nutrition" icon={Salad}>
                <div className="field-grid">
                  <Field label="Diet Type" value={c.diet_type} />
                  <Field label="Meal Frequency" value={`${c.meal_frequency || "—"} meals/day`} />
                  <Field label="Food Likes" value={c.food_likes} />
                  <Field label="Food Dislikes" value={c.food_dislikes} />
                  <Field label="Water Intake" value={`${c.water_intake_cups || "—"} cups/day`} />
                </div>
              </AssessCard>
            </div>
            <div className="assess-grid">
              <AssessCard gradient="linear-gradient(135deg, #F97316, #EF4444)" title="Training" icon={Dumbbell}>
                <div className="field-grid">
                  <Field label="Experience" value={c.experience_level} />
                  <Field label="Workout Days" value={`${c.workout_days_per_week || "—"} / week`} />
                  <Field label="Duration" value={`${c.workout_duration_minutes || "—"} min`} />
                  <Field label="Equipment" value={c.equipment_available} />
                  <Field label="Mobility" value={c.mobility_issues} />
                </div>
              </AssessCard>
              <AssessCard gradient="linear-gradient(135deg, #06B6D4, #6366F1)" title="Lifestyle" icon={Sun}>
                <div className="field-grid">
                  <Field label="Occupation" value={c.occupation} />
                  <Field label="Activity Level" value={c.activity_level} />
                  <Field label="Sleep" value={`${c.sleep_hours || "—"} hours`} />
                  <Field label="Stress Level" value={c.stress_level} />
                </div>
              </AssessCard>
            </div>
          </div>
        )}

        {/* ═══ DIET ═══ */}
        {activeTab === "diet" && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
              <button onClick={generateDiet} disabled={!isCalculated} style={{
                padding: "10px 20px", borderRadius: 10, border: "none",
                background: !isCalculated ? "rgba(0,0,0,0.04)" : "linear-gradient(135deg, #10B981, #059669)",
                color: !isCalculated ? "#D1D5DB" : "white",
                fontSize: "clamp(12px,1.2vw,13px)", fontWeight: 600, cursor: !isCalculated ? "default" : "pointer",
                display: "flex", alignItems: "center", gap: 6,
                fontFamily: "var(--font-sans)",
                opacity: !isCalculated ? 0.5 : 1,
                boxShadow: isCalculated ? "0 4px 14px rgba(16,185,129,0.25)" : "none",
              }}>
                <Sparkles size={14} /> Generate New Plan
              </button>
            </div>
            {dietPlans.length === 0 ? (
              <div style={{
                background: "rgba(255,255,255,0.7)", backdropFilter: "blur(16px)",
                borderRadius: 20, padding: "clamp(40px,5vw,60px) 20px", textAlign: "center",
                border: "1px solid rgba(255,255,255,0.5)",
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14, margin: "0 auto 12px",
                  background: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.04))",
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981',
                }}>
                  <Salad size={24} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A2E', marginBottom: 6 }}>No diet plans yet</h3>
                <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 16, maxWidth: 300, margin: "0 auto 16px" }}>
                  Run the AI engine first, then generate a personalized diet plan.
                </p>
                <button onClick={generateDiet} disabled={!isCalculated} style={{
                  padding: "10px 22px", borderRadius: 10, border: "none",
                  background: "linear-gradient(135deg, #10B981, #059669)", color: "white",
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                  display: "inline-flex", alignItems: "center", gap: 6,
                  fontFamily: "var(--font-sans)",
                  opacity: isCalculated ? 1 : 0.5,
                  boxShadow: "0 4px 14px rgba(16,185,129,0.25)",
                }}>
                  <Sparkles size={14} /> Generate Diet Plan
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {dietPlans.map((plan: any, i: number) => (
                  <Link key={plan.id} href={`/diet-plans/${plan.id}`}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: "clamp(14px,2vw,18px) clamp(16px,2.5vw,20px)",
                      background: "rgba(255,255,255,0.75)", backdropFilter: "blur(12px)",
                      borderRadius: 14, border: "1px solid rgba(255,255,255,0.5)",
                      borderLeft: `4px solid ${COLORS[i % COLORS.length]}`,
                      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                      textDecoration: "none",
                      animation: `slideUp 0.3s ease ${i * 0.04}s both`,
                    }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "clamp(13px,1.4vw,14px)", fontWeight: 600, color: '#1A1A2E' }}>
                        {plan.title || `Diet Plan v${plan.version}`}
                      </h3>
                      <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                        <PillBadge label={`${plan.total_calories} kcal`} color="#6366F1" />
                        <PillBadge label={`${plan.protein_g}g protein`} color="#10B981" />
                        <PillBadge label={`v${plan.version}`} color="#6B7280" />
                        <PillBadge label={plan.status} color={plan.status === "approved" ? "#059669" : "#D97706"} />
                      </div>
                    </div>
                    <ChevronRight size={18} style={{ color: '#9CA3AF', flexShrink: 0 }} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══ WORKOUT ═══ */}
        {activeTab === "workout" && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
              <button onClick={generateWorkout} disabled={!isCalculated} style={{
                padding: "10px 20px", borderRadius: 10, border: "none",
                background: !isCalculated ? "rgba(0,0,0,0.04)" : "linear-gradient(135deg, #F97316, #EF4444)",
                color: !isCalculated ? "#D1D5DB" : "white",
                fontSize: "clamp(12px,1.2vw,13px)", fontWeight: 600, cursor: !isCalculated ? "default" : "pointer",
                display: "flex", alignItems: "center", gap: 6,
                fontFamily: "var(--font-sans)",
                opacity: !isCalculated ? 0.5 : 1,
                boxShadow: isCalculated ? "0 4px 14px rgba(249,115,22,0.25)" : "none",
              }}>
                <Sparkles size={14} /> Generate New Plan
              </button>
            </div>
            {workoutPlans.length === 0 ? (
              <div style={{
                background: "rgba(255,255,255,0.7)", backdropFilter: "blur(16px)",
                borderRadius: 20, padding: "clamp(40px,5vw,60px) 20px", textAlign: "center",
                border: "1px solid rgba(255,255,255,0.5)",
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14, margin: "0 auto 12px",
                  background: "linear-gradient(135deg, rgba(249,115,22,0.12), rgba(249,115,22,0.04))",
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F97316',
                }}>
                  <Dumbbell size={24} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A2E', marginBottom: 6 }}>No workout plans yet</h3>
                <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 16, maxWidth: 300, margin: "0 auto 16px" }}>
                  Run the AI engine first, then generate a personalized workout plan.
                </p>
                <button onClick={generateWorkout} disabled={!isCalculated} style={{
                  padding: "10px 22px", borderRadius: 10, border: "none",
                  background: "linear-gradient(135deg, #F97316, #EF4444)", color: "white",
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                  display: "inline-flex", alignItems: "center", gap: 6,
                  fontFamily: "var(--font-sans)",
                  opacity: isCalculated ? 1 : 0.5,
                  boxShadow: "0 4px 14px rgba(249,115,22,0.25)",
                }}>
                  <Sparkles size={14} /> Generate Workout Plan
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {workoutPlans.map((plan: any, i: number) => (
                  <div key={plan.id} style={{
                    padding: "clamp(14px,2vw,18px) clamp(16px,2.5vw,20px)",
                    background: "rgba(255,255,255,0.75)", backdropFilter: "blur(12px)",
                    borderRadius: 14, border: "1px solid rgba(255,255,255,0.5)",
                    borderLeft: `4px solid ${COLORS[(i + 2) % COLORS.length]}`,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                    animation: `slideUp 0.3s ease ${i * 0.04}s both`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: "clamp(13px,1.4vw,14px)", fontWeight: 600, color: '#1A1A2E' }}>
                          {plan.title || `Workout Plan v${plan.version}`}
                        </h3>
                        <p style={{ fontSize: "clamp(11px,1.2vw,12px)", color: '#6B7280', margin: "4px 0 0" }}>
                          {plan.split_type} · {plan.days_per_week} days/week · {plan.session_duration_minutes || 45} min
                        </p>
                      </div>
                      <PillBadge label={plan.status} color={plan.status === "approved" ? "#059669" : "#D97706"} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══ PROGRESS ═══ */}
        {activeTab === "progress" && (
          <div className="progress-grid">
            <div style={{
              background: "rgba(255,255,255,0.75)", backdropFilter: "blur(16px)",
              borderRadius: 16, padding: "clamp(18px,2.5vw,24px)",
              border: "1px solid rgba(255,255,255,0.5)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
            }}>
              <h3 style={{
                fontSize: "clamp(14px,1.5vw,15px)", fontWeight: 700, color: '#1A1A2E', marginBottom: 16,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ width: 4, height: 16, borderRadius: 2, background: THEMES.progress.gradient, flexShrink: 0 }} />
                Weight Progress
              </h3>
              {progress.length === 0 ? (
                <p style={{ fontSize: 13, color: '#6B7280', padding: '20px 0' }}>No progress entries yet.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{
                    width: '100%', borderCollapse: 'collapse', fontSize: "clamp(12px,1.3vw,13px)",
                  }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                        <th style={{ textAlign: 'left', padding: '8px 10px', fontWeight: 600, color: '#6B7280', fontSize: "clamp(10px,1.1vw,11px)" }}>Date</th>
                        <th style={{ textAlign: 'left', padding: '8px 10px', fontWeight: 600, color: '#6B7280', fontSize: "clamp(10px,1.1vw,11px)" }}>Weight</th>
                        <th style={{ textAlign: 'left', padding: '8px 10px', fontWeight: 600, color: '#6B7280', fontSize: "clamp(10px,1.1vw,11px)" }}>Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {progress.map((item: any) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.02)' }}>
                          <td style={{ padding: '8px 10px', fontWeight: 500 }}>{item.created_at?.slice(0, 10)}</td>
                          <td style={{ padding: '8px 10px', fontWeight: 600 }}>{item.weight} kg</td>
                          <td style={{ padding: '8px 10px', color: '#6B7280' }}>{item.note || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                <p style={{ fontSize: "clamp(12px,1.2vw,13px)", fontWeight: 600, color: '#1A1A2E', marginBottom: 10 }}>Add New Entry</p>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  <div>
                    <label style={{ fontSize: "clamp(10px,1.1vw,11px)", fontWeight: 600, color: '#374151', marginBottom: 4, display: 'block' }}>Weight (kg)</label>
                    <input type="number" step="0.1" value={newWeight} onChange={(e) => setNewWeight(e.target.value)}
                      style={{
                        padding: "8px 12px", borderRadius: 10, border: "1.5px solid rgba(0,0,0,0.06)",
                        background: "rgba(255,255,255,0.7)", fontSize: 13, color: '#1A1A2E',
                        outline: "none", width: 100, fontFamily: "var(--font-sans)",
                      }}
                      placeholder="68.5" />
                  </div>
                  <div>
                    <label style={{ fontSize: "clamp(10px,1.1vw,11px)", fontWeight: 600, color: '#374151', marginBottom: 4, display: 'block' }}>Note</label>
                    <input type="text" value={newNote} onChange={(e) => setNewNote(e.target.value)}
                      style={{
                        padding: "8px 12px", borderRadius: 10, border: "1.5px solid rgba(0,0,0,0.06)",
                        background: "rgba(255,255,255,0.7)", fontSize: 13, color: '#1A1A2E',
                        outline: "none", width: 160, fontFamily: "var(--font-sans)",
                      }}
                      placeholder="Optional note" />
                  </div>
                  <button onClick={addProgress} disabled={adding || !newWeight} style={{
                    padding: "8px 18px", borderRadius: 10, border: "none",
                    background: adding || !newWeight ? "rgba(0,0,0,0.04)" : "linear-gradient(135deg, #6366F1, #8B5CF6)",
                    color: adding || !newWeight ? "#D1D5DB" : "white",
                    fontSize: "clamp(12px,1.2vw,13px)", fontWeight: 600, cursor: adding || !newWeight ? "default" : "pointer",
                    display: "flex", alignItems: "center", gap: 6,
                    fontFamily: "var(--font-sans)",
                    boxShadow: !adding && newWeight ? "0 4px 14px rgba(99,102,241,0.25)" : "none",
                  }}>
                    {adding ? "Adding..." : <><Plus size={14} /> Add Entry</>}
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: "clamp(14px,2vw,18px)" }}>
              <div style={{
                background: "rgba(255,255,255,0.75)", backdropFilter: "blur(16px)",
                borderRadius: 16, padding: "clamp(18px,2.5vw,24px)",
                border: "1px solid rgba(255,255,255,0.5)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              }}>
                <h3 style={{
                  fontSize: "clamp(13px,1.4vw,14px)", fontWeight: 700, color: '#1A1A2E', marginBottom: 16,
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ width: 4, height: 14, borderRadius: 2, background: "linear-gradient(180deg, #8B5CF6, #7C3AED)", flexShrink: 0 }} />
                  Body Measurements
                </h3>
                {measurements.length === 0 ? (
                  <p style={{ fontSize: 13, color: '#6B7280' }}>No measurements yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {measurements.slice(0, 5).map((m: any) => (
                      <div key={m.id} style={{
                        display: 'flex', justifyContent: 'space-between',
                        fontSize: "clamp(11px,1.2vw,12px)",
                        padding: '6px 10px', borderRadius: 8,
                        background: 'rgba(0,0,0,0.01)',
                      }}>
                        <span style={{ color: '#6B7280' }}>{m.measured_at?.slice(0, 10)}</span>
                        <span style={{ fontWeight: 600, color: '#1A1A2E' }}>
                          {m.chest_cm && `Chest: ${m.chest_cm} `}
                          {m.waist_cm && `Waist: ${m.waist_cm} `}
                          {m.body_fat_percentage && `BF: ${m.body_fat_percentage}%`}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{
                background: "rgba(255,255,255,0.75)", backdropFilter: "blur(16px)",
                borderRadius: 16, padding: "clamp(18px,2.5vw,24px)",
                border: "1px solid rgba(255,255,255,0.5)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              }}>
                <h3 style={{
                  fontSize: "clamp(13px,1.4vw,14px)", fontWeight: 700, color: '#1A1A2E', marginBottom: 16,
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ width: 4, height: 14, borderRadius: 2, background: "linear-gradient(180deg, #10B981, #059669)", flexShrink: 0 }} />
                  Adherence
                </h3>
                {adherence.length === 0 ? (
                  <p style={{ fontSize: 13, color: '#6B7280' }}>No adherence data yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {adherence.slice(0, 5).map((a: any) => (
                      <div key={a.id} style={{
                        display: 'flex', justifyContent: 'space-between',
                        fontSize: "clamp(11px,1.2vw,12px)",
                        padding: '6px 10px', borderRadius: 8,
                        background: 'rgba(0,0,0,0.01)',
                      }}>
                        <span style={{ color: '#6B7280' }}>{a.log_date}</span>
                        <span style={{ fontWeight: 600, color: '#1A1A2E' }}>
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

      <style>{`
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: clamp(12px,1.5vw,16px); }
        .overview-grid { display: grid; grid-template-columns: 1fr; gap: clamp(14px,2vw,18px); }
        @media (min-width: 768px) { .overview-grid { grid-template-columns: 1.4fr 1fr; } }
        .assess-grid { display: grid; grid-template-columns: 1fr; gap: clamp(12px,1.5vw,16px); }
        @media (min-width: 640px) { .assess-grid { grid-template-columns: 1fr 1fr; } }
        .progress-grid { display: grid; grid-template-columns: 1fr; gap: clamp(14px,2vw,18px); }
        @media (min-width: 768px) { .progress-grid { grid-template-columns: 1.4fr 1fr; } }
        .field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .results-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: clamp(10px,1.5vw,16px); }
        @media (max-width: 500px) { .results-grid { grid-template-columns: 1fr 1fr; } }
      `}</style>
    </div>
  );
}

/* ─── Shared components ─── */

function PillBadge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      padding: "3px 10px", borderRadius: 20, fontSize: "clamp(10px,1.1vw,11px)", fontWeight: 600,
      background: `${color}14`, color,
      display: 'inline-flex', alignItems: 'center', gap: 4,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0 }} />
      {label}
    </span>
  );
}

function ActionBtn({ children, onClick, disabled, bg, color, border, shadow }: any) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: "clamp(10px,1.2vw,12px) 16px", borderRadius: 10, border: border || "none",
      background: bg, color,
      fontSize: "clamp(12px,1.2vw,13px)", fontWeight: 600, cursor: disabled ? "default" : "pointer",
      display: "flex", alignItems: "center", gap: 6, width: "100%",
      fontFamily: "var(--font-sans)",
      opacity: disabled ? 0.5 : 1,
      boxShadow: shadow || "none",
      transition: "all 0.15s",
    }}>
      {children}
    </button>
  );
}

function AssessCard({ children, title, gradient, icon: Icon }: any) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.75)", backdropFilter: "blur(16px)",
      borderRadius: 16, padding: "clamp(16px,2.5vw,24px)",
      border: "1px solid rgba(255,255,255,0.5)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
    }}>
      <h3 style={{
        fontSize: "clamp(13px,1.4vw,14px)", fontWeight: 700, color: '#1A1A2E',
        marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ width: 4, height: 16, borderRadius: 2, background: gradient, flexShrink: 0 }} />
        <Icon size={14} style={{ opacity: 0.6 }} /> {title}
      </h3>
      {children}
    </div>
  );
}
