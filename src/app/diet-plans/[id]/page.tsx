"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function DietPlanPage() {
  const params = useParams();
  const [plan, setPlan] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("fitai_token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/diet-plans/${params.id}`, {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    }).then((res) => res.json()).then(setPlan);
  }, [params.id]);

  if (!plan) return <div className="stack"><p className="subtle">Loading...</p></div>;

  return (
    <div className="stack">
      <section className="hero-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div>
            <p className="muted-label">Diet plan</p>
            <h2 className="section-title">{plan.title}</h2>
            <p className="subtle">{plan.full_name} · {plan.total_calories} kcal daily</p>
          </div>
          <Link href="/diet-plans" className="ghost-btn" style={{ fontSize: 13 }}>← Back to plans</Link>
        </div>
      </section>

      <section className="stats-grid">
        {[
          ['Total Calories', `${plan.total_calories} kcal`],
          ['Protein', `${plan.protein_g} g`],
          ['Carbs', `${plan.carbs_g} g`],
          ['Fats', `${plan.fats_g} g`],
        ].map(([label, value]) => (
          <div key={label} className="stat-card">
            <p className="muted-label">{label}</p>
            <div className="kpi" style={{ fontSize: 22 }}>{value}</div>
          </div>
        ))}
      </section>

      <section className="table-card" style={{ padding: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 className="section-title" style={{ fontSize: 17 }}>Daily Meals</h3>
          <span className="badge">Water: {plan.water_liters || 3}L</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {plan.meals?.map((meal: any) => (
            <div key={meal.name} className="meal-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
              <div>
                <p className="muted-label" style={{ color: '#0071e3' }}>{meal.time}</p>
                <h4 style={{ margin: '4px 0 6px', fontSize: 16, fontWeight: 600 }}>{meal.name}</h4>
                <p className="subtle">{meal.foods}</p>
              </div>
              <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                <p style={{ fontWeight: 600 }}>{meal.calories} kcal</p>
                <p className="subtle" style={{ fontSize: 12 }}>{meal.protein}g protein</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
