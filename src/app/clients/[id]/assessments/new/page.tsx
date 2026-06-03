"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft, Save, Activity, Heart, Dumbbell, Sun, Salad,
  Scale, Ruler, Brain, AlertCircle,
} from "lucide-react";

const GOALS = ["Fat Loss", "Muscle Gain", "Weight Loss", "General Fitness", "Endurance", "Recomposition"];
const ACTIVITY_LEVELS = ["Sedentary", "Light (1-2x/wk)", "Moderate (3-4x/wk)", "Active (5-6x/wk)", "Very Active (6-7x/wk)"];
const DIET_TYPES = ["Vegetarian", "Vegan", "Eggetarian", "Non-Vegetarian", "Pescatarian", "Keto", "Paleo"];
const STRESS_LEVELS = ["Low", "Moderate", "High", "Very High"];
const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced"];

export default function NewAssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(true);

  const [form, setForm] = useState({
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
  });

  function set<K extends keyof typeof form>(key: K, val: string) {
    setForm(f => ({ ...f, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem("fitai_token");
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assessments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ ...form, client_id: clientId }),
      });
      router.push(`/clients/${clientId}`);
    } catch {
      alert("Failed to save assessment. Try again.");
    }
    setSaving(false);
  }

  const sections = [
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
        { key: "secondary_goals", label: "Secondary Goals", type: "text", col: 1, placeholder: "e.g. Improve endurance, tone up" },
        { key: "activity_level", label: "Activity Level", type: "select", options: ACTIVITY_LEVELS, col: 2 },
      ],
    },
    {
      title: "Medical History", icon: Heart, color: "#F43F5E",
      fields: [
        { key: "health_conditions", label: "Health Conditions", type: "text", col: 1, placeholder: "e.g. PCOS, Hypertension" },
        { key: "medications", label: "Medications", type: "text", col: 1, placeholder: "e.g. Metformin" },
        { key: "allergies", label: "Allergies", type: "text", col: 1, placeholder: "e.g. Nuts, dairy" },
        { key: "injuries", label: "Injuries", type: "text", col: 1, placeholder: "e.g. Lower back, knee" },
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
        { key: "equipment_available", label: "Equipment Available", type: "text", col: 1, placeholder: "e.g. Gym, dumbbells, resistance bands" },
        { key: "mobility_issues", label: "Mobility Issues", type: "text", col: 1, placeholder: "e.g. Shoulder impingement" },
      ],
    },
    {
      title: "Lifestyle", icon: Sun, color: "#06B6D4",
      fields: [
        { key: "occupation", label: "Occupation", type: "text", col: 1, placeholder: "e.g. Software Engineer" },
        { key: "sleep_hours", label: "Sleep (hours)", type: "number", col: 1 },
        { key: "stress_level", label: "Stress Level", type: "select", options: STRESS_LEVELS, col: 1 },
      ],
    },
  ];

  if (!loaded) {
    return (
      <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="skeleton" style={{ width: 200, height: 20 }} />
      </div>
    );
  }

  return (
    <div className="page-content" style={{ animation: 'slideUp 0.4s var(--ease) both' }}>
      <Link href={`/clients/${clientId}`} className="btn btn-ghost btn-sm" style={{ marginBottom: 20 }}>
        <ChevronLeft size={14} /> Back to Client
      </Link>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, marginBottom: 28 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: 'linear-gradient(135deg, #2563EB, #8B5CF6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
              boxShadow: '0 6px 20px rgba(37,99,235,0.2)',
            }}>
              <Activity size={22} />
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: '-0.4px' }}>
                New Assessment
              </h1>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                {form.full_name || `Client #${clientId}`} {clientId ? '✓' : '✗ missing id'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {sections.map((sec, si) => {
          const Icon = sec.icon;
          return (
            <div key={si} style={{
              background: 'white', borderRadius: 20, padding: 24,
              border: `1px solid ${sec.color}10`,
              boxShadow: `0 4px 20px ${sec.color}06`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 10,
                  background: `linear-gradient(135deg, ${sec.color}15, ${sec.color}05)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: sec.color,
                }}>
                  <Icon size={17} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
                  {sec.title}
                </h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px 20px' }}>
                {sec.fields.map((f, fi) => (
                  <div key={fi} style={{ gridColumn: f.col === 2 ? 'span 2' : undefined }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 5 }}>
                      {f.label}
                    </label>
                    {f.type === "select" ? (
                      <select value={(form as any)[f.key] || ""} onChange={e => set(f.key as keyof typeof form, e.target.value)}
                        className="input-field"
                        style={{ width: '100%', padding: '10px 14px', fontSize: 13, borderRadius: 10, fontFamily: 'var(--font-sans)' }}
                      >
                        {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input type={f.type} value={(form as any)[f.key] || ""} onChange={e => set(f.key as keyof typeof form, e.target.value)}
                        className="input-field" placeholder={(f as any).placeholder || ""}
                        style={{ width: '100%', padding: '10px 14px', fontSize: 13, borderRadius: 10, fontFamily: 'var(--font-sans)' }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 8 }}>
          <Link href={`/clients/${clientId}`} className="btn btn-secondary">
            Cancel
          </Link>
          <button type="submit" disabled={saving} className="btn btn-primary" style={{ gap: 6 }}>
            <Save size={15} />
            {saving ? "Saving..." : "Save Assessment"}
          </button>
        </div>
      </form>
    </div>
  );
}
