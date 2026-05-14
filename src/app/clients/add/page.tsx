"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddClientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName: '', age: '', gender: '', goal: '', dietType: '', weight: '', height: '', workoutTime: '' });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('fitai_token');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ ...form, age: Number(form.age), weight: Number(form.weight), height: Number(form.height) })
    });
    router.push('/clients');
  }

  return (
    <div className="stack">
      <section className="hero-card">
        <p className="muted-label">New onboarding</p>
        <h2 className="section-title">Add a new client</h2>
        <p className="subtle">Capture body stats, goal, diet type, and workout timing for AI plan generation.</p>
      </section>
      <form onSubmit={handleSubmit} className="settings-card">
        <div className="form-grid">
          {Object.entries(form).map(([key, value]) => (
            <input key={key} placeholder={key} value={value} onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))} />
          ))}
        </div>
        <button disabled={loading} className="primary-btn" style={{ marginTop: 18 }}>
          {loading ? 'Saving...' : 'Save Client'}
        </button>
      </form>
    </div>
  )
}
