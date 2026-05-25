"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("fitai_token");
    if (!token) { setLoading(false); return; }

    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).catch(() => []),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/dashboard`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).catch(() => null),
    ]).then(([c, a]) => {
      setClients(Array.isArray(c) ? c : []);
      setAnalytics(a);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="stack"><p className="subtle">Loading dashboard...</p></div>;

  const stats = [
    ["Total Clients", analytics?.totalClients ?? clients.length, `${clients.length > 0 ? '+1 this week' : 'No data'}`],
    ["Active Plans", analytics?.activePlans ?? 0, `${(analytics?.activePlans || 0) > 0 ? 'Active' : 'Generate your first plan'}`],
    ["Monthly Revenue", analytics ? `₹${(analytics.revenue || 0).toLocaleString('en-IN')}` : '₹0', "Estimated"],
    ["Success Rate", analytics ? `${analytics.successRate || 0}%` : '—', analytics?.totalClients ? `${analytics.activePlans}/${analytics.totalClients} have plans` : 'Add clients to start'],
  ];

  return (
    <div className="stack">
      <section className="hero-card hero-grid">
        <div>
          <p className="muted-label" style={{ marginBottom: 8 }}>Premium trainer dashboard</p>
          <h2 className="section-title">AI-powered nutrition coaching, simplified</h2>
          <p className="subtle" style={{ marginTop: 8, maxWidth: 520 }}>
            Generate personalised diet plans, manage all clients, and track outcomes from one clean workspace.
          </p>
        </div>
        <div className="panel">
          <p className="muted-label">Quick actions</p>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            <Link href="/clients/add" className="primary-btn" style={{ marginTop: 0, textAlign: "center" }}>Add new client</Link>
            <Link href="/clients" className="ghost-btn" style={{ textAlign: "center" }}>View all clients</Link>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        {stats.map(([label, value, note]) => (
          <div key={label} className="stat-card">
            <p className="muted-label">{label}</p>
            <div className="kpi">{value}</div>
            <span className="badge" style={{ marginTop: 10 }}>{note}</span>
          </div>
        ))}
      </section>

      <section className="panel-grid">
        <div className="table-card">
          <div style={{ padding: "20px 20px 0", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="section-title" style={{ fontSize: 17 }}>Clients</h3>
            <Link href="/clients" style={{ color: '#0071e3', fontSize: 13, fontWeight: 600 }}>View all</Link>
          </div>
          {clients.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <p className="subtle">No clients yet.</p>
              <Link href="/clients/add" className="primary-btn">Add your first client</Link>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr><th>Name</th><th>Goal</th><th>Diet</th><th>Weight</th></tr>
              </thead>
              <tbody>
                {clients.slice(0, 5).map((c: any) => (
                  <tr key={c.id}>
                    <td><Link href={`/clients/${c.id}`} style={{ color: '#0071e3', fontWeight: 600 }}>{c.full_name}</Link></td>
                    <td>{c.goal || '—'}</td>
                    <td>{c.diet_type || '—'}</td>
                    <td>{c.weight ? `${c.weight} kg` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="panel">
          <h3 className="section-title" style={{ fontSize: 17, marginBottom: 16 }}>Quick actions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link href="/diet-plans" className="primary-btn" style={{ marginTop: 0, textAlign: "center" }}>View Diet Plans</Link>
            <Link href="/analytics" className="ghost-btn" style={{ textAlign: "center" }}>View Analytics</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
