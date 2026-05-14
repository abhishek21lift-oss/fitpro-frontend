"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Client = {
  id: string;
  full_name: string;
  goal: string;
  diet_type: string;
  weight: string;
  height: string;
  workout_time: string;
};

type ProgressItem = {
  id: string;
  weight: string;
  note: string;
  created_at: string;
};

export default function ClientProfilePage() {
  const params = useParams();
  const [client, setClient] = useState<Client | null>(null);
  const [progress, setProgress] = useState<ProgressItem[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("fitai_token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${params.id}`, {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    }).then((res) => res.json()).then(setClient);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${params.id}/progress`, {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    }).then((res) => res.json()).then((data) => setProgress(Array.isArray(data) ? data : []));
  }, [params.id]);

  if (!client) return <main className="min-h-screen bg-slate-950 p-10 text-white">Loading...</main>;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h1 className="text-4xl font-bold">{client.full_name}</h1>
          <p className="mt-2 text-slate-400">{client.goal} · {client.diet_type} · {client.workout_time}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6"><p className="text-slate-400">Weight</p><p className="mt-2 text-3xl font-semibold">{client.weight} kg</p></div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6"><p className="text-slate-400">Height</p><p className="mt-2 text-3xl font-semibold">{client.height} cm</p></div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6"><p className="text-slate-400">Goal</p><p className="mt-2 text-3xl font-semibold">{client.goal}</p></div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold">Progress history</h2>
          <div className="mt-4 space-y-3">
            {progress.length === 0 ? <p className="text-slate-400">No progress entries yet.</p> : progress.map((item) => (
              <div key={item.id} className="rounded-2xl bg-slate-900 p-4">
                <p className="font-medium">{item.weight} kg</p>
                <p className="mt-1 text-sm text-slate-400">{item.note || 'No note'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
