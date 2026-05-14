"use client";

import { useEffect, useState } from "react";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("fitai_token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/dashboard`, {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    }).then((res) => res.json()).then(setStats);
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold">Analytics</h1>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats ? [
            ['Total Clients', stats.totalClients],
            ['Active Plans', stats.activePlans],
            ['Revenue', `₹${stats.revenue}`],
            ['Success Rate', `${stats.successRate}%`],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-sm text-slate-400">{label}</h2>
              <p className="mt-3 text-3xl font-semibold">{value}</p>
            </div>
          )) : <p className="text-slate-400">Loading analytics...</p>}
        </div>
      </div>
    </main>
  )
}
