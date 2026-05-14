"use client";

import { useEffect, useState } from "react";

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  useEffect(() => {
    const token = localStorage.getItem('fitai_token');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`, {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
    }).then(r => r.json()).then(d => setClients(Array.isArray(d) ? d : []));
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
          <a href="/clients/add" className="primary-btn">Add Client</a>
        </div>
      </section>
      <section className="table-card" style={{ padding: 22 }}>
        <table className="data-table">
          <thead><tr><th>Name</th><th>Goal</th><th>Diet Type</th><th>Weight</th><th>Workout Time</th></tr></thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td><a href={`/clients/${client.id}`}>{client.full_name}</a></td>
                <td>{client.goal}</td>
                <td>{client.diet_type}</td>
                <td>{client.weight} kg</td>
                <td>{client.workout_time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
