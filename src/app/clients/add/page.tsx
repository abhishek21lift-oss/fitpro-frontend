"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User, Target, Heart, Salad, Dumbbell, Sun, ArrowRight, ArrowLeft,
  Sparkles, ChevronDown, ChevronUp, Check,
} from "lucide-react";

const GOALS = ["Fat Loss", "Muscle Gain", "Strength Gain", "Recomposition", "Powerlifting"];
const DIET_TYPES = ["Veg", "Non-Veg", "Vegan", "Eggetarian", "Flexitarian"];
const EXP_LEVELS = ["Beginner", "Intermediate", "Advanced"];
const ACTIVITY_LEVELS = ["Sedentary", "Lightly Active", "Moderately Active", "Very Active", "Extremely Active"];
const STRESS_LEVELS = ["Low", "Medium", "High"];
const GENDERS = ["Male", "Female", "Other"];

const SECTIONS = [
  { key: "personal", label: "Personal Details", icon: User, color: "blue" },
  { key: "goals", label: "Goal Assessment", icon: Target, color: "purple" },
  { key: "medical", label: "Medical Assessment", icon: Heart, color: "red" },
  { key: "nutrition", label: "Nutrition Assessment", icon: Salad, color: "emerald" },
  { key: "training", label: "Training Assessment", icon: Dumbbell, color: "orange" },
  { key: "lifestyle", label: "Lifestyle Assessment", icon: Sun, color: "indigo" },
];

