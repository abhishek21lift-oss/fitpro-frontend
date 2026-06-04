"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, Save, Activity, Heart, Dumbbell, Sun, Salad,
  Brain, User, Target, ClipboardList, Check, ArrowRight,
} from "lucide-react";
import { api } from "../../../../../lib/api";

const GOALS = ["Fat Loss", "Muscle Gain", "Weight Loss", "General Fitness", "Endurance", "Recomposition"];
const ACTIVITY_LEVELS = ["Sedentary", "Light (1-2x/wk)", "Moderate (3-4x/wk)", "Active (5-6x/wk)", "Very Active (6-7x/wk)"];
const DIET_TYPES = ["Vegetarian", "Vegan", "Eggetarian", "Non-Vegetarian", "Pescatarian", "Keto", "Paleo"];
const STRESS_LEVELS = ["Low", "Moderate", "High", "Very High"];
const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced"];

const STEPS = [
  { id: "personal", label: "Personal", icon: User, color: "#2563EB" },
  { id: "goals", label: "Goals", icon: Target, color: "#8B5CF6" },
  { id: "medical", label: "Medical", icon: Heart, color: "#F43F5E" },
  { id: "nutrition", label: "Nutrition", icon: Salad, color: "#10B981" },
  { id: "training", label: "Training", icon: Dumbbell, color: "#F59E0B" },
  { id: "lifestyle", label: "Lifestyle", icon: Sun, color: "#06B6D4" },
];

const SECTION_MAP: Record<string, number> = {
  personal: 0, goals: 1, medical: 2, nutrition: 3, training: 4, lifestyle: 5,
};

const SECTIONS: { title: string; icon: any; color: string; fields: any[] }[] = [
  {
    title: "Personal Details", icon: Activity, color: "#2563EB",
    fields: [
      { key: "full_name", label: "Full Name", type: "text", col: 2 },
      { key: "age", label: "Age", type: "number", col: 1 },
      { key: "gender", label: "Gender", type: "select", options: ["M", "F", "Other"], col: 1 },
      { key: "height", label: "Height (cm)", type: "number", col: 1 },
      { key: "weight", label: "Weight (kg)", type: "number", col: 1 },
      { key: "body_fat_percentage", label: "Body Fat %", type: "number", col: 1, placeholder: "Optional" },
    ],
  },
  {
    title: "Goals & Activity", icon: Brain, color: "#8B5CF6",
    fields: [
      { key: "goal", label: "Primary Goal", type: "select", options: GOALS, col: 1 },
      { key: "secondary_goals", label: "Secondary Goals", type: "text", col: 1, placeholder: "Improve endurance, tone up" },
      { key: "activity_level", label: "Activity Level", type: "select", options: ACTIVITY_LEVELS, col: 2 },
    ],
  },
  {
    title: "Medical History", icon: Heart, color: "#F43F5E",
    fields: [
      { key: "health_conditions", label: "Health Conditions", type: "text", col: 1, placeholder: "PCOS, Hypertension..." },
      { key: "medications", label: "Medications", type: "text", col: 1, placeholder: "Metformin..." },
      { key: "allergies", label: "Allergies", type: "text", col: 1, placeholder: "Nuts, dairy..." },
      { key: "injuries", label: "Injuries", type: "text", col: 1, placeholder: "Lower back, knee..." },
      { key: "surgeries", label: "Surgeries", type: "text", col: 1, placeholder: "Optional" },
    ],
  },
  {
    title: "Nutrition", icon: Salad, color: "#10B981",
    fields: [
      { key: "diet_type", label: "Diet Type", type: "select", options: DIET_TYPES, col: 1 },
      { key: "meal_frequency", label: "Meals / Day", type: "number", col: 1 },
      { key: "food_likes", label: "Food Preferences", type: "text", col: 1, placeholder: "What they enjoy" },
      { key: "food_dislikes", label: "Food Dislikes", type: "text", col: 1, placeholder: "What to avoid" },
      { key: "water_intake_cups", label: "Water (cups/day)", type: "number", col: 1 },
    ],
  },
  {
    title: "Training", icon: Dumbbell, color: "#F59E0B",
    fields: [
      { key: "experience_level", label: "Experience", type: "select", options: EXPERIENCE_LEVELS, col: 1 },
      { key: "workout_days_per_week", label: "Workout Days/Week", type: "number", col: 1 },
      { key: "workout_duration_minutes", label: "Duration (min)", type: "number", col: 1 },
      { key: "equipment_available", label: "Equipment Available", type: "text", col: 1, placeholder: "Gym, dumbbells, bands..." },
      { key: "mobility_issues", label: "Mobility Issues", type: "text", col: 1, placeholder: "Shoulder impingement..." },
    ],
  },
  {
    title: "Lifestyle", icon: Sun, color: "#06B6D4",
    fields: [
      { key: "occupation", label: "Occupation", type: "text", col: 1, placeholder: "Software Engineer" },
      { key: "sleep_hours", label: "Sleep (hours)", type: "number", col: 1 },
      { key: "stress_level", label: "Stress Level", type: "select", options: STRESS_LEVELS, col: 1 },
    ],
  },
];

