"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft, Activity, Heart, Dumbbell, Sun, Salad,
  Scale, Ruler, Brain, Target, Clock, Flame, Zap,
  TrendingUp, AlertCircle,
} from "lucide-react";

const CATEGORY_STYLES: Record<string, { icon: any; color: string }> = {
  personal: { icon: Activity, color: "#2563EB" },
  goal: { icon: Target, color: "#8B5CF6" },
  medical: { icon: Heart, color: "#F43F5E" },
  nutrition: { icon: Salad, color: "#10B981" },
  training: { icon: Dumbbell, color: "#F59E0B" },
  lifestyle: { icon: Sun, color: "#06B6D4" },
};

function Field({ label, value, color }: { label: string; value: any; color?: string }) {
  return (
    <div>
      <p style={{ fontSize: 10, fontWeight: 600, color: color || 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 3px' }}>
        {label}
      </p>
      <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', margin: 0 }}>{value || "—"}</p>
    </div>
  );
}

export default function AssessmentDetailPage() {
  const params = useParams();
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("fitai_token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/assessments/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => {
        if (!r.ok) throw new Error("Assessment not found");
        return r.json();
      })
      .then(setAssessment)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return (
    <div className="page-content">
      <div className="skeleton" style={{ width: '40%', height: 24, marginBottom: 16 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ height: 140 }} />)}
      </div>
    </div>
  );

  if (error) return (
    <div className="page-content">
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <AlertCircle size={40} style={{ opacity: 0.2, marginBottom: 12 }} />
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Not Found</h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>{error}</p>
        <Link href="/clients" className="btn btn-primary">Back to Clients</Link>
      </div>
    </div>
  );

  const c = assessment;
  const clientName = `${c.first_name || ""} ${c.last_name || ""}`.trim() || c.full_name || "Client";

  const sections = [
    {
      key: "personal", title: "Personal Details",
      fields: [
        { label: "Full Name", value: c.full_name },
        { label: "Age", value: c.age },
        { label: "Gender", value: c.gender },
        { label: "Height", value: c.height ? `${c.height} cm` : null },
        { label: "Weight", value: c.weight ? `${c.weight} kg` : null },
        { label: "Body Fat", value: c.body_fat_percentage ? `${c.body_fat_percentage}%` : null },
      ].filter(f => f.value),
    },
    {
      key: "goal", title: "Goals & Activity",
      fields: [
        { label: "Primary Goal", value: c.goal },
        { label: "Secondary Goals", value: c.secondary_goals },
        { label: "Activity Level", value: c.activity_level },
      ].filter(f => f.value),
    },
    {
      key: "medical", title: "Medical History",
      fields: [
        { label: "Conditions", value: c.health_conditions },
        { label: "Medications", value: c.medications },
        { label: "Allergies", value: c.allergies },
        { label: "Injuries", value: c.injuries },
        { label: "Surgeries", value: c.surgeries },
      ].filter(f => f.value),
    },
    {
      key: "nutrition", title: "Nutrition",
      fields: [
        { label: "Diet Type", value: c.diet_type },
        { label: "Meals/Day", value: c.meal_frequency },
        { label: "Food Preferences", value: c.food_likes },
        { label: "Food Dislikes", value: c.food_dislikes },
        { label: "Water Intake", value: c.water_intake_cups ? `${c.water_intake_cups} cups` : null },
      ].filter(f => f.value),
    },
    {
      key: "training", title: "Training",
      fields: [
        { label: "Experience", value: c.experience_level },
        { label: "Workout Days/Week", value: c.workout_days_per_week },
        { label: "Duration", value: c.workout_duration_minutes ? `${c.workout_duration_minutes} min` : null },
        { label: "Equipment", value: c.equipment_available },
        { label: "Mobility Issues", value: c.mobility_issues },
      ].filter(f => f.value),
    },
    {
      key: "lifestyle", title: "Lifestyle",
      fields: [
        { label: "Occupation", value: c.occupation },
        { label: "Sleep", value: c.sleep_hours ? `${c.sleep_hours} hours` : null },
        { label: "Stress Level", value: c.stress_level },
      ].filter(f => f.value),
    },
  ];

  return (
    <div className="page-content" style={{ animation: 'slideUp 0.4s var(--ease) both' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <Link href={`/clients/${c.client_id}`} className="btn btn-ghost btn-sm">
          <ChevronLeft size={14} /> Back to Client
        </Link>
        <Link href={`/assessments/new/${c.client_id}`} className="btn btn-secondary btn-sm">
          Edit Assessment
        </Link>
      </div>

      {/* Header */}
      <div style={{
        background: 'white', borderRadius: 20, padding: 28,
        border: '1px solid rgba(37,99,235,0.08)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        marginBottom: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg, #2563EB, #8B5CF6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
            boxShadow: '0 6px 20px rgba(37,99,235,0.2)',
          }}>
            <Activity size={26} />
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: 0, letterSpacing: '-0.3px' }}>
              {clientName}
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '2px 0 0' }}>
              Initial Assessment &bull; {c.created_at ? new Date(c.created_at).toLocaleDateString() : "Today"}
            </p>
          </div>
          <span style={{
            padding: '4px 14px', borderRadius: 8, fontSize: 11, fontWeight: 700,
            background: c.status === "completed"
              ? 'rgba(16,185,129,0.12)' : c.status === "draft"
              ? 'rgba(245,158,11,0.12)' : 'rgba(99,102,241,0.12)',
            color: c.status === "completed" ? '#059669' : c.status === "draft" ? '#D97706' : '#6366F1',
            textTransform: 'uppercase', letterSpacing: '0.5px',
          }}>
            {c.status || "completed"}
          </span>
        </div>
      </div>

      {/* Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {sections.map((sec, si) => {
          const style = CATEGORY_STYLES[sec.key] || { icon: Activity, color: '#64748B' };
          const Icon = style.icon;
          return (
            <div key={si} style={{
              background: 'white', borderRadius: 20, padding: 24,
              border: `1px solid ${style.color}10`,
              boxShadow: `0 4px 20px ${style.color}06`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 10,
                  background: `linear-gradient(135deg, ${style.color}15, ${style.color}05)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: style.color,
                }}>
                  <Icon size={17} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
                  {sec.title}
                </h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
                {sec.fields.map((f, fi) => (
                  <Field key={fi} label={f.label} value={f.value} color={style.color} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
