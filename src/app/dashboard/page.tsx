"use client";

import Link from "next/link";
import {
  Users, Zap, Activity, TrendingUp, UserPlus, Sparkles, BarChart3,
  Download, Calendar, Brain, Target,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";

/* ═══════════════════════════════════════════
   STAT CARD
   ═══════════════════════════════════════════ */

function StatCard({
  label, value, trend, trendUp, icon: Icon, color, chartData, chartColor,
}: {
  label: string; value: string; trend: string; trendUp: boolean;
  icon: any; color: string; chartData?: { v: number }[]; chartColor?: string;
}) {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div className={`stat-icon ${color}`}>
          <Icon size={18} strokeWidth={1.5} />
        </div>
        <span className={`stat-trend ${trendUp ? "up" : "down"}`}>
          {trendUp ? "↑" : "↓"} {trend}
        </span>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {chartData && (
        <div className="stat-chart">
          <ResponsiveContainer width="100%" height={32}>
            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColor || "#2563EB"} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={chartColor || "#2563EB"} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, fontSize: 13, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.06)" }}
                formatter={(v: number) => [v, label]}
              />
              <Area type="monotone" dataKey="v" stroke={chartColor || "#2563EB"} strokeWidth={2} fill={`url(#grad-${label})`} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

const trendData = [
  { v: 12 }, { v: 15 }, { v: 13 }, { v: 18 }, { v: 16 }, { v: 22 }, { v: 19 },
  { v: 24 }, { v: 21 }, { v: 27 }, { v: 25 }, { v: 30 },
];
const revenueData = [
  { v: 4.2 }, { v: 5.1 }, { v: 4.8 }, { v: 6.3 }, { v: 5.9 }, { v: 7.2 },
];

const activities = [
  { text: "Rahul Sharma checked in — 2kg lost this week", meta: "12 min ago", color: "emerald", icon: "↓" },
  { text: "AI plan generated for Priya Patel", meta: "1h ago", color: "blue", icon: "AI" },
  { text: "Ananya missed yesterday's workout", meta: "3h ago", color: "red", icon: "!" },
  { text: "Vikram hit 90% protein target for 5 days", meta: "5h ago", color: "emerald", icon: "★" },
  { text: "New recommendation: Increase water intake for Arjun", meta: "1d ago", color: "orange", icon: "💧" },
];

const recentClients = [
  { name: "Rahul Sharma", goal: "Weight Loss", adherence: "92%", diet: "Veg", nextCheckin: "Tomorrow" },
  { name: "Priya Patel", goal: "Muscle Gain", adherence: "88%", diet: "Non-Veg", nextCheckin: "Today" },
  { name: "Vikram Singh", goal: "Maintenance", adherence: "95%", diet: "Vegan", nextCheckin: "Fri" },
  { name: "Ananya Reddy", goal: "Weight Loss", adherence: "67%", diet: "Veg", nextCheckin: "Overdue" },
  { name: "Arjun Nair", goal: "Muscle Gain", adherence: "78%", diet: "Non-Veg", nextCheckin: "Sat" },
];

/* ═══════════════════════════════════════════
   DASHBOARD
   ═══════════════════════════════════════════ */

export default function DashboardPage() {
  return (
    <div className="page-content">
      {/* HERO */}
      <section className="hero-banner">
        <div className="hero-content">
          <p className="hero-greeting">Good morning, Abhishek</p>
          <h1 className="hero-title">Your AI fitness coaching cockpit</h1>
          <p className="hero-subtitle">
            Your clients are <strong style={{ color: "#10B981" }}>32% more consistent</strong> this week.
            Generate personalised diet plans, track adherence, and grow your coaching business — all powered by AI.
          </p>
          <div className="hero-actions">
            <Link href="/clients/add" className="hero-cta">
              <Sparkles size={18} />
              Generate AI Plan
            </Link>
            <Link href="/clients/add" className="hero-cta-secondary">
              <UserPlus size={18} />
              Add Client
            </Link>
          </div>
          <div className="hero-insights">
            <span className="hero-chip"><Zap size={12} /> <span className="hero-chip-trend">12 active</span> plans this week</span>
            <span className="hero-chip"><TrendingUp size={12} /> <span className="hero-chip-trend">89%</span> avg adherence</span>
            <span className="hero-chip"><Target size={12} /> <span className="hero-chip-trend">5</span> check-ins today</span>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-grid">
        <StatCard label="Active Clients" value="28" trend="+12%" trendUp={true} icon={Users} color="blue" chartData={trendData} />
        <StatCard label="AI Plans" value="142" trend="+24%" trendUp={true} icon={Zap} color="purple" chartData={trendData} />
        <StatCard label="Adherence" value="89%" trend="+5%" trendUp={true} icon={Activity} color="emerald" chartData={trendData} />
        <StatCard label="Revenue" value="₹1.84L" trend="+18%" trendUp={true} icon={TrendingUp} color="orange" chartData={revenueData} chartColor="#F59E0B" />
      </section>

      {/* MAIN GRID */}
      <section className="section-grid">
        {/* Recent Clients */}
        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Recent Clients</h2>
            <Link href="/clients" style={{ color: "var(--blue)", fontSize: 13, fontWeight: 600 }}>View all</Link>
          </div>
          <table className="data-table">
            <thead>
              <tr><th>Client</th><th>Goal</th><th>Adherence</th><th>Diet</th><th>Next Check-in</th></tr>
            </thead>
            <tbody>
              {recentClients.map((c) => (
                <tr key={c.name}>
                  <td style={{ fontWeight: 600, color: "var(--text)" }}>{c.name}</td>
                  <td>{c.goal}</td>
                  <td>
                    <span className={`badge ${parseInt(c.adherence) >= 80 ? "badge-emerald" : parseInt(c.adherence) >= 70 ? "badge-orange" : "badge-red"}`}>
                      {c.adherence}
                    </span>
                  </td>
                  <td>{c.diet}</td>
                  <td>
                    <span className={`badge ${c.nextCheckin === "Overdue" || c.nextCheckin === "Today" ? "badge-orange" : "badge-ghost"}`}>
                      {c.nextCheckin}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Activity + Quick Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          <div className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Recent Activity</h2>
              <button className="btn btn-ghost btn-sm">View all</button>
            </div>
            <div className="panel-body" style={{ padding: "var(--space-3) var(--space-6)" }}>
              <div className="timeline">
                {activities.map((a, i) => (
                  <div key={i} className="timeline-item">
                    <div className={`timeline-dot ${a.color}`}>{a.icon}</div>
                    <div className="timeline-content">
                      <p className="timeline-text">{a.text}</p>
                      <p className="timeline-meta">{a.meta}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Quick Actions</h2>
            </div>
            <div className="panel-body">
              <div className="quick-actions">
                <Link href="/clients/add" className="quick-action">
                  <Sparkles size={24} className="quick-action-icon" />
                  Generate AI Plan
                </Link>
                <Link href="/clients" className="quick-action">
                  <Calendar size={24} className="quick-action-icon" />
                  Schedule Check-in
                </Link>
                <Link href="/analytics" className="quick-action">
                  <BarChart3 size={24} className="quick-action-icon" />
                  View Analytics
                </Link>
                <Link href="/clients" className="quick-action">
                  <Download size={24} className="quick-action-icon" />
                  Export Report
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI INSIGHT */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--blue-subtle), var(--purple-subtle))",
          borderRadius: "var(--radius-md)", padding: "var(--space-4) var(--space-6)",
          display: "flex", alignItems: "center", gap: "var(--space-3)",
          border: "1px solid rgba(37,99,235,0.12)",
        }}
      >
        <Brain size={24} style={{ color: "var(--blue)", flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: "var(--text)" }}>AI Insight</p>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "2px 0 0" }}>
            Rahul Sharma&apos;s protein intake is 23% below target. Consider suggesting a whey isolate or plant-based protein boost.
          </p>
        </div>
        <button className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>View Client</button>
      </div>
    </div>
  );
}
