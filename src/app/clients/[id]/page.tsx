"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type ProgressItem = {
  id: string;
  weight: string;
  note: string;
  created_at: string;
};

export default function ClientProfilePage() {
  const params = useParams();
  const [client, setClient] = useState<any>(null);
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [newWeight, setNewWeight] = useState("");
  const [newNote, setNewNote] = useState("");
  const [adding, setAdding] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("fitai_token");
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${params.id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setClient);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${params.id}/progress`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setProgress(Array.isArray(d) ? d : []));
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/diet-plans/by-client/${params.id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setPlans(Array.isArray(d) ? d : [])).catch(() => {});
  }, [params.id]);

  async function addProgress() {
    if (!newWeight) return;
    setAdding(true);
    const token = localStorage.getItem("fitai_token");
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${params.id}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ weight: parseFloat(newWeight), note: newNote }),
    });
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${params.id}/progress`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setProgress(Array.isArray(data) ? data : []);
    setNewWeight(""); setNewNote(""); setAdding(false);
  }

  if (!client) return <div className="stack"><p className="subtle">Loading...</p></div>;

  return (
    <div className="stack">
      <section className="hero-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div>
            <p className="muted-label">Client profile</p>
            <h2 className="section-title">{client.full_name}</h2>
            <p className="subtle">{client.goal || 'No goal set'} · {client.diet_type || 'No diet'} · {client.workout_time || 'Flexible'}</p>
          </div>
          <Link href="/clients" className="ghost-btn" style={{ fontSize: 13 }}>← Back to clients</Link>
        </div>
      </section>

      <div className="stats-grid">
        <div className="stat-card"><p className="muted-label">Weight</p><div className="kpi">{client.weight || '—'} kg</div></div>
        <div className="stat-card"><p className="muted-label">Height</p><div className="kpi">{client.height || '—'} cm</div></div>
        <div className="stat-card"><p className="muted-label">Goal</p><div className="kpi" style={{ fontSize: 24 }}>{client.goal || '—'}</div></div>
        <div className="stat-card"><p className="muted-label">Age</p><div className="kpi">{client.age || '—'}</div></div>
      </div>

      <div className="panel-grid">
        <div className="table-card">
          <div style={{ padding: "20px" }}>
            <h3 className="section-title" style={{ fontSize: 17 }}>Progress history</h3>
            {progress.length === 0 ? (
              <p className="subtle" style={{ marginTop: 12 }}>No progress entries yet. Add one below.</p>
            ) : (
              <table className="data-table" style={{ marginTop: 12 }}>
                <thead><tr><th>Weight</th><th>Note</th><th>Date</th></tr></thead>
                <tbody>
                  {progress.map((item) => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 600 }}>{item.weight} kg</td>
                      <td>{item.note || '—'}</td>
                      <td>{item.created_at?.slice(0, 10)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div style={{ marginTop: 16, display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6e6e73', marginBottom: 4 }}>Weight (kg)</label>
                <input type="number" step="0.1" value={newWeight} onChange={e => setNewWeight(e.target.value)}
                  className="search-input" style={{ width: 120 }} placeholder="68.5" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6e6e73', marginBottom: 4 }}>Note</label>
                <input type="text" value={newNote} onChange={e => setNewNote(e.target.value)}
                  className="search-input" style={{ width: 200 }} placeholder="Optional note" />
              </div>
              <button onClick={addProgress} disabled={adding || !newWeight}
                className="primary-btn" style={{ marginTop: 0, padding: '8px 16px', fontSize: 13 }}>
                {adding ? 'Adding...' : 'Add Entry'}
              </button>
            </div>
          </div>
        </div>

        <div className="panel">
          <h3 className="section-title" style={{ fontSize: 17, marginBottom: 16 }}>Diet Plans</h3>
          {plans.length === 0 ? (
            <div>
              <p className="subtle">No diet plans generated yet.</p>
              <GenerateButton clientId={client.id} clientName={client.full_name} />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {plans.map((p: any) => (
                <div key={p.id} className="meal-card">
                  <p className="muted-label">Plan</p>
                  <h4 style={{ margin: '6px 0 4px', fontSize: 14, fontWeight: 600 }}>{p.title}</h4>
                  <span className="badge">{p.total_calories} kcal · {p.protein_g}g protein</span>
                </div>
              ))}
              <GenerateButton clientId={client.id} clientName={client.full_name} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GenerateButton({ clientId, clientName }: { clientId: string; clientName: string }) {
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  async function handleGenerate() {
    setGenerating(true);
    const token = localStorage.getItem("fitai_token");
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/diet-plans/generate/${clientId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      setDone(true);
      window.location.reload();
    } catch {}
    setGenerating(false);
  }

  return (
    <button onClick={handleGenerate} disabled={generating || done}
      className="primary-btn" style={{ marginTop: 12, padding: '8px 16px', fontSize: 13, width: '100%' }}>
      {generating ? 'Generating...' : done ? 'Generated ✓' : 'Generate Diet Plan'}
    </button>
  );
}
