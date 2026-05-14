"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function DietPlanPage() {
  const params = useParams();
  const [plan, setPlan] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("fitai_token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/diet-plans/${params.id}`, {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    }).then((res) => res.json()).then(setPlan);
  }, [params.id]);

  if (!plan) return <main className="min-h-screen bg-slate-950 p-10 text-white">Loading...</main>;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ['Calories', `${plan.total_calories} kcal`],
            ['Protein', `${plan.protein_g} g`],
            ['Carbs', `${plan.carbs_g} g`],
            ['Fats', `${plan.fats_g} g`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-2 text-2xl font-semibold">{value}</p>
            </div>
          ))}
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{plan.title}</h1>
              <p className="mt-2 text-slate-400">{plan.full_name}</p>
            </div>
            <button className="rounded-xl bg-emerald-500 px-5 py-3 font-medium text-slate-950">Export PDF</button>
          </div>
          <div className="mt-6 space-y-4">
            {plan.meals?.map((meal: any) => (
              <div key={meal.name} className="rounded-2xl bg-slate-900 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-emerald-400">{meal.time}</p>
                    <h2 className="mt-1 text-xl font-semibold">{meal.name}</h2>
                  </div>
                  <div className="text-right text-sm text-slate-300">
                    <p>{meal.calories} kcal</p>
                    <p>{meal.protein} g protein</p>
                  </div>
                </div>
                <p className="mt-3 text-slate-300">{meal.foods}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