const INITIAL_FORM = {
  full_name: "", age: "", gender: "M",
  height: "", weight: "", body_fat_percentage: "",
  goal: GOALS[0], activity_level: ACTIVITY_LEVELS[2],
  diet_type: DIET_TYPES[0], meal_frequency: "3",
  health_conditions: "", medication: "", allergies: "",
  injuries: "", surgeries: "",
  experience_level: EXPERIENCE_LEVELS[1],
  workout_days_per_week: "4", workout_duration_minutes: "45",
  equipment_available: "",
  sleep_hours: "7", stress_level: STRESS_LEVELS[1],
  occupation: "", water_intake_cups: "8",
  food_likes: "", food_dislikes: "",
  mobility_issues: "", secondary_goals: "",
};

const GRADIENT_BG = `linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)`;

export default function NewAssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);

  const stepColors = STEPS.map(s => s.color);
  const pct = ((step + 1) / STEPS.length) * 100;

  function setVal<K extends keyof typeof form>(key: K, val: string) {
    setForm(f => ({ ...f, [key]: val }));
  }

  function next() { if (step < STEPS.length - 1) setStep(s => s + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function prev() { if (step > 0) setStep(s => s - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.assessments.create({ ...form, client_id: clientId });
      router.push(`/clients/${clientId}`);
    } catch {
      alert("Failed to save assessment. Try again.");
    }
    setSaving(false);
  }

  const sec = SECTIONS[step];
  const Icon = sec.icon;

  return (
    <div style={{ background: GRADIENT_BG, minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        {/* Back */}
        <Link href={`/clients/${clientId}`} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.5)',
          fontSize: 13, fontWeight: 600, textDecoration: 'none', marginBottom: 28,
          transition: 'color 0.2s',
        }} onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
          <ChevronLeft size={14} /> Back to Client
        </Link>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, marginBottom: 36 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 30, fontWeight: 800, color: 'white', margin: 0, letterSpacing: '-0.5px' }}>
              New Assessment
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: '6px 0 0' }}>
              Client #{clientId} &mdash; Step {step + 1} of {STEPS.length}
            </p>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 12,
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.06)',
            fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)',
          }}>
            <ClipboardList size={14} /> {Math.round(pct)}% Complete
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{
          height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)',
          marginBottom: 36, overflow: 'hidden', position: 'relative',
        }}>
          <div style={{
            height: '100%', borderRadius: 2, width: `${pct}%`,
            background: `linear-gradient(90deg, ${stepColors.join(', ')})`,
            transition: 'width 0.5s var(--ease)',
            boxShadow: '0 0 12px rgba(99,102,241,0.4)',
          }} />
        </div>

        {/* Step Tabs */}
        <div style={{
          display: 'flex', gap: 4, marginBottom: 32, overflow: 'auto', paddingBottom: 4,
        }}>
          {STEPS.map((s, i) => {
            const SIcon = s.icon;
            const active = i === step;
            const done = i < step;
            return (
              <button key={s.id} onClick={() => setStep(i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px',
                  borderRadius: 12, border: 'none', cursor: 'pointer', flexShrink: 0,
                  background: active ? s.color + '20' : done ? s.color + '12' : 'rgba(255,255,255,0.04)',
                  borderBottom: active ? `2px solid ${s.color}` : '2px solid transparent',
                  transition: 'all 0.2s',
                }}>
                <SIcon size={15} style={{ color: active ? s.color : done ? s.color : 'rgba(255,255,255,0.3)' }} />
                <span style={{
                  fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
                  color: active ? 'white' : done ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)',
                }}>
                  {done ? <Check size={12} style={{ marginRight: 4 }} /> : null}
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Current Section Card */}
        <div key={step} style={{
          animation: 'fadeIn 0.3s ease-out',
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: 24, padding: 32,
          border: `1px solid ${sec.color}18`,
          boxShadow: `0 8px 40px ${sec.color}08, 0 1px 3px rgba(0,0,0,0.2)`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: `linear-gradient(135deg, ${sec.color}25, ${sec.color}08)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `1px solid ${sec.color}20`,
            }}>
              <Icon size={20} style={{ color: sec.color }} />
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: 'white', margin: 0 }}>
                {sec.title}
              </h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', margin: '3px 0 0' }}>
                Fill in the details below
              </p>
            </div>
          </div>

          <form id="assessment-form" onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '18px 24px' }}>
              {sec.fields.map((f, fi) => (
                <div key={fi} style={{ gridColumn: f.col === 2 ? 'span 2' : undefined }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {f.label}
                  </label>
                  {f.type === "select" ? (
                    <select value={(form as any)[f.key] || ""} onChange={e => setVal(f.key as keyof typeof form, e.target.value)}
                      style={{
                        width: '100%', padding: '12px 16px', fontSize: 14, borderRadius: 12, fontFamily: 'var(--font-sans)',
                        background: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.08)',
                        outline: 'none', transition: 'all 0.2s', cursor: 'pointer',
                        appearance: 'none', WebkitAppearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center',
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = sec.color; e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
                      onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                    >
                      {f.options?.map(o => <option key={o} value={o} style={{ background: '#1E293B', color: 'white' }}>{o}</option>)}
                    </select>
                  ) : (
                    <input type={f.type} value={(form as any)[f.key] || ""} onChange={e => setVal(f.key as keyof typeof form, e.target.value)}
                      placeholder={(f as any).placeholder || ""}
                      style={{
                        width: '100%', padding: '12px 16px', fontSize: 14, borderRadius: 12, fontFamily: 'var(--font-sans)',
                        background: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.08)',
                        outline: 'none', transition: 'all 0.2s',
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = sec.color; e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
                      onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                    />
                  )}
                </div>
              ))}
            </div>
          </form>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, gap: 12 }}>
          <div>
            {step > 0 ? (
              <button onClick={prev} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px',
                borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
                background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)',
                fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-sans)',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'white' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
              >
                <ChevronLeft size={16} /> Previous
              </button>
            ) : <div />}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href={`/clients/${clientId}`} style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '12px 24px',
              borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)',
              background: 'transparent', color: 'rgba(255,255,255,0.4)',
              fontSize: 14, fontWeight: 600, textDecoration: 'none', fontFamily: 'var(--font-sans)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
            >
              Cancel
            </Link>
            {step < STEPS.length - 1 ? (
              <button onClick={next} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px',
                borderRadius: 14, border: 'none', cursor: 'pointer',
                background: `linear-gradient(135deg, ${sec.color}, ${STEPS[step + 1].color})`,
                color: 'white', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-sans)',
                boxShadow: `0 4px 16px ${sec.color}35`,
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${sec.color}45` }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `0 4px 16px ${sec.color}35` }}
              >
                Next Step <ArrowRight size={16} />
              </button>
            ) : (
              <button type="submit" form="assessment-form" disabled={saving} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px',
                borderRadius: 14, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #10B981, #059669)',
                color: 'white', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-sans)',
                boxShadow: '0 4px 16px rgba(16,185,129,0.35)',
                transition: 'all 0.2s', opacity: saving ? 0.6 : 1,
              }}
                onMouseEnter={e => { if (!saving) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(16,185,129,0.45)' } }}
                onMouseLeave={e => { if (!saving) { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(16,185,129,0.35)' } }}
              >
                <Save size={16} /> {saving ? "Saving..." : "Save Assessment"}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
