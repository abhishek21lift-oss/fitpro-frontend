"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User, Target, Heart, Salad, Dumbbell, Sun,
  Sparkles, Check, ChevronRight, ChevronLeft, AlertCircle,
} from "lucide-react";
import { api } from "../../../lib/api";

const GOALS = ["Fat Loss", "Muscle Gain", "Strength Gain", "Recomposition", "Powerlifting"];
const DIET_TYPES = ["Veg", "Non-Veg", "Vegan", "Eggetarian", "Flexitarian"];
const EXP_LEVELS = ["Beginner", "Intermediate", "Advanced"];
const ACTIVITY_LEVELS = ["Sedentary", "Lightly Active", "Moderately Active", "Very Active", "Extremely Active"];
const STRESS_LEVELS = ["Low", "Medium", "High"];
const GENDERS = ["Male", "Female", "Other"];

const STEP_THEMES = [
  { icon: User, label: "Personal", gradient: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "#6366F1", bg: "rgba(99,102,241,0.08)", emoji: "👤" },
  { icon: Target, label: "Goals", gradient: "linear-gradient(135deg, #F59E0B, #EF4444)", color: "#F59E0B", bg: "rgba(245,158,11,0.08)", emoji: "🎯" },
  { icon: Heart, label: "Medical", gradient: "linear-gradient(135deg, #EC4899, #F43F5E)", color: "#EC4899", bg: "rgba(236,72,153,0.08)", emoji: "🏥" },
  { icon: Salad, label: "Nutrition", gradient: "linear-gradient(135deg, #10B981, #059669)", color: "#10B981", bg: "rgba(16,185,129,0.08)", emoji: "🥗" },
  { icon: Dumbbell, label: "Training", gradient: "linear-gradient(135deg, #F97316, #EF4444)", color: "#F97316", bg: "rgba(249,115,22,0.08)", emoji: "💪" },
  { icon: Sun, label: "Lifestyle", gradient: "linear-gradient(135deg, #06B6D4, #6366F1)", color: "#06B6D4", bg: "rgba(6,182,212,0.08)", emoji: "🌅" },
];

