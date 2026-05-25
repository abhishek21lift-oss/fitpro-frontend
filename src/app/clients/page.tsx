"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('fitai_token');
    if (!token) { setLoading(false); return; }
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`, {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
    }).then(r => r.json()).then(d => setClients(Array.isArray(d) ? d : [])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="stack">
      <section className="hero-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <p className="muted-label">Client management</p>
            <h2 className="section-title">Manage all clients from one premium dashboard</h2>
            <p className="subtle">Search, update, and generate diet plans from a single workflow.</p>
          </div>
          <Link href="/clients/add" className="primary-btn">Add Client</Link>
        </div>
      </section>
      <section className="table-card" style={{ padding: 22 }}>
        {loading ? (
          <p className="subtle">Loading clients...</p>
        ) : clients.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p className="subtle">No clients added yet.</p>
            <Link href="/clients/add" className="primary-btn" style={{ marginTop: 16 }}>Add your first client</Link>
          </div>
        ) : (
          <table className="data-table">
            <thead><tr><th>Name</th><th>Goal</th><th>Diet Type</th><th>Weight</th><th>Workout Time</th></tr></thead>
            <tbody>
              {clients.map((client: any) => (
                <tr key={client.id}>
                  <td><Link href={`/clients/${client.id}`} style={{ color: '#0071e3', fontWeight: 600 }}>{client.full_name}</Link></td>
                  <td>{client.goal || '—'}</td>
                  <td>{client.diet_type || '—'}</td>
                  <td>{client.weight ? `${client.weight} kg` : '—'}</td>
                  <td>{client.workout_time || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
