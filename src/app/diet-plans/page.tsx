"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function DietPlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("fitai_token");
    if (!token) { setLoading(false); return; }
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(clients => {
        const withPlans = clients.filter((c: any) => c.id);
        setPlans(withPlans);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="stack">
      <section className="hero-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <p className="muted-label">Diet plans</p>
            <h2 className="section-title">Client Diet Plans</h2>
            <p className="subtle">View and manage AI-generated diet plans for your clients.</p>
          </div>
        </div>
      </section>
      <section className="table-card" style={{ padding: 22 }}>
        {loading ? (
          <p className="subtle">Loading...</p>
        ) : plans.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p className="subtle">No clients added yet.</p>
            <Link href="/clients/add" className="primary-btn" style={{ marginTop: 16 }}>Add your first client</Link>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Goal</th>
                <th>Plan</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((client: any) => (
                <tr key={client.id}>
                  <td><Link href={`/clients/${client.id}`} style={{ color: '#0071e3', fontWeight: 600 }}>{client.full_name}</Link></td>
                  <td>{client.goal || '—'}</td>
                  <td>
                    <GeneratePlanButton clientId={client.id} clientName={client.full_name} />
                  </td>
                  <td>
                    <Link href={`/clients/${client.id}`} className="ghost-btn" style={{ fontSize: 12, padding: '4px 12px' }}>
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

function GeneratePlanButton({ clientId, clientName }: { clientId: string; clientName: string }) {
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
    } catch {}
    setGenerating(false);
  }

  return (
    <button onClick={handleGenerate} disabled={generating || done}
      style={{
        background: done ? '#eaf7ef' : '#0071e3', color: done ? '#1d8348' : 'white',
        border: 'none', borderRadius: 980, padding: '4px 12px', fontSize: 12, fontWeight: 600,
        cursor: generating ? 'not-allowed' : 'pointer', opacity: generating ? 0.6 : 1,
      }}
    >
      {generating ? 'Generating...' : done ? 'Generated ✓' : 'Generate Plan'}
    </button>
  );
}
