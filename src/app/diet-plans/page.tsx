'use client';

import { useState } from 'react';
import {
  Utensils, Dumbbell, Pill, Activity, Check,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from 'recharts';
import { MOCK_CLIENTS, MOCK_DIET_PLAN, MOCK_WORKOUT_PLAN } from '../../lib/mock-data';

const tabs = [
  { id: 'diet', label: 'Diet Plan', icon: Utensils },
  { id: 'workout', label: 'Workout Plan', icon: Dumbbell },
  { id: 'supplements', label: 'Supplements', icon: Pill },
  { id: 'lifestyle', label: 'Lifestyle', icon: Activity },
];

const supplements = [
  { name: 'Whey Protein Isolate', dose: '1 scoop (30g)', timing: 'Post-workout + morning', brand: 'Optimum Nutrition' },
  { name: 'Creatine Monohydrate', dose: '5g', timing: 'Daily (any time)', brand: 'ON' },
  { name: 'Vitamin D3 + K2', dose: '5000 IU + 100mcg', timing: 'With breakfast', brand: 'NOW Foods' },
  { name: 'Omega-3 Fish Oil', dose: '2g', timing: 'With meals', brand: 'Nordic Naturals' },
  { name: 'Magnesium Glycinate', dose: '400mg', timing: 'Before bed', brand: 'Thorne' },
  { name: 'Multivitamin', dose: '1 tablet', timing: 'With breakfast', brand: 'Garden of Life' },
];

const lifestyle = {
  sleep: '7.5h target', water: '3L/day', steps: '10k/day',
  stressMgmt: 'Morning meditation 10min', mealPrep: 'Sunday meal prep recommended',
};

export default function DietPlansPage() {
  const [tab, setTab] = useState('diet');
  const plan = MOCK_DIET_PLAN;
  const client = MOCK_CLIENTS[0];
  const workout = MOCK_WORKOUT_PLAN;

  const macroData = [
    { name: 'Protein', value: plan.protein, color: '#2563EB' },
    { name: 'Carbs', value: plan.carbs, color: '#F59E0B' },
    { name: 'Fat', value: plan.fat, color: '#EF4444' },
  ];
  const donutData = macroData.map(m => ({
    ...m,
    value: Math.max(1, Math.round((m.value * 4 / plan.calories) * 100)),
  }));
  const remaining = 100 - donutData.reduce((a, b) => a + b.value, 0);
  if (remaining > 0) donutData.push({ name: 'Other', value: remaining, color: '#e5e7eb' });

  return (
    <div className="page-content animate-slide-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
            Plan Review
          </h1>
          <p className="text-sm text-gray-500">
            {client.name} · {client.goal} · Generated today
          </p>
        </div>
        <button className="btn btn-primary">
          <Check size={16} />
          Approve & Export
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-gray-100 mb-6 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`tab-btn flex items-center gap-2 whitespace-nowrap ${tab === t.id ? 'active' : ''}`}
          >
            <t.icon size={15} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Diet Tab */}
      {tab === 'diet' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Donut */}
            <div className="card p-5 flex flex-col items-center">
              <div style={{ width: 160, height: 160 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%" cy="50%" innerRadius={50} outerRadius={70}
                      dataKey="value" startAngle={90} endAngle={-270}
                    >
                      {donutData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => `${v}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">{plan.calories.toLocaleString()}</h3>
              <p className="text-sm text-gray-500">Daily Calories</p>
            </div>

            {/* Macros */}
            <div className="lg:col-span-2 card p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Macronutrient Breakdown</h3>
              <div className="space-y-4">
                {macroData.map((m, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: m.color }} />
                        <span className="font-medium text-gray-700">{m.name}</span>
                      </div>
                      <span className="text-gray-900 font-medium">
                        {m.value}g <span className="text-gray-400 font-normal">({Math.round(m.value * 4 / plan.calories * 100)}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${(m.value * 4 / plan.calories) * 100}%`, background: m.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Meal schedule */}
          <h3 className="text-base font-semibold text-gray-900 mb-4">Weekly Meal Schedule</h3>
          <div className="space-y-4">
            {plan.meals.slice(0, 3).map((day, di) => (
              <div key={di} className="card p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600" />
                  {day.day}
                </h4>
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Meal</th><th>Time</th><th>Items</th><th className="text-right">Cal</th>
                        <th className="text-right">P</th><th className="text-right">C</th><th className="text-right">F</th>
                      </tr>
                    </thead>
                    <tbody>
                      {day.meals.map((meal, mi) => (
                        <tr key={mi}>
                          <td className="font-medium text-gray-900">{meal.name}</td>
                          <td className="text-gray-500">{meal.time}</td>
                          <td className="text-gray-600 max-w-[200px] truncate">{meal.items}</td>
                          <td className="text-right font-medium">{meal.cals}</td>
                          <td className="text-right text-gray-600">{meal.protein}</td>
                          <td className="text-right text-gray-600">{meal.carbs}</td>
                          <td className="text-right text-gray-600">{meal.fat}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Workout Tab */}
      {tab === 'workout' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-base font-semibold text-gray-900">{workout.split}</h3>
            <span className="badge badge-info">4-day split</span>
          </div>
          {workout.days.map((day, di) => (
            <div key={di} className="card p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2 h-2 rounded-full ${day.type.includes('Rest') ? 'bg-gray-300' : 'bg-blue-600'}`} />
                <h4 className="text-sm font-semibold text-gray-900">{day.day}</h4>
                <span className="badge badge-info text-xs">{day.type}</span>
              </div>
              {day.exercises && day.exercises.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {day.exercises.map((ex, ei) => (
                    <div key={ei} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{ex.name}</div>
                        <div className="text-xs text-gray-500">{ex.sets}×{ex.reps} · RPE {ex.rpe} · Rest {ex.rest}</div>
                      </div>
                      <span className="badge badge-info text-xs shrink-0 ml-2">RPE {ex.rpe}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">Recovery day — no training prescribed</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Supplements Tab */}
      {tab === 'supplements' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {supplements.map((s, i) => (
            <div key={i} className="card p-5 hover:border-blue-200/20 transition-all">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <Pill size={16} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">{s.name}</h4>
                  <p className="text-xs text-gray-500 mb-1">{s.dose}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="badge badge-info text-xs">{s.timing}</span>
                    <span className="text-xs text-gray-400">{s.brand}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lifestyle Tab */}
      {tab === 'lifestyle' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(lifestyle).map(([key, val]) => (
            <div key={key} className="card p-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                  <Activity size={16} className="text-green-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 capitalize mb-0.5">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <p className="text-sm text-gray-600">{val}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