export default function AddClientPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: "", age: "", gender: "", height: "", weight: "", bodyFatPercentage: "",
    goal: "", secondaryGoals: [] as string[],
    medicalConditions: "", medications: "", allergies: "", injuries: "", surgeries: "",
    dietType: "", foodLikes: "", foodDislikes: "", budgetPerMeal: "", waterIntakeCups: "", mealFrequency: "",
    experienceLevel: "", workoutDaysPerWeek: "", workoutDurationMinutes: "",
    equipmentAvailable: "", strengthLevels: "", mobilityIssues: "",
    occupation: "", activityLevel: "", sleepHours: "", stressLevel: "",
  });

  function update(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleGoal(g: string) {
    const s = form.secondaryGoals
    if (s.includes(g)) {
      update("secondaryGoals", s.filter((x) => x !== g))
    } else {
      update("secondaryGoals", [...s, g])
    }
  }

  async function handleSave() {
    setSaving(true);
    const token = localStorage.getItem("fitai_token");
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          ...form,
          age: form.age ? Number(form.age) : null,
          height: form.height ? Number(form.height) : null,
          weight: form.weight ? Number(form.weight) : null,
          bodyFatPercentage: form.bodyFatPercentage ? Number(form.bodyFatPercentage) : null,
          budgetPerMeal: form.budgetPerMeal ? Number(form.budgetPerMeal) : null,
          waterIntakeCups: form.waterIntakeCups ? Number(form.waterIntakeCups) : null,
          mealFrequency: form.mealFrequency ? Number(form.mealFrequency) : null,
          workoutDaysPerWeek: form.workoutDaysPerWeek ? Number(form.workoutDaysPerWeek) : null,
          workoutDurationMinutes: form.workoutDurationMinutes ? Number(form.workoutDurationMinutes) : null,
          sleepHours: form.sleepHours ? Number(form.sleepHours) : null,
          secondaryGoals: form.secondaryGoals,
        }),
      });
      router.push("/clients");
    } catch {
      alert("Failed to create client");
    }
    setSaving(false);
  }

  const currentSection = SECTIONS[step];

  return (
    <div className="page-content" style={{ maxWidth: 800, margin: "0 auto" }}>
      {/* Header */}
      <div>
        <p className="text-xs">New client onboarding</p>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", margin: "4px 0 0", lineHeight: 1.15 }}>
          Client Assessment
        </h1>
        <p className="text-muted" style={{ fontSize: 14, marginTop: 4 }}>
          Complete all sections to generate AI-powered fitness plans
        </p>
      </div>

      {/* Progress Steps */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        {SECTIONS.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setStep(i)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 14px", borderRadius: 9999, border: "none",
              fontSize: 12, fontWeight: 600, cursor: "pointer",
              background: i === step ? "var(--blue)" : i < step ? "var(--emerald-subtle)" : "var(--bg-muted)",
              color: i === step ? "white" : i < step ? "var(--emerald)" : "var(--text-muted)",
              transition: "all 0.2s",
            }}
          >
            {i < step ? <Check size={14} /> : <s.icon size={14} />}
            {s.label}
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div className="panel">
        <div className="panel-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <currentSection.icon size={20} style={{ color: `var(--${currentSection.color})` }} />
            <h2 className="panel-title">{currentSection.label}</h2>
          </div>
          <span className="badge badge-ghost" style={{ fontSize: 11 }}>
            Step {step + 1} of {SECTIONS.length}
          </span>
        </div>
        <div className="panel-body">
          {step === 0 && (
            <div className="form-grid">
              <div className="form-group">
                <label className="input-label">Full Name *</label>
                <input className="input-field" placeholder="e.g. Rahul Sharma" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="input-label">Age</label>
                <input className="input-field" type="number" placeholder="28" value={form.age} onChange={(e) => update("age", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="input-label">Gender</label>
                <select className="input-field" value={form.gender} onChange={(e) => update("gender", e.target.value)}>
                  <option value="">Select gender</option>
                  {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="input-label">Height (cm)</label>
                <input className="input-field" type="number" placeholder="175" value={form.height} onChange={(e) => update("height", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="input-label">Weight (kg)</label>
                <input className="input-field" type="number" step="0.1" placeholder="72.5" value={form.weight} onChange={(e) => update("weight", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="input-label">Body Fat %</label>
                <input className="input-field" type="number" step="0.1" placeholder="15" value={form.bodyFatPercentage} onChange={(e) => update("bodyFatPercentage", e.target.value)} />
              </div>
            </div>
          )}

          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div className="form-group">
                <label className="input-label">Primary Goal *</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {GOALS.map((g) => (
                    <button
                      key={g} onClick={() => update("goal", g)}
                      style={{
                        padding: "10px 18px", borderRadius: 12, border: "2px solid",
                        borderColor: form.goal === g ? "var(--blue)" : "var(--border)",
                        background: form.goal === g ? "var(--blue-subtle)" : "var(--bg)",
                        color: form.goal === g ? "var(--blue)" : "var(--text-secondary)",
                        fontWeight: 600, fontSize: 13, cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="input-label">Secondary Goals (optional)</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {GOALS.filter((g) => g !== form.goal).map((g) => (
                    <button
                      key={g} onClick={() => toggleGoal(g)}
                      style={{
                        padding: "6px 14px", borderRadius: 9999, border: "1px solid",
                        borderColor: form.secondaryGoals.includes(g) ? "var(--blue)" : "var(--border)",
                        background: form.secondaryGoals.includes(g) ? "var(--blue-subtle)" : "transparent",
                        color: form.secondaryGoals.includes(g) ? "var(--blue)" : "var(--text-muted)",
                        fontSize: 12, fontWeight: 500, cursor: "pointer",
                      }}
                    >
                      {form.secondaryGoals.includes(g) ? "✓ " : "+ "}{g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-grid">
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="input-label">Medical Conditions</label>
                <textarea className="input-field" rows={2} placeholder="e.g. Diabetes, Thyroid, PCOS, etc." value={form.medicalConditions} onChange={(e) => update("medicalConditions", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="input-label">Medications</label>
                <input className="input-field" placeholder="Current medications" value={form.medications} onChange={(e) => update("medications", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="input-label">Allergies</label>
                <input className="input-field" placeholder="e.g. Peanuts, Dust" value={form.allergies} onChange={(e) => update("allergies", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="input-label">Past Injuries</label>
                <input className="input-field" placeholder="e.g. Knee, Shoulder" value={form.injuries} onChange={(e) => update("injuries", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="input-label">Surgeries</label>
                <input className="input-field" placeholder="Any past surgeries" value={form.surgeries} onChange={(e) => update("surgeries", e.target.value)} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-grid">
              <div className="form-group">
                <label className="input-label">Diet Type *</label>
                <select className="input-field" value={form.dietType} onChange={(e) => update("dietType", e.target.value)}>
                  <option value="">Select diet type</option>
                  {DIET_TYPES.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="input-label">Meal Frequency (per day)</label>
                <select className="input-field" value={form.mealFrequency} onChange={(e) => update("mealFrequency", e.target.value)}>
                  <option value="">Select</option>
                  {[3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} meals</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="input-label">Food Likes</label>
                <input className="input-field" placeholder="Foods they enjoy" value={form.foodLikes} onChange={(e) => update("foodLikes", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="input-label">Food Dislikes</label>
                <input className="input-field" placeholder="Foods to avoid" value={form.foodDislikes} onChange={(e) => update("foodDislikes", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="input-label">Budget per meal (₹)</label>
                <input className="input-field" type="number" placeholder="200" value={form.budgetPerMeal} onChange={(e) => update("budgetPerMeal", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="input-label">Water Intake (cups/day)</label>
                <input className="input-field" type="number" placeholder="8" value={form.waterIntakeCups} onChange={(e) => update("waterIntakeCups", e.target.value)} />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="form-grid">
              <div className="form-group">
                <label className="input-label">Experience Level</label>
                <select className="input-field" value={form.experienceLevel} onChange={(e) => update("experienceLevel", e.target.value)}>
                  <option value="">Select level</option>
                  {EXP_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="input-label">Workout Days / Week</label>
                <select className="input-field" value={form.workoutDaysPerWeek} onChange={(e) => update("workoutDaysPerWeek", e.target.value)}>
                  <option value="">Select</option>
                  {[2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} days</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="input-label">Session Duration (min)</label>
                <select className="input-field" value={form.workoutDurationMinutes} onChange={(e) => update("workoutDurationMinutes", e.target.value)}>
                  <option value="">Select</option>
                  {[30, 45, 60, 75, 90].map((n) => <option key={n} value={n}>{n} min</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="input-label">Equipment Available</label>
                <input className="input-field" placeholder="e.g. Home gym, Full commercial" value={form.equipmentAvailable} onChange={(e) => update("equipmentAvailable", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="input-label">Strength Levels</label>
                <input className="input-field" placeholder="Current lifts (bench/squat/deadlift)" value={form.strengthLevels} onChange={(e) => update("strengthLevels", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="input-label">Mobility Issues</label>
                <input className="input-field" placeholder="e.g. Tight hips, Shoulder impingement" value={form.mobilityIssues} onChange={(e) => update("mobilityIssues", e.target.value)} />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="form-grid">
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="input-label">Occupation</label>
                <input className="input-field" placeholder="e.g. Software Engineer" value={form.occupation} onChange={(e) => update("occupation", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="input-label">Activity Level (daily)</label>
                <select className="input-field" value={form.activityLevel} onChange={(e) => update("activityLevel", e.target.value)}>
                  <option value="">Select level</option>
                  {ACTIVITY_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="input-label">Sleep Hours</label>
                <select className="input-field" value={form.sleepHours} onChange={(e) => update("sleepHours", e.target.value)}>
                  <option value="">Select</option>
                  {[4, 5, 6, 7, 8, 9, 10].map((n) => <option key={n} value={n}>{n} hours</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="input-label">Stress Level</label>
                <select className="input-field" value={form.stressLevel} onChange={(e) => update("stressLevel", e.target.value)}>
                  <option value="">Select level</option>
                  {STRESS_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="panel-footer" style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="btn btn-secondary"
            style={{ visibility: step === 0 ? "hidden" : "visible" }}
          >
            <ArrowLeft size={16} /> Previous
          </button>

          {step < SECTIONS.length - 1 ? (
            <button onClick={() => setStep(step + 1)} className="btn btn-primary">
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <button onClick={handleSave} disabled={saving || !form.fullName} className="btn btn-emerald btn-lg">
              {saving ? (
                "Saving..."
              ) : (
                <><Sparkles size={16} /> Save & Generate AI Plan</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