export default function AddClientPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
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
    const s = form.secondaryGoals;
    if (s.includes(g)) {
      update("secondaryGoals", s.filter((x) => x !== g));
    } else {
      update("secondaryGoals", [...s, g]);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const created = await api.clients.create({
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
      });
      if (created?.id) {
        router.push(`/clients/${created.id}`);
      } else {
        router.push("/clients");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to save client. Make sure the backend server is running.");
    }
    setSaving(false);
  }

  const t = STEP_THEMES[step];
  const progress = ((step + 1) / STEP_THEMES.length) * 100;
  const canProceed = step === 0 ? form.fullName.trim().length > 0 : step === 1 ? form.goal.length > 0 : true;

  const orbStyles = (i: number) => {
    const c = STEP_THEMES[step].color;
    return {
      position: "absolute" as const,
      width: [400, 350, 300][i],
      height: [400, 350, 300][i],
      borderRadius: "50%",
      background: `radial-gradient(circle, ${c}14, transparent 70%)`,
      pointerEvents: "none" as const,
    };
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "clamp(16px, 4vw, 40px)",
      background: "linear-gradient(180deg, #F8FAFF 0%, #F0F2FE 50%, #E8ECF4 100%)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Decorative orbs */}
      <div style={{ ...orbStyles(0), top: -100, right: -80, opacity: 0.7 }} />
      <div style={{ ...orbStyles(1), bottom: -80, left: -60, opacity: 0.5 }} />
      <div style={{ ...orbStyles(2), top: "40%", left: "50%", transform: "translate(-50%,-50%)", opacity: 0.3 }} />

      <div style={{
        width: "100%",
        maxWidth: 720,
        position: "relative",
        zIndex: 1,
      }}>
        {/* ─── Header ─── */}
        <div style={{ marginBottom: "clamp(20px, 3vw, 32px)", textAlign: "center" }}>
          <div style={{
            width: "clamp(48px, 6vw, 60px)",
            height: "clamp(48px, 6vw, 60px)",
            borderRadius: "clamp(14px, 2vw, 18px)",
            background: t.gradient,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto clamp(12px, 1.5vw, 16px)",
            boxShadow: `0 8px 32px ${t.color}30`,
          }}>
            <t.icon size={26} color="white" />
          </div>
          <h1 style={{
            fontSize: "clamp(22px, 3.5vw, 30px)",
            fontWeight: 700, letterSpacing: "-0.02em",
            color: "#1A1A2E", margin: "0 0 4px",
          }}>
            New Client Onboarding
          </h1>
          <p style={{ fontSize: "clamp(13px, 1.5vw, 14px)", color: "#6B7280", margin: 0 }}>
            Complete the assessment to generate AI-powered fitness plans
          </p>
        </div>

        {/* ─── Step stepper ─── */}
        <div style={{
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: 16,
          padding: "clamp(4px, 1vw, 8px)",
          marginBottom: "clamp(16px, 2vw, 24px)",
          border: "1px solid rgba(255,255,255,0.6)",
          boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            overflowX: "auto",
            scrollbarWidth: "none",
          }}>
            {STEP_THEMES.map((s, i) => {
              const isActive = i === step;
              const isDone = i < step;
              return (
                <button
                  key={s.label}
                  onClick={() => setStep(i)}
                  style={{
                    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    padding: "clamp(6px, 1vw, 10px) clamp(4px, 0.8vw, 8px)",
                    borderRadius: 12, border: "none",
                    fontSize: "clamp(10px, 1.2vw, 12px)",
                    fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
                    background: isActive ? s.gradient : "transparent",
                    color: isActive ? "white" : isDone ? s.color : "#9CA3AF",
                    transition: "all 0.25s",
                    opacity: isActive || isDone ? 1 : 0.6,
                    minWidth: 0,
                  }}
                >
                  <span style={{ display: "inline" }}>
                    {isDone ? <Check size={12} /> : <s.icon size={12} />}
                  </span>
                  <span style={{ fontSize: "clamp(9px, 1.2vw, 11px)" }}>
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>
          <div style={{
            height: 4, borderRadius: 2, marginTop: 6,
            background: "rgba(0,0,0,0.04)", overflow: "hidden",
          }}>
            <div style={{
              height: "100%", borderRadius: 2,
              background: t.gradient,
              width: `${progress}%`,
              transition: "width 0.4s ease",
            }} />
          </div>
        </div>

        {/* ─── Form card ─── */}
        <div style={{
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: "clamp(16px, 2.5vw, 24px)",
          border: "1px solid rgba(255,255,255,0.7)",
          boxShadow: "0 8px 48px rgba(0,0,0,0.06)",
          overflow: "hidden",
          transition: "all 0.3s",
        }}>
          {/* Section header */}
          <div style={{
            padding: "clamp(16px, 2.5vw, 28px) clamp(16px, 2.5vw, 28px) 0",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 8,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 12,
                background: t.gradient,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 4px 12px ${t.color}25`,
              }}>
                <t.icon size={18} color="white" />
              </div>
              <div>
                <h2 style={{
                  fontSize: "clamp(14px, 1.8vw, 17px)",
                  fontWeight: 600,
                  color: "#1A1A2E",
                  margin: 0,
                }}>
                  {STEP_THEMES[step].label}
                </h2>
                <p style={{ fontSize: "clamp(11px, 1.2vw, 12px)", color: "#9CA3AF", margin: "1px 0 0" }}>
                  Step {step + 1} of {STEP_THEMES.length}
                </p>
              </div>
            </div>
            <span style={{
              fontSize: "clamp(20px, 3vw, 28px)",
              lineHeight: 1,
            }}>
              {t.emoji}
            </span>
          </div>

          {/* Form body */}
          <div style={{
            padding: "clamp(16px, 2.5vw, 24px) clamp(16px, 2.5vw, 28px) 0",
          }}>
            {step === 0 && (
              <div className="form-grid-2">
                <InputGroup label="Full Name *" span={2}>
                  <Input
                    placeholder="e.g. Rahul Sharma"
                    value={form.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                  />
                </InputGroup>
                <InputGroup label="Age">
                  <Input placeholder="28" type="number" value={form.age} onChange={(e) => update("age", e.target.value)} />
                </InputGroup>
                <InputGroup label="Gender">
                  <Select value={form.gender} onChange={(e) => update("gender", e.target.value)}>
                    <option value="">Select</option>
                    {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                  </Select>
                </InputGroup>
                <InputGroup label="Height (cm)">
                  <Input placeholder="175" type="number" value={form.height} onChange={(e) => update("height", e.target.value)} />
                </InputGroup>
                <InputGroup label="Weight (kg)">
                  <Input placeholder="72.5" type="number" step="0.1" value={form.weight} onChange={(e) => update("weight", e.target.value)} />
                </InputGroup>
                <InputGroup label="Body Fat %">
                  <Input placeholder="15" type="number" step="0.1" value={form.bodyFatPercentage} onChange={(e) => update("bodyFatPercentage", e.target.value)} />
                </InputGroup>
              </div>
            )}

            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "clamp(16px, 2vw, 24px)" }}>
                <div>
                  <label style={{
                    fontSize: "clamp(12px, 1.3vw, 13px)", fontWeight: 600, color: "#374151",
                    marginBottom: 8, display: "block",
                  }}>
                    Primary Goal *
                  </label>
                  <div className="form-grid-2">
                    {GOALS.map((g) => {
                      const sel = form.goal === g;
                      const gc = g === "Fat Loss" ? "#F43F5E" : g === "Muscle Gain" ? "#8B5CF6" : g === "Strength Gain" ? "#F97316" : g === "Recomposition" ? "#10B981" : "#06B6D4";
                      return (
                        <button
                          key={g}
                          onClick={() => update("goal", g)}
                          style={{
                            padding: "clamp(10px, 1.5vw, 14px) clamp(12px, 1.5vw, 16px)",
                            borderRadius: 14, border: "2px solid",
                            borderColor: sel ? gc : "rgba(0,0,0,0.06)",
                            background: sel ? `${gc}12` : "rgba(255,255,255,0.5)",
                            color: sel ? gc : "#6B7280",
                            fontSize: "clamp(12px, 1.3vw, 14px)",
                            fontWeight: sel ? 700 : 500, cursor: "pointer",
                            textAlign: "center",
                            transition: "all 0.15s",
                            boxShadow: sel ? `0 4px 16px ${gc}20` : "none",
                            fontFamily: "var(--font-sans)",
                          }}
                        >
                          {g}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label style={{
                    fontSize: "clamp(12px, 1.3vw, 13px)", fontWeight: 600, color: "#374151",
                    marginBottom: 8, display: "block",
                  }}>
                    Secondary Goals
                  </label>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {GOALS.filter((g) => g !== form.goal).map((g) => {
                      const sel = form.secondaryGoals.includes(g);
                      const gc = g === "Fat Loss" ? "#F43F5E" : g === "Muscle Gain" ? "#8B5CF6" : g === "Strength Gain" ? "#F97316" : g === "Recomposition" ? "#10B981" : "#06B6D4";
                      return (
                        <button
                          key={g}
                          onClick={() => toggleGoal(g)}
                          style={{
                            padding: "clamp(6px, 1vw, 8px) clamp(12px, 1.5vw, 16px)",
                            borderRadius: 20, border: "1.5px solid",
                            borderColor: sel ? gc : "rgba(0,0,0,0.06)",
                            background: sel ? `${gc}12` : "rgba(255,255,255,0.5)",
                            color: sel ? gc : "#9CA3AF",
                            fontSize: "clamp(11px, 1.2vw, 12px)",
                            fontWeight: sel ? 600 : 500, cursor: "pointer",
                            transition: "all 0.15s",
                            fontFamily: "var(--font-sans)",
                          }}
                        >
                          {sel ? "✓ " : "+ "}{g}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="form-grid-2">
                <InputGroup label="Medical Conditions" span={2}>
                  <Textarea
                    placeholder="e.g. Diabetes, Thyroid, PCOS"
                    value={form.medicalConditions}
                    onChange={(e) => update("medicalConditions", e.target.value)}
                  />
                </InputGroup>
                <InputGroup label="Medications">
                  <Input placeholder="Current medications" value={form.medications} onChange={(e) => update("medications", e.target.value)} />
                </InputGroup>
                <InputGroup label="Allergies">
                  <Input placeholder="e.g. Peanuts, Dust" value={form.allergies} onChange={(e) => update("allergies", e.target.value)} />
                </InputGroup>
                <InputGroup label="Past Injuries">
                  <Input placeholder="e.g. Knee, Shoulder" value={form.injuries} onChange={(e) => update("injuries", e.target.value)} />
                </InputGroup>
                <InputGroup label="Surgeries">
                  <Input placeholder="Any past surgeries" value={form.surgeries} onChange={(e) => update("surgeries", e.target.value)} />
                </InputGroup>
              </div>
            )}

            {step === 3 && (
              <div className="form-grid-2">
                <InputGroup label="Diet Type *">
                  <Select value={form.dietType} onChange={(e) => update("dietType", e.target.value)}>
                    <option value="">Select</option>
                    {DIET_TYPES.map((d) => <option key={d} value={d}>{d}</option>)}
                  </Select>
                </InputGroup>
                <InputGroup label="Meal Frequency">
                  <Select value={form.mealFrequency} onChange={(e) => update("mealFrequency", e.target.value)}>
                    <option value="">Select</option>
                    {[3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} meals</option>)}
                  </Select>
                </InputGroup>
                <InputGroup label="Food Likes">
                  <Input placeholder="Foods they enjoy" value={form.foodLikes} onChange={(e) => update("foodLikes", e.target.value)} />
                </InputGroup>
                <InputGroup label="Food Dislikes">
                  <Input placeholder="Foods to avoid" value={form.foodDislikes} onChange={(e) => update("foodDislikes", e.target.value)} />
                </InputGroup>
                <InputGroup label="Budget per meal (₹)">
                  <Input placeholder="200" type="number" value={form.budgetPerMeal} onChange={(e) => update("budgetPerMeal", e.target.value)} />
                </InputGroup>
                <InputGroup label="Water intake (cups/day)">
                  <Input placeholder="8" type="number" value={form.waterIntakeCups} onChange={(e) => update("waterIntakeCups", e.target.value)} />
                </InputGroup>
              </div>
            )}

            {step === 4 && (
              <div className="form-grid-2">
                <InputGroup label="Experience Level">
                  <Select value={form.experienceLevel} onChange={(e) => update("experienceLevel", e.target.value)}>
                    <option value="">Select</option>
                    {EXP_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </Select>
                </InputGroup>
                <InputGroup label="Workout Days / Week">
                  <Select value={form.workoutDaysPerWeek} onChange={(e) => update("workoutDaysPerWeek", e.target.value)}>
                    <option value="">Select</option>
                    {[2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} days</option>)}
                  </Select>
                </InputGroup>
                <InputGroup label="Session Duration">
                  <Select value={form.workoutDurationMinutes} onChange={(e) => update("workoutDurationMinutes", e.target.value)}>
                    <option value="">Select</option>
                    {[30, 45, 60, 75, 90].map((n) => <option key={n} value={n}>{n} min</option>)}
                  </Select>
                </InputGroup>
                <InputGroup label="Equipment">
                  <Input placeholder="e.g. Home gym, Full commercial" value={form.equipmentAvailable} onChange={(e) => update("equipmentAvailable", e.target.value)} />
                </InputGroup>
                <InputGroup label="Strength Levels">
                  <Input placeholder="Bench / Squat / Deadlift" value={form.strengthLevels} onChange={(e) => update("strengthLevels", e.target.value)} />
                </InputGroup>
                <InputGroup label="Mobility Issues">
                  <Input placeholder="e.g. Tight hips" value={form.mobilityIssues} onChange={(e) => update("mobilityIssues", e.target.value)} />
                </InputGroup>
              </div>
            )}

            {step === 5 && (
              <div className="form-grid-2">
                <InputGroup label="Occupation" span={2}>
                  <Input placeholder="e.g. Software Engineer" value={form.occupation} onChange={(e) => update("occupation", e.target.value)} />
                </InputGroup>
                <InputGroup label="Daily Activity Level">
                  <Select value={form.activityLevel} onChange={(e) => update("activityLevel", e.target.value)}>
                    <option value="">Select</option>
                    {ACTIVITY_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </Select>
                </InputGroup>
                <InputGroup label="Sleep Hours">
                  <Select value={form.sleepHours} onChange={(e) => update("sleepHours", e.target.value)}>
                    <option value="">Select</option>
                    {[4, 5, 6, 7, 8, 9, 10].map((n) => <option key={n} value={n}>{n} hours</option>)}
                  </Select>
                </InputGroup>
                <InputGroup label="Stress Level" span={2}>
                  <div style={{ display: "flex", gap: 8 }}>
                    {STRESS_LEVELS.map((l) => {
                      const sel = form.stressLevel === l;
                      const sc = l === "Low" ? "#10B981" : l === "Medium" ? "#F59E0B" : "#F43F5E";
                      return (
                        <button
                          key={l}
                          onClick={() => update("stressLevel", l)}
                          style={{
                            flex: 1, padding: "clamp(8px, 1.2vw, 12px)", borderRadius: 12, border: "2px solid",
                            borderColor: sel ? sc : "rgba(0,0,0,0.06)",
                            background: sel ? `${sc}12` : "rgba(255,255,255,0.5)",
                            color: sel ? sc : "#6B7280",
                            fontSize: "clamp(12px, 1.3vw, 14px)",
                            fontWeight: sel ? 700 : 500, cursor: "pointer",
                            textAlign: "center", fontFamily: "var(--font-sans)",
                            transition: "all 0.15s",
                            boxShadow: sel ? `0 2px 10px ${sc}20` : "none",
                          }}
                        >
                          {l}
                        </button>
                      );
                    })}
                  </div>
                </InputGroup>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding: "clamp(16px, 2.5vw, 24px) clamp(16px, 2.5vw, 28px)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            borderTop: "1px solid rgba(0,0,0,0.04)",
            marginTop: "clamp(16px, 2vw, 24px)",
            gap: 12,
          }}>
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              style={{
                padding: "clamp(10px, 1.2vw, 12px) clamp(16px, 2vw, 22px)",
                borderRadius: 12, border: "1px solid rgba(0,0,0,0.06)",
                background: step === 0 ? "transparent" : "rgba(255,255,255,0.8)",
                color: step === 0 ? "#D1D5DB" : "#374151",
                fontSize: "clamp(12px, 1.3vw, 14px)",
                fontWeight: 600, cursor: step === 0 ? "default" : "pointer",
                display: "flex", alignItems: "center", gap: 6,
                fontFamily: "var(--font-sans)",
                transition: "all 0.15s",
                opacity: step === 0 ? 0 : 1,
              }}
            >
              <ChevronLeft size={16} /> Back
            </button>

            {step < STEP_THEMES.length - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed}
                style={{
                  padding: "clamp(10px, 1.2vw, 12px) clamp(20px, 2.5vw, 28px)",
                  borderRadius: 12, border: "none",
                  background: canProceed ? t.gradient : "rgba(0,0,0,0.04)",
                  color: canProceed ? "white" : "#D1D5DB",
                  fontSize: "clamp(12px, 1.3vw, 14px)",
                  fontWeight: 600, cursor: canProceed ? "pointer" : "default",
                  display: "flex", alignItems: "center", gap: 6,
                  fontFamily: "var(--font-sans)",
                  boxShadow: canProceed ? `0 4px 16px ${t.color}30` : "none",
                  transition: "all 0.15s",
                }}
              >
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <>
                {error && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "10px 16px", borderRadius: 10,
                    background: "rgba(239,68,68,0.08)", color: "#DC2626",
                    fontSize: 13, fontWeight: 500, marginBottom: 12,
                  }}>
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}
                <button
                  onClick={handleSave}
                  disabled={saving || !form.fullName}
                style={{
                  padding: "clamp(10px, 1.2vw, 12px) clamp(20px, 2.5vw, 28px)",
                  borderRadius: 12, border: "none",
                  background: !saving && form.fullName
                    ? "linear-gradient(135deg, #10B981, #059669)"
                    : "rgba(0,0,0,0.04)",
                  color: !saving && form.fullName ? "white" : "#D1D5DB",
                  fontSize: "clamp(12px, 1.3vw, 14px)",
                  fontWeight: 600,
                  cursor: !saving && form.fullName ? "pointer" : "default",
                  display: "flex", alignItems: "center", gap: 8,
                  fontFamily: "var(--font-sans)",
                  boxShadow: !saving && form.fullName ? "0 4px 16px rgba(16,185,129,0.3)" : "none",
                  transition: "all 0.15s",
                }}
              >
                {saving ? (
                  "Saving..."
                ) : (
                  <><Check size={16} /> Save Client</>
                )}
              </button>
              </>
            )}
          </div>
        </div>

        <p style={{
          textAlign: "center", fontSize: "clamp(10px, 1vw, 11px)",
          color: "#9CA3AF", marginTop: 16,
        }}>
          All data is encrypted and stored securely
        </p>
      </div>

      <style>{`
        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(12px, 1.5vw, 16px);
        }
        @media (min-width: 500px) {
          .form-grid-2 {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
}

/* ─── Styled sub-components ─── */

function InputGroup({ label, children, span }: { label: string; children: React.ReactNode; span?: number }) {
  return (
    <div style={{ gridColumn: span ? `span ${span}` : undefined }}>
      <label style={{
        fontSize: "clamp(11px, 1.2vw, 12px)", fontWeight: 600, color: "#374151",
        marginBottom: 5, display: "block",
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputBase: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  padding: "clamp(10px, 1.2vw, 12px) clamp(12px, 1.5vw, 14px)",
  borderRadius: 12,
  border: "1.5px solid rgba(0,0,0,0.06)",
  background: "rgba(255,255,255,0.75)",
  fontSize: "clamp(13px, 1.4vw, 14px)", color: "#1A1A2E",
  fontFamily: "var(--font-sans)",
  outline: "none",
  transition: "all 0.15s",
};

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{ ...inputBase, ...(props.style || {}) }}
      onFocus={(e) => { e.currentTarget.style.borderColor = "#6366F1"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)"; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)"; e.currentTarget.style.boxShadow = "none"; }}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      style={{ ...inputBase, ...(props.style || {}), cursor: "pointer" }}
      onFocus={(e) => { e.currentTarget.style.borderColor = "#6366F1"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)"; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)"; e.currentTarget.style.boxShadow = "none"; }}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      style={{ ...inputBase, ...(props.style || {}), resize: "vertical", minHeight: "clamp(60px, 8vw, 80px)" }}
      onFocus={(e) => { e.currentTarget.style.borderColor = "#6366F1"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)"; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)"; e.currentTarget.style.boxShadow = "none"; }}
    />
  );
}
