"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User, Target, Heart, Salad, Dumbbell, Sun, ArrowRight, ArrowLeft,
  Sparkles, Check, ChevronRight, ChevronLeft,
} from "lucide-react";

const GOALS = ["Fat Loss", "Muscle Gain", "Strength Gain", "Recomposition", "Powerlifting"];
const DIET_TYPES = ["Veg", "Non-Veg", "Vegan", "Eggetarian", "Flexitarian"];
const EXP_LEVELS = ["Beginner", "Intermediate", "Advanced"];
const ACTIVITY_LEVELS = ["Sedentary", "Lightly Active", "Moderately Active", "Very Active", "Extremely Active"];
const STRESS_LEVELS = ["Low", "Medium", "High"];
const GENDERS = ["Male", "Female", "Other"];

const STEPS = [
  { key: "personal", label: "Personal", icon: User },
  { key: "goals", label: "Goals", icon: Target },
  { key: "medical", label: "Medical", icon: Heart },
  { key: "nutrition", label: "Nutrition", icon: Salad },
  { key: "training", label: "Training", icon: Dumbbell },
  { key: "lifestyle", label: "Lifestyle", icon: Sun },
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
    const s = form.secondaryGoals;
    if (s.includes(g)) {
      update("secondaryGoals", s.filter((x) => x !== g));
    } else {
      update("secondaryGoals", [...s, g]);
    }
  }

  async function handleSave() {
    setSaving(true);
    const token = localStorage.getItem("fitai_token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`, {
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
      if (!res.ok) throw new Error("API error");
    } catch {
      const localClients = JSON.parse(localStorage.getItem("fitpro_clients") || "[]");
      const initials = form.fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
      localClients.push({
        id: Date.now(), name: form.fullName, initials, status: "active",
        age: form.age, gender: form.gender, goal: form.goal,
        calories: "", split: "", programWeek: 1,
        assessment: { bmi: "" },
        progress: { weight: [] },
        ...form,
      });
      localStorage.setItem("fitpro_clients", JSON.stringify(localClients));
    }
    router.push("/clients");
    setSaving(false);
  }

  const currentStep = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;
  const canProceed = step === 0 ? form.fullName.trim().length > 0 : step === 1 ? form.goal.length > 0 : true;

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "40px 24px",
      background: "linear-gradient(180deg, #FAFBFF 0%, #F0F2F8 50%, #E8ECF4 100%)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Decorative orbs */}
      <div style={{
        position: "absolute", top: -120, right: -80, width: 500, height: 500,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -100, left: -60, width: 400, height: 400,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: 680, position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: "0 8px 32px rgba(99,102,241,0.25)",
          }}>
            <User size={26} color="white" />
          </div>
          <h1 style={{
            fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em",
            color: "#1A1A2E", margin: "0 0 4px",
          }}>
            New Client Onboarding
          </h1>
          <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>
            Complete the assessment to generate AI-powered fitness plans
          </p>
        </div>

        {/* Step indicator */}
        <div style={{
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: 14,
          padding: "6px 8px",
          marginBottom: 24,
          border: "1px solid rgba(255,255,255,0.5)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {STEPS.map((s, i) => {
              const isActive = i === step;
              const isDone = i < step;
              return (
                <button
                  key={s.key}
                  onClick={() => setStep(i)}
                  style={{
                    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    padding: "8px 6px", borderRadius: 10, border: "none",
                    fontSize: 11, fontWeight: 600, cursor: "pointer",
                    background: isActive ? "linear-gradient(135deg, #6366F1, #8B5CF6)" : "transparent",
                    color: isActive ? "white" : isDone ? "#6366F1" : "#9CA3AF",
                    transition: "all 0.2s",
                    opacity: isActive ? 1 : 0.7,
                  }}
                >
                  {isDone ? <Check size={12} /> : <s.icon size={12} />}
                  <span style={{ fontSize: 11 }}>{s.label}</span>
                </button>
              );
            })}
          </div>
          {/* Progress bar */}
          <div style={{
            height: 3, borderRadius: 2, marginTop: 6,
            background: "rgba(0,0,0,0.04)", overflow: "hidden",
          }}>
            <div style={{
              height: "100%", borderRadius: 2,
              background: "linear-gradient(90deg, #6366F1, #8B5CF6)",
              width: `${progress}%`,
              transition: "width 0.4s ease",
            }} />
          </div>
        </div>

        {/* Form card */}
        <div style={{
          background: "rgba(255,255,255,0.78)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.6)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}>
          {/* Section header */}
          <div style={{
            padding: "24px 28px 0",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 12px rgba(99,102,241,0.2)",
              }}>
                <currentStep.icon size={16} color="white" />
              </div>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: "#1A1A2E", margin: 0 }}>
                  {STEPS[step].label}
                </h2>
                <p style={{ fontSize: 12, color: "#9CA3AF", margin: "1px 0 0" }}>
                  Step {step + 1} of {STEPS.length}
                </p>
              </div>
            </div>
          </div>

          {/* Form body */}
          <div style={{ padding: "20px 28px 0" }}>
            {step === 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
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
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8, display: "block" }}>
                    Primary Goal *
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {GOALS.map((g) => {
                      const sel = form.goal === g;
                      return (
                        <button
                          key={g}
                          onClick={() => update("goal", g)}
                          style={{
                            padding: "12px 16px", borderRadius: 12, border: "1.5px solid",
                            borderColor: sel ? "#6366F1" : "rgba(0,0,0,0.06)",
                            background: sel ? "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.04))" : "rgba(255,255,255,0.5)",
                            color: sel ? "#6366F1" : "#6B7280",
                            fontSize: 13, fontWeight: sel ? 600 : 500, cursor: "pointer",
                            textAlign: "center",
                            transition: "all 0.15s",
                            boxShadow: sel ? "0 2px 8px rgba(99,102,241,0.12)" : "none",
                          }}
                        >
                          {g}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8, display: "block" }}>
                    Secondary Goals
                  </label>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {GOALS.filter((g) => g !== form.goal).map((g) => {
                      const sel = form.secondaryGoals.includes(g);
                      return (
                        <button
                          key={g}
                          onClick={() => toggleGoal(g)}
                          style={{
                            padding: "8px 14px", borderRadius: 20, border: "1px solid",
                            borderColor: sel ? "#6366F1" : "rgba(0,0,0,0.06)",
                            background: sel ? "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.04))" : "rgba(255,255,255,0.5)",
                            color: sel ? "#6366F1" : "#9CA3AF",
                            fontSize: 12, fontWeight: 500, cursor: "pointer",
                            transition: "all 0.15s",
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
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
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
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
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
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
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
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
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
                      return (
                        <button
                          key={l}
                          onClick={() => update("stressLevel", l)}
                          style={{
                            flex: 1, padding: "10px", borderRadius: 10, border: "1.5px solid",
                            borderColor: sel ? "#6366F1" : "rgba(0,0,0,0.06)",
                            background: sel ? "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.04))" : "rgba(255,255,255,0.5)",
                            color: sel ? "#6366F1" : "#6B7280",
                            fontSize: 13, fontWeight: sel ? 600 : 500, cursor: "pointer",
                            textAlign: "center",
                            transition: "all 0.15s",
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
            padding: "20px 28px 24px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            borderTop: "1px solid rgba(0,0,0,0.04)",
            marginTop: 20,
          }}>
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              style={{
                padding: "10px 20px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.06)",
                background: step === 0 ? "transparent" : "rgba(255,255,255,0.8)",
                color: step === 0 ? "#D1D5DB" : "#374151",
                fontSize: 13, fontWeight: 600, cursor: step === 0 ? "default" : "pointer",
                display: "flex", alignItems: "center", gap: 6,
                fontFamily: "var(--font-sans)",
                transition: "all 0.15s",
                opacity: step === 0 ? 0 : 1,
              }}
            >
              <ChevronLeft size={16} /> Back
            </button>

            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed}
                style={{
                  padding: "10px 24px", borderRadius: 12, border: "none",
                  background: canProceed ? "linear-gradient(135deg, #6366F1, #8B5CF6)" : "rgba(0,0,0,0.04)",
                  color: canProceed ? "white" : "#D1D5DB",
                  fontSize: 13, fontWeight: 600, cursor: canProceed ? "pointer" : "default",
                  display: "flex", alignItems: "center", gap: 6,
                  fontFamily: "var(--font-sans)",
                  boxShadow: canProceed ? "0 4px 14px rgba(99,102,241,0.25)" : "none",
                  transition: "all 0.15s",
                }}
              >
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={saving || !form.fullName}
                style={{
                  padding: "10px 28px", borderRadius: 12, border: "none",
                  background: !saving && form.fullName
                    ? "linear-gradient(135deg, #10B981, #059669)"
                    : "rgba(0,0,0,0.04)",
                  color: !saving && form.fullName ? "white" : "#D1D5DB",
                  fontSize: 13, fontWeight: 600, cursor: !saving && form.fullName ? "pointer" : "default",
                  display: "flex", alignItems: "center", gap: 8,
                  fontFamily: "var(--font-sans)",
                  boxShadow: !saving && form.fullName ? "0 4px 14px rgba(16,185,129,0.25)" : "none",
                  transition: "all 0.15s",
                }}
              >
                {saving ? (
                  "Saving..."
                ) : (
                  <><Sparkles size={16} /> Generate AI Plan</>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Footer text */}
        <p style={{
          textAlign: "center", fontSize: 11, color: "#9CA3AF", marginTop: 16,
        }}>
          All data is encrypted and stored securely
        </p>
      </div>
    </div>
  );
}

/* ─── Styled sub-components ─── */

function InputGroup({ label, children, span }: { label: string; children: React.ReactNode; span?: number }) {
  return (
    <div style={{ gridColumn: span ? `span ${span}` : undefined }}>
      <label style={{
        fontSize: 12, fontWeight: 600, color: "#374151",
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
  padding: "10px 14px", borderRadius: 10,
  border: "1px solid rgba(0,0,0,0.06)",
  background: "rgba(255,255,255,0.7)",
  fontSize: 13, color: "#1A1A2E",
  fontFamily: "var(--font-sans)",
  outline: "none",
  transition: "all 0.15s",
};

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{ ...inputBase, ...(props.style || {}) }}
      onFocus={(e) => { e.currentTarget.style.borderColor = "#6366F1"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)"; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)"; e.currentTarget.style.boxShadow = "none"; }}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      style={{ ...inputBase, ...(props.style || {}), cursor: "pointer" }}
      onFocus={(e) => { e.currentTarget.style.borderColor = "#6366F1"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)"; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)"; e.currentTarget.style.boxShadow = "none"; }}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      style={{ ...inputBase, ...(props.style || {}), resize: "vertical", minHeight: 60 }}
      onFocus={(e) => { e.currentTarget.style.borderColor = "#6366F1"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)"; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)"; e.currentTarget.style.boxShadow = "none"; }}
    />
  );
}
