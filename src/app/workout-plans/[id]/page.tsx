"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft, Dumbbell, Clock, Heart, Zap, Target,
  TrendingUp, Flame, Timer,
} from "lucide-react";

export default function WorkoutPlanPage() {
  const params = useParams();
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("fitai_token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/workout-plans/${params.id}`, {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    }).then((r) => r.json()).then(setPlan).finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return (
    <div className="page-content">
      <div className="skeleton" style={{ width: "50%", height: 24, marginBottom: 16 }} />
      <div className="stats-grid">{[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 80 }} />)}</div>
    </div>
  );

  if (!plan) return <div className="page-content"><p className="text-muted">Workout plan not found</p></div>;

  return (
    <div className="page-content" style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
        <div>
          <Link href={`/clients/${plan.client_id}`} className="btn btn-ghost btn-sm" style={{ marginBottom: 8 }}>
            <ChevronLeft size={14} /> Back to client
          </Link>
          <p className="text-xs">Workout Plan · {plan.status || "draft"}</p>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", margin: "2px 0 4px" }}>{plan.title}</h1>
          <p className="text-muted" style={{ fontSize: 14 }}>
            {plan.split_type} · {plan.days_per_week} days/week · {plan.session_duration_minutes || 45} min sessions
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <span className="badge badge-emerald">{plan.split_type}</span>
          <span className="badge badge-ghost">v{plan.version}</span>
        </div>
      </div>

      {/* Stats */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header"><div className="stat-icon blue"><Dumbbell size={18} /></div></div>
          <div className="stat-value">{plan.split_type}</div>
          <div className="stat-label">Split Type</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header"><div className="stat-icon purple"><Clock size={18} /></div></div>
          <div className="stat-value">{plan.days_per_week}</div>
          <div className="stat-label">Days/Week</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header"><div className="stat-icon orange"><Timer size={18} /></div></div>
          <div className="stat-value">{plan.session_duration_minutes || 45}</div>
          <div className="stat-label">Minutes/Session</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header"><div className="stat-icon emerald"><Target size={18} /></div></div>
          <div className="stat-value">{plan.days?.reduce((s: number, d: any) => s + (d.exercises?.length || 0), 0) || 0}</div>
          <div className="stat-label">Total Exercises</div>
        </div>
      </section>

      {/* Workout Days */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
        {plan.days?.map((day: any, idx: number) => (
          <div key={day.id} className="panel">
            <div className="panel-header" style={{ background: "var(--bg-muted)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: `var(--${["blue","purple","emerald","orange","red","indigo"][idx % 6]}-subtle)`,
                  color: `var(--${["blue","purple","emerald","orange","red","indigo"][idx % 6]})`,
                  display: "grid", placeItems: "center",
                  fontWeight: 700, fontSize: 13,
                }}>{idx + 1}</div>
                <div>
                  <h2 className="panel-title" style={{ fontSize: 14 }}>{day.day_name}</h2>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>{day.focus}</p>
                </div>
              </div>
              <span className="badge badge-ghost" style={{ fontSize: 11 }}>
                {day.exercises?.length || 0} exercises
              </span>
            </div>
            <div className="panel-body" style={{ padding: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: 8 }}>#</th>
                    <th>Exercise</th>
                    <th>Sets</th>
                    <th>Reps</th>
                    <th>Rest</th>
                    <th>RPE</th>
                  </tr>
                </thead>
                <tbody>
                  {day.exercises?.map((ex: any, i: number) => (
                    <tr key={ex.id}>
                      <td style={{ color: "var(--text-muted)", fontSize: 12 }}>{i + 1}</td>
                      <td style={{ fontWeight: 600, color: "var(--text)" }}>{ex.name}</td>
                      <td>{ex.sets}x</td>
                      <td>{ex.reps}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <Timer size={12} style={{ color: "var(--text-muted)" }} />
                          {ex.rest_seconds}s
                        </div>
                      </td>
                      <td>
                        <div style={{
                          display: "inline-flex", alignItems: "center", gap: 4,
                          padding: "2px 8px", borderRadius: 9999,
                          background: ex.rpe >= 8 ? "var(--orange-subtle)" : "var(--emerald-subtle)",
                          color: ex.rpe >= 8 ? "var(--orange)" : "var(--emerald)",
                          fontSize: 12, fontWeight: 600,
                        }}>
                          <Heart size={10} />
                          {ex.rpe}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Cardio Recommendation */}
      {plan.cardio_recommendation && (
        <div className="ai-insight" style={{ flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Heart size={18} style={{ color: "var(--red)" }} />
            <span style={{ fontWeight: 600, fontSize: 14 }}>Cardio Recommendation</span>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0, whiteSpace: "pre-line" }}>
            {plan.cardio_recommendation}
          </p>
        </div>
      )}

      {/* Progression Plan */}
      {plan.progression_plan && (
        <div className="ai-insight" style={{ flexDirection: "column", alignItems: "flex-start", gap: 8, borderColor: "var(--purple)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <TrendingUp size={18} style={{ color: "var(--purple)" }} />
            <span style={{ fontWeight: 600, fontSize: 14 }}>Progression Plan</span>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>{plan.progression_plan}</p>
        </div>
      )}

      {/* Trainer Notes */}
      {plan.trainer_notes && (
        <div className="panel">
          <div className="panel-header"><h2 className="panel-title">Trainer Notes</h2></div>
          <div className="panel-body">
            <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0 }}>{plan.trainer_notes}</p>
          </div>
        </div>
      )}
    </div>
  );
}
