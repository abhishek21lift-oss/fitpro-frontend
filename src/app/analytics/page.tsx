"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("fitai_token");
    if (!token) { setLoading(false); return; }
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.json()).then(setStats).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="stack"><p className="subtle">Loading analytics...</p></div>;

  const items = [
    ['Total Clients', stats?.totalClients ?? 0, 'All registered clients', '👤'],
    ['Active Plans', stats?.activePlans ?? 0, 'Generated diet plans', '🥗'],
    ['Revenue', `₹${(stats?.revenue || 0).toLocaleString('en-IN')}`, 'Estimated monthly', '💰'],
    ['Success Rate', stats ? `${stats.successRate || 0}%` : '0%', 'Clients with plans', '📈'],
  ];

  return (
    <div className="stack">
      <section className="hero-card">
        <p className="muted-label">Analytics</p>
        <h2 className="section-title">Performance overview</h2>
        <p className="subtle">Real-time metrics for your coaching business.</p>
      </section>

      <section className="stats-grid">
        {items.map(([label, value, note, emoji]) => (
          <div key={label} className="stat-card">
            <div style={{ fontSize: 28, marginBottom: 8 }}>{emoji}</div>
            <p className="muted-label">{label}</p>
            <div className="kpi">{value}</div>
            <span className="badge" style={{ marginTop: 10 }}>{note}</span>
          </div>
        ))}
      </section>

      <section className="panel-grid">
        <div className="panel">
          <h3 className="section-title" style={{ fontSize: 17, marginBottom: 12 }}>Quick actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link href="/clients/add" className="primary-btn" style={{ marginTop: 0, textAlign: 'center' }}>Add New Client</Link>
            <Link href="/diet-plans" className="ghost-btn" style={{ textAlign: 'center' }}>View Diet Plans</Link>
          </div>
        </div>
        <div className="panel">
          <h3 className="section-title" style={{ fontSize: 17, marginBottom: 12 }}>Insights</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {stats?.totalClients === 0 ? (
              <p className="subtle">Start by adding clients and generating diet plans. Your analytics will populate automatically.</p>
            ) : (
              <>
                <p className="subtle">{stats?.activePlans} of {stats?.totalClients} clients have active diet plans.</p>
                <p className="subtle">Average revenue per client: ₹{stats?.totalClients ? Math.round((stats?.revenue || 0) / stats.totalClients).toLocaleString('en-IN') : 0}</p>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
