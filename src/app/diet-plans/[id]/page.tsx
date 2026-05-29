"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Clock, Droplets, Sun, Coffee, Apple, Flame,
  ChevronLeft, Sparkles, Pill,
} from "lucide-react";

const MEAL_ICONS: Record<string, any> = {
  'Breakfast': Sun,
  'Mid-Morning Snack': Coffee,
  'Lunch': Apple,
  'Evening Snack': Coffee,
  'Dinner': Flame,
  'Post-Workout': Sparkles,
};

export default function DietPlanPage() {
  const params = useParams();
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("fitai_token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/diet-plans/${params.id}`, {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    })
      .then((res) => res.json())
      .then(setPlan)
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return (
    <div className="page-content">
      <div className="skeleton" style={{ width: "50%", height: 24, marginBottom: 16 }} />
      <div className="stats-grid">{[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 80 }} />)}</div>
    </div>
  );

  if (!plan) return <div className="page-content"><p className="text-muted">Plan not found</p></div>;

  const macroRatio = plan.total_calories > 0 ? [
    { name: "Protein", value: (plan.protein_g * 4 / plan.total_calories) * 100, color: "#2563EB" },
    { name: "Carbs", value: (plan.carbs_g * 4 / plan.total_calories) * 100, color: "#10B981" },
    { name: "Fats", value: (plan.fats_g * 9 / plan.total_calories) * 100, color: "#F59E0B" },
  ] : [];

  return (
    <div className="page-content" style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
        <div>
          <Link href={`/clients/${plan.client_id}`} className="btn btn-ghost btn-sm" style={{ marginBottom: 8 }}>
            <ChevronLeft size={14} /> Back to client
          </Link>
          <p className="text-xs">Diet Plan · {plan.status || "draft"}</p>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", margin: "2px 0 4px" }}>{plan.title}</h1>
          <p className="text-muted" style={{ fontSize: 14 }}>
            For {plan.full_name} · Version {plan.version}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <span className="badge badge-blue">{plan.total_calories} kcal/day</span>
          <span className="badge badge-ghost">v{plan.version}</span>
        </div>
      </div>

      {/* Macro Summary */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-icon blue"><Flame size={18} /></div>
          </div>
          <div className="stat-value">{plan.total_calories}</div>
          <div className="stat-label">Total Calories (kcal)</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-icon blue"><span style={{ fontWeight: 700, fontSize: 13 }}>P</span></div>
          </div>
          <div className="stat-value">{plan.protein_g}g</div>
          <div className="stat-label">Protein</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-icon emerald"><span style={{ fontWeight: 700, fontSize: 13 }}>C</span></div>
          </div>
          <div className="stat-value">{plan.carbs_g}g</div>
          <div className="stat-label">Carbs</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-icon orange"><span style={{ fontWeight: 700, fontSize: 13 }}>F</span></div>
          </div>
          <div className="stat-value">{plan.fats_g}g</div>
          <div className="stat-label">Fats</div>
        </div>
      </section>

      {/* Macro Ratio Bar */}
      <div className="panel">
        <div className="panel-body">
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: "flex", height: 24, borderRadius: 12, overflow: "hidden" }}>
                {macroRatio.map((m) => (
                  <div key={m.name} style={{ width: `${m.value}%`, background: m.color, transition: "width 0.5s" }} title={`${m.name}: ${Math.round(m.value)}%`} />
                ))}
              </div>
            </div>
            {macroRatio.map((m) => (
              <div key={m.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: m.color }} />
                <span style={{ fontWeight: 500 }}>{m.name} {Math.round(m.value)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Meals */}
      <div className="panel">
        <div className="panel-header">
          <h2 className="panel-title">Daily Meal Plan</h2>
          <div style={{ display: "flex", gap: 4, alignItems: "center", fontSize: 13, color: "var(--text-muted)" }}>
            <Droplets size={14} />
            Water: {plan.water_liters || 3}L
          </div>
        </div>
        <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {plan.meals?.length > 0 ? (
            plan.meals.map((meal: any) => {
              const Icon = MEAL_ICONS[meal.name] || Apple;
              return (
                <div key={meal.id || meal.name} className="panel" style={{ border: "1px solid var(--border)", background: "var(--bg)" }}>
                  <div style={{ padding: 16, display: "flex", gap: 16 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: "var(--blue-subtle)", color: "var(--blue)",
                      display: "grid", placeItems: "center", flexShrink: 0,
                    }}>
                      <Icon size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, flexWrap: "wrap" }}>
                        <div>
                          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{meal.name}</h3>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2, fontSize: 12, color: "var(--text-muted)" }}>
                            <Clock size={12} /> {meal.time_of_day}
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ fontWeight: 700, fontSize: 16, margin: 0 }}>{meal.calories} kcal</p>
                          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
                            P: {meal.protein_g}g · C: {meal.carbs_g}g · F: {meal.fats_g}g
                          </p>
                        </div>
                      </div>
                      <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "8px 0 0" }}>{meal.foods}</p>
                      {meal.quantities && (
                        <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "4px 0 0" }}>{meal.quantities}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-state">
              <p className="text-muted">No meals configured for this plan.</p>
            </div>
          )}
        </div>
      </div>

      {/* Supplements */}
      {plan.supplement_notes && (
        <div className="ai-insight">
          <Pill size={20} style={{ color: "var(--purple)", flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: "var(--text)" }}>Supplement Recommendations</p>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "4px 0 0" }}>{plan.supplement_notes}</p>
          </div>
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
