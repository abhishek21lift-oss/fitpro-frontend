"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  User, Target, Heart, Salad, Dumbbell, Sun, Brain, Activity, Scale,
  Ruler, Droplets, Flame, Zap, ChevronRight, Sparkles, Plus, BarChart3,
  ArrowUpRight, Clock, CheckCircle,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";

function Section({ title, icon: Icon, color, children }: { title: string; icon: any; color: string; children: React.ReactNode }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon size={18} style={{ color: `var(--${color})` }} />
          <h2 className="panel-title">{title}</h2>
        </div>
      </div>
      <div className="panel-body">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>{label}</p>
      <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", margin: "4px 0 0" }}>{value || "—"}</p>
    </div>
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

  const loadData = useCallback(async () => {
    const token = localStorage.getItem("fitai_token");
    if (!token) return;
    const id = params.id as string;

    const [c, p, m, a, dp, wp] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${id}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${id}/progress`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${id}/measurements`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${id}/adherence`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/diet-plans/by-client/${id}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).catch(() => []),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/workout-plans/by-client/${id}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).catch(() => []),
    ]);

    setClient(c);
    setProgress(Array.isArray(p) ? p : []);
    setMeasurements(Array.isArray(m) ? m : []);
    setAdherence(Array.isArray(a) ? a : []);
    setDietPlans(Array.isArray(dp) ? dp : []);
    setWorkoutPlans(Array.isArray(wp) ? wp : []);
  }, [params.id]);

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

  if (!client) return (
    <div className="page-content">
      <div className="skeleton" style={{ width: "40%", height: 24, marginBottom: 16 }} />
      <div className="stats-grid">
        {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 100 }} />)}
      </div>
    </div>
  );

  const c = client;
  const initials = (c.full_name || "?").split(" ").map((s: string) => s[0]).join("").slice(0, 2).toUpperCase();

  const progressChart = progress.map((p: any) => ({
    date: p.created_at?.slice(0, 10) || "",
    weight: Number(p.weight),
  }));

  const isCalculated = c.plan_status === "calculated" || c.plan_status === "needs_update";

  return (
    <div className="page-content">
      {/* Client Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: "linear-gradient(135deg, #2563EB, #8B5CF6)",
            display: "grid", placeItems: "center",
            color: "white", fontSize: 20, fontWeight: 700,
            flexShrink: 0,
          }}>{initials}</div>
          <div>
            <p className="text-xs">Client Profile</p>
            <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", margin: "2px 0 4px", lineHeight: 1.15 }}>
              {c.full_name}
            </h1>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {c.goal && <span className="badge badge-blue">{c.goal}</span>}
              {c.diet_type && <span className="badge badge-emerald">{c.diet_type}</span>}
              {c.experience_level && <span className="badge badge-ghost">{c.experience_level}</span>}
              <span className={`badge ${isCalculated ? "badge-emerald" : "badge-orange"}`}>
                {isCalculated ? "AI Ready" : "Assessment Pending"}
              </span>
            </div>
          </div>
        </div>
        <Link href="/clients" className="btn btn-ghost btn-sm">← Back to clients</Link>
      </div>

      {/* Quick Stats */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-icon blue"><Scale size={18} /></div>
          </div>
          <div className="stat-value">{c.weight || "—"}</div>
          <div className="stat-label">Weight (kg)</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-icon purple"><Ruler size={18} /></div>
          </div>
          <div className="stat-value">{c.height || "—"}</div>
          <div className="stat-label">Height (cm)</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-icon orange"><Flame size={18} /></div>
          </div>
          <div className="stat-value">{c.calorie_target || "—"}</div>
          <div className="stat-label">Calorie Target</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-icon emerald"><Zap size={18} /></div>
          </div>
          <div className="stat-value">{c.recovery_score !== null ? `${c.recovery_score}%` : "—"}</div>
          <div className="stat-label">Recovery Score</div>
        </div>
      </section>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--border)", paddingBottom: 2 }}>
        {[
          { key: "overview", label: "Overview", icon: User },
          { key: "assessment", label: "Full Assessment", icon: Activity },
          { key: "diet", label: "Diet Plans", icon: Salad },
          { key: "workout", label: "Workout Plans", icon: Dumbbell },
          { key: "progress", label: "Progress", icon: BarChart3 },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`btn ${activeTab === tab.key ? "btn-primary" : "btn-ghost"} btn-sm`}
            style={{ borderRadius: "var(--radius-sm) 0 0", fontSize: 13 }}
          >
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {activeTab === "overview" && (
        <div className="section-grid">
          {/* AI Engine Status */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
            {!isCalculated && (
              <div className="ai-insight" style={{ flexDirection: "column", alignItems: "flex-start", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Brain size={20} style={{ color: "var(--blue)" }} />
                  <span style={{ fontWeight: 600, fontSize: 14 }}>AI Engine Ready</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>
                  Run the AI engine to calculate BMR, TDEE, calorie/macro targets, recovery score, and workout split recommendation.
                </p>
                <button onClick={runEngine} disabled={calculating} className="btn btn-primary">
                  {calculating ? "Calculating..." : <><Sparkles size={16} /> Run AI Engine</>}
                </button>
              </div>
            )}

            {engineResults && (
              <div className="panel">
                <div className="panel-header">
                  <h2 className="panel-title">AI Engine Results</h2>
                  <span className="badge badge-emerald">Calculated</span>
                </div>
                <div className="panel-body">
                  <div className="form-grid">
                    <Field label="BMR" value={`${engineResults.bmr} kcal`} />
                    <Field label="TDEE" value={`${engineResults.tdee} kcal`} />
                    <Field label="Calorie Target" value={`${engineResults.calorieTarget} kcal`} />
                    <Field label="Protein" value={`${engineResults.proteinTargetG}g`} />
                    <Field label="Carbs" value={`${engineResults.carbsTargetG}g`} />
                    <Field label="Fats" value={`${engineResults.fatTargetG}g`} />
                    <Field label="Recovery Score" value={`${engineResults.recoveryScore}%`} />
                    <Field label="Training Volume" value={`${engineResults.trainingVolumeMinutes} min/week`} />
                    <Field label="Suggested Split" value={engineResults.workoutSplit} />
                  </div>
                </div>
              </div>
            )}

            {/* Progress Chart */}
            {progressChart.length > 1 && (
              <div className="panel">
                <div className="panel-header">
                  <h2 className="panel-title">Weight Trend</h2>
                </div>
                <div style={{ padding: "var(--space-4) var(--space-6)", height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={progressChart}>
                      <defs>
                        <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563EB" stopOpacity={0.2} />
                          <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Tooltip />
                      <Area type="monotone" dataKey="weight" stroke="#2563EB" strokeWidth={2} fill="url(#weightGrad)" dot={{ r: 4 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* Right: Action Panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
            <div className="panel">
              <div className="panel-header"><h2 className="panel-title">Quick Actions</h2></div>
              <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button onClick={generateDiet} disabled={!isCalculated} className="btn btn-primary" style={{ justifyContent: "center", width: "100%" }}>
                  <Salad size={16} /> Generate Diet Plan
                </button>
                <button onClick={generateWorkout} disabled={!isCalculated} className="btn btn-emerald" style={{ justifyContent: "center", width: "100%" }}>
                  <Dumbbell size={16} /> Generate Workout Plan
                </button>
                <button onClick={runEngine} className="btn btn-secondary" style={{ justifyContent: "center", width: "100%" }}>
                  <Brain size={16} /> Re-run AI Engine
                </button>
              </div>
            </div>

            {/* Latest Diet Plan */}
            {dietPlans.length > 0 && (
              <div className="panel">
                <div className="panel-header">
                  <h2 className="panel-title">Latest Diet Plan</h2>
                  <span className="badge badge-blue">v{dietPlans[0].version}</span>
                </div>
                <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <Field label="Calories" value={`${dietPlans[0].total_calories} kcal`} />
                  <Field label="Protein / Carbs / Fats" value={`${dietPlans[0].protein_g}g / ${dietPlans[0].carbs_g}g / ${dietPlans[0].fats_g}g`} />
                  <Field label="Water" value={`${dietPlans[0].water_liters}L`} />
                  <Link href={`/diet-plans/${dietPlans[0].id}`} className="btn btn-ghost btn-sm" style={{ alignSelf: "flex-start" }}>
                    View Full Plan <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            )}

            {/* Latest Workout Plan */}
            {workoutPlans.length > 0 && (
              <div className="panel">
                <div className="panel-header">
                  <h2 className="panel-title">Latest Workout</h2>
                  <span className="badge badge-emerald">v{workoutPlans[0].version}</span>
                </div>
                <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <Field label="Split" value={workoutPlans[0].split_type} />
                  <Field label="Days/Week" value={`${workoutPlans[0].days_per_week} days`} />
                  <Field label="Session" value={`${workoutPlans[0].session_duration_minutes || 45} min`} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Full Assessment */}
      {activeTab === "assessment" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          <div className="section-grid">
            <Section title="Personal Details" icon={User} color="blue">
              <div className="form-grid">
                <Field label="Age" value={c.age} />
                <Field label="Gender" value={c.gender} />
                <Field label="Height" value={`${c.height || "—"} cm`} />
                <Field label="Weight" value={`${c.weight || "—"} kg`} />
                <Field label="Body Fat" value={`${c.body_fat_percentage || "—"}%`} />
              </div>
            </Section>
            <Section title="Goal Assessment" icon={Target} color="purple">
              <Field label="Primary Goal" value={c.goal} />
              <Field label="Secondary Goals" value={c.secondary_goals?.join(", ")} />
            </Section>
          </div>
          <div className="section-grid">
            <Section title="Medical Assessment" icon={Heart} color="red">
              <Field label="Conditions" value={c.medical_conditions} />
              <Field label="Medications" value={c.medications} />
              <Field label="Allergies" value={c.allergies} />
              <Field label="Injuries" value={c.injuries} />
              <Field label="Surgeries" value={c.surgeries} />
            </Section>
            <Section title="Nutrition Assessment" icon={Salad} color="emerald">
              <Field label="Diet Type" value={c.diet_type} />
              <Field label="Meal Frequency" value={`${c.meal_frequency || "—"} meals/day`} />
              <Field label="Food Likes" value={c.food_likes} />
              <Field label="Food Dislikes" value={c.food_dislikes} />
              <Field label="Budget/Meal" value={c.budget_per_meal ? `₹${c.budget_per_meal}` : "—"} />
              <Field label="Water Intake" value={`${c.water_intake_cups || "—"} cups/day`} />
            </Section>
          </div>
          <div className="section-grid">
            <Section title="Training Assessment" icon={Dumbbell} color="orange">
              <Field label="Experience" value={c.experience_level} />
              <Field label="Workout Days" value={`${c.workout_days_per_week || "—"} / week`} />
              <Field label="Duration" value={`${c.workout_duration_minutes || "—"} min`} />
              <Field label="Equipment" value={c.equipment_available} />
              <Field label="Strength Levels" value={c.strength_levels} />
              <Field label="Mobility Issues" value={c.mobility_issues} />
            </Section>
            <Section title="Lifestyle Assessment" icon={Sun} color="indigo">
              <Field label="Occupation" value={c.occupation} />
              <Field label="Activity Level" value={c.activity_level} />
              <Field label="Sleep" value={`${c.sleep_hours || "—"} hours`} />
              <Field label="Stress Level" value={c.stress_level} />
            </Section>
          </div>
        </div>
      )}

      {/* Tab: Diet Plans */}
      {activeTab === "diet" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={generateDiet} disabled={!isCalculated} className="btn btn-primary">
              <Sparkles size={16} /> Generate New Diet Plan
            </button>
          </div>
          {dietPlans.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Salad size={28} /></div>
              <h2 className="empty-state-title">No diet plans yet</h2>
              <p className="empty-state-text">Run the AI engine first, then generate a personalized diet plan.</p>
              <button onClick={generateDiet} disabled={!isCalculated} className="btn btn-primary btn-lg">
                <Sparkles size={16} /> Generate Diet Plan
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {dietPlans.map((plan: any) => (
                <Link key={plan.id} href={`/diet-plans/${plan.id}`} className="panel" style={{ display: "block", textDecoration: "none", cursor: "pointer" }}>
                  <div className="panel-body" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "var(--text)" }}>{plan.title}</h3>
                      <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                        <span className="badge badge-blue">{plan.total_calories} kcal</span>
                        <span className="badge badge-emerald">{plan.protein_g}g protein</span>
                        <span className="badge badge-ghost">v{plan.version}</span>
                        <span className={`badge ${plan.status === "approved" ? "badge-emerald" : "badge-orange"}`}>{plan.status}</span>
                      </div>
                    </div>
                    <ChevronRight size={18} style={{ color: "var(--text-muted)" }} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Workout Plans */}
      {activeTab === "workout" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={generateWorkout} disabled={!isCalculated} className="btn btn-emerald">
              <Sparkles size={16} /> Generate New Workout Plan
            </button>
          </div>
          {workoutPlans.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Dumbbell size={28} /></div>
              <h2 className="empty-state-title">No workout plans yet</h2>
              <p className="empty-state-text">Run the AI engine first, then generate a personalized workout plan.</p>
              <button onClick={generateWorkout} disabled={!isCalculated} className="btn btn-emerald btn-lg">
                <Sparkles size={16} /> Generate Workout Plan
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {workoutPlans.map((plan: any) => (
                <div key={plan.id} className="panel">
                  <div className="panel-body">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{plan.title}</h3>
                        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "4px 0 0" }}>
                          {plan.split_type} · {plan.days_per_week} days/week · {plan.session_duration_minutes || 45} min
                        </p>
                      </div>
                      <span className={`badge ${plan.status === "approved" ? "badge-emerald" : "badge-orange"}`}>{plan.status}</span>
                    </div>
                    {plan.cardio_recommendation && (
                      <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 8 }}>
                        <strong>Cardio:</strong> {plan.cardio_recommendation.slice(0, 100)}...
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Progress */}
      {activeTab === "progress" && (
        <div className="section-grid">
          {/* Weight Progress */}
          <div className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Weight Progress</h2>
            </div>
            <div className="panel-body">
              {progress.length === 0 ? (
                <p className="text-muted" style={{ fontSize: 14 }}>No progress entries yet.</p>
              ) : (
                <table className="data-table">
                  <thead><tr><th>Date</th><th>Weight</th><th>Note</th></tr></thead>
                  <tbody>
                    {progress.map((item: any) => (
                      <tr key={item.id}>
                        <td style={{ fontWeight: 500 }}>{item.created_at?.slice(0, 10)}</td>
                        <td style={{ fontWeight: 600 }}>{item.weight} kg</td>
                        <td className="text-muted">{item.note || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <div style={{ marginTop: 16, display: "flex", gap: 10, alignItems: "flex-end" }}>
                <div className="form-group">
                  <label className="input-label">Weight (kg)</label>
                  <input type="number" step="0.1" value={newWeight} onChange={(e) => setNewWeight(e.target.value)}
                    className="input-field" style={{ width: 120 }} placeholder="68.5" />
                </div>
                <div className="form-group">
                  <label className="input-label">Note</label>
                  <input type="text" value={newNote} onChange={(e) => setNewNote(e.target.value)}
                    className="input-field" style={{ width: 200 }} placeholder="Optional note" />
                </div>
                <button onClick={addProgress} disabled={adding || !newWeight} className="btn btn-primary btn-sm">
                  {adding ? "Adding..." : "Add Entry"}
                </button>
              </div>
            </div>
          </div>

          {/* Measurements & Adherence */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
            <div className="panel">
              <div className="panel-header">
                <h2 className="panel-title">Body Measurements</h2>
              </div>
              <div className="panel-body">
                {measurements.length === 0 ? (
                  <p className="text-muted" style={{ fontSize: 14 }}>No measurements yet.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {measurements.slice(0, 5).map((m: any) => (
                      <div key={m.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", borderBottom: "1px solid var(--border)" }}>
                        <span className="text-muted">{m.measured_at?.slice(0, 10)}</span>
                        <span style={{ fontWeight: 600 }}>
                          {m.chest_cm && `Chest: ${m.chest_cm}cm `}
                          {m.waist_cm && `Waist: ${m.waist_cm}cm `}
                          {m.body_fat_percentage && `BF: ${m.body_fat_percentage}%`}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <h2 className="panel-title">Adherence</h2>
              </div>
              <div className="panel-body">
                {adherence.length === 0 ? (
                  <p className="text-muted" style={{ fontSize: 14 }}>No adherence data yet.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {adherence.slice(0, 5).map((a: any) => (
                      <div key={a.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", borderBottom: "1px solid var(--border)" }}>
                        <span className="text-muted">{a.log_date}</span>
                        <span style={{ fontWeight: 600 }}>
                          Diet: {a.diet_adherence}% · Workout: {a.workout_adherence}% · Water: {a.water_cups}cups
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
