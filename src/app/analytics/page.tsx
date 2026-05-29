"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Salad, DollarSign, TrendingUp, UserPlus, BarChart3, Brain } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";

const trendData = Array.from({ length: 12 }, (_, i) => ({ v: 5 + Math.floor(Math.random() * 20) }));

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

  if (loading) {
    return (
      <div className="page-content">
        <div className="skeleton" style={{ width: "100%", height: 200, borderRadius: "var(--radius-xl)" }} />
      </div>
    );
  }

  const items = [
    { label: "Total Clients", value: String(stats?.totalClients ?? 0), note: "All registered clients", icon: Users, color: "blue" },
    { label: "Active Plans", value: String(stats?.activePlans ?? 0), note: "Generated diet plans", icon: Salad, color: "emerald" },
    { label: "Revenue", value: `₹${(stats?.revenue || 0).toLocaleString('en-IN')}`, note: "Estimated monthly", icon: DollarSign, color: "purple" },
    { label: "Success Rate", value: stats ? `${stats.successRate || 0}%` : "0%", note: "Clients with plans", icon: TrendingUp, color: "orange" },
  ];

  return (
    <div className="page-content">
      <section className="hero-banner" style={{ paddingBottom: "var(--space-8)" }}>
        <div className="hero-content">
          <p className="hero-greeting">Analytics</p>
          <h1 className="hero-title">Performance overview</h1>
          <p className="hero-subtitle">Real-time metrics for your coaching business.</p>
        </div>
      </section>

      <section className="stats-grid">
        {items.map((item) => (
          <div key={item.label} className="stat-card">
            <div className="stat-card-header">
              <div className={`stat-icon ${item.color}`}><item.icon size={18} strokeWidth={1.5} /></div>
              <span className="stat-trend up">↑ Live</span>
            </div>
            <div className="stat-value">{item.value}</div>
            <div className="stat-label">{item.label}</div>
            <div className="stat-chart">
              <ResponsiveContainer width="100%" height={32}>
                <AreaChart data={trendData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id={`ag-${item.label}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={item.color === "blue" ? "#2563EB" : item.color === "emerald" ? "#10B981" : item.color === "purple" ? "#8B5CF6" : "#F59E0B"} stopOpacity={0.2} />
                      <stop offset="100%" stopColor={item.color === "blue" ? "#2563EB" : item.color === "emerald" ? "#10B981" : item.color === "purple" ? "#8B5CF6" : "#F59E0B"} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 13 }} />
                  <Area type="monotone" dataKey="v" stroke={item.color === "blue" ? "#2563EB" : item.color === "emerald" ? "#10B981" : item.color === "purple" ? "#8B5CF6" : "#F59E0B"} strokeWidth={2} fill={`url(#ag-${item.label})`} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <span style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8, display: "block" }}>{item.note}</span>
          </div>
        ))}
      </section>

      {stats?.totalClients === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon"><BarChart3 size={28} /></div>
          <h2 className="empty-state-title">No data yet</h2>
          <p className="empty-state-text">Add clients and generate plans to see your analytics populate.</p>
          <Link href="/clients/add" className="btn btn-primary">
            <UserPlus size={16} /> Add Client
          </Link>
        </div>
      )}

      {stats?.totalClients > 0 && (
        <section className="section-grid">
          <div className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Quick actions</h2>
            </div>
            <div className="panel-body">
              <div className="quick-actions">
                <Link href="/clients/add" className="quick-action">
                  <UserPlus size={24} className="quick-action-icon" />
                  Add New Client
                </Link>
                <Link href="/diet-plans" className="quick-action">
                  <Salad size={24} className="quick-action-icon" />
                  View Diet Plans
                </Link>
                <Link href="/clients" className="quick-action">
                  <Users size={24} className="quick-action-icon" />
                  All Clients
                </Link>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Insights</h2>
            </div>
            <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="ai-insight" style={{ margin: 0, padding: "var(--space-4)" }}>
                <Brain size={20} style={{ color: "var(--blue)", flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: "var(--text)" }}>Plan Coverage</p>
                  <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "2px 0 0" }}>
                    {stats?.activePlans} of {stats?.totalClients} clients have active diet plans.
                  </p>
                </div>
              </div>
              <div className="ai-insight" style={{ margin: 0, padding: "var(--space-4)" }}>
                <DollarSign size={20} style={{ color: "var(--emerald)", flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: "var(--text)" }}>Average Revenue</p>
                  <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "2px 0 0" }}>
                    ₹{stats?.totalClients ? Math.round((stats?.revenue || 0) / stats.totalClients).toLocaleString('en-IN') : 0} per client
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
