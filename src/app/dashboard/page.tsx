"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Users, Zap, Activity, TrendingUp, UserPlus, Sparkles, BarChart3,
  Calendar, Brain, Target, Bot, ArrowUpRight, ChevronRight,
  Flame, Salad, Dumbbell, Clock, CheckCircle, AlertCircle,
  X, Loader2,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";

const colorClasses = ["#2563EB", "#8B5CF6", "#10B981", "#F59E0B", "#EC4899", "#EF4444"];

function AIPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    { role: "bot", text: "Hi! I'm your FitAI assistant. Ask me about your clients, plans, or insights." },
  ]);
  const [input, setInput] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  function handleSend() {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((m) => [...m, { role: "user", text: userMsg }]);
    setInput("");
    setTimeout(() => {
      const replies: Record<string, string> = {
        adherence: "Overall adherence is 84%. Rahul Sharma leads at 92%, Priya at 88%.",
        client: "You have active clients. 2 are due for check-in today.",
        default: "Noted your request. Would you like me to generate a detailed report?",
      };
      const key = Object.keys(replies).find((k) => userMsg.includes(k)) || "default";
      setMessages((m) => [...m, { role: "bot", text: replies[key] }]);
    }, 800);
  }

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [messages]);

  return (
    <div className="ai-panel">
      <div className="ai-panel-header">
        <div className="ai-panel-title">
          <Bot size={16} style={{ color: "var(--blue)" }} />
          FitAI Assistant
        </div>
        <button onClick={onClose} className="icon-btn" style={{ width: 28, height: 28 }}>
          <X size={14} />
        </button>
      </div>
      <div className="ai-panel-body" ref={ref}>
        {messages.map((m, i) => (
          <div key={i} className={`ai-message ${m.role}`}>{m.text}</div>
        ))}
      </div>
      <div className="ai-panel-input">
        <input
          type="text" placeholder="Ask FitAI anything…"
          value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} className="btn btn-primary btn-sm" style={{ padding: "6px 14px" }}>Send</button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [aiOpen, setAiOpen] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("fitai_token");
    if (!token) { setLoading(false); return; }
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => r.json()).then(setStats).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const trendData = [
    { v: 8 }, { v: 12 }, { v: 10 }, { v: 15 }, { v: 13 }, { v: 18 },
    { v: 16 }, { v: 21 }, { v: 19 }, { v: 24 }, { v: 22 }, { v: 28 },
  ];

  const StatCard = ({
    label, value, trend, trendUp, icon: Icon, color, chartColor, subtitle, href,
  }: {
    label: string; value: string; trend: string; trendUp: boolean;
    icon: any; color: string; chartColor?: string; subtitle?: string; href?: string;
  }) => {
    const card = (
      <div className="stat-card" style={{ cursor: href ? "pointer" : "default" }}>
        <div className="stat-card-header">
          <div className={`stat-icon ${color}`}>
            <Icon size={18} strokeWidth={1.5} />
          </div>
          <span className={`stat-trend ${trendUp ? "up" : "down"}`}>
            {trendUp ? "↑" : "↓"} {trend}
          </span>
        </div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{subtitle || label}</div>
        <div className="stat-chart">
          <ResponsiveContainer width="100%" height={32}>
            <AreaChart data={trendData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColor || "#2563EB"} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={chartColor || "#2563EB"} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 13, boxShadow: "var(--shadow-lg)" }}
                formatter={(v: number) => [v, label]}
              />
              <Area type="monotone" dataKey="v" stroke={chartColor || "#2563EB"} strokeWidth={2} fill={`url(#grad-${label})`} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
    return href ? <Link href={href}>{card}</Link> : card;
  };

  if (loading) {
    return (
      <div className="page-content">
        <div className="skeleton" style={{ width: "100%", height: 280, borderRadius: "var(--radius-xl)" }} />
        <div className="stats-grid">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 140 }} />)}
        </div>
      </div>
    );
  }

  const clients = stats?.recentClients || [];
  const activity = stats?.recentActivity || [];

  return (
    <div className="page-content">
      {/* ═══ HERO ═══ */}
      <section className="hero-banner">
        <div className="hero-content">
          <p className="hero-greeting">
            {new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening"}, Trainer
          </p>
          <h1 className="hero-title">Your coaching command center</h1>
          <p className="hero-subtitle">
            {stats?.totalClients > 0
              ? `${stats.totalClients} clients · ${stats.activePlans} active plans · ${stats.successRate}% success rate`
              : "Add your first client to get started with AI-powered fitness plans."}
          </p>
          <div className="hero-actions">
            <Link href="/clients/add" className="hero-cta">
              <UserPlus size={18} />
              Add Client
            </Link>
            <Link href="/clients" className="hero-cta-secondary">
              <Users size={18} />
              View Clients
            </Link>
            <button onClick={() => setAiOpen(true)} className="hero-cta-secondary">
              <Bot size={18} />
              Ask FitAI
            </button>
          </div>
          <div className="hero-insights">
            {[
              { icon: Zap, label: "active plans", value: stats?.activePlans || 0 },
              { icon: Dumbbell, label: "workout plans", value: stats?.workoutPlans || 0 },
              { icon: TrendingUp, label: "success rate", value: `${stats?.successRate || 0}%` },
              { icon: Users, label: "total clients", value: stats?.totalClients || 0 },
            ].filter((item) => item.value !== 0 || stats === null).map((item) => (
              <span key={item.label} className="hero-chip">
                <item.icon size={12} />
                <span className="hero-chip-trend">{item.value}</span> {item.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ METRICS ═══ */}
      <section className="stats-grid">
        <StatCard
          label="Total Clients" value={String(stats?.totalClients || 0)}
          trend={stats?.totalClients > 0 ? "+12%" : "0%"} trendUp={true}
          icon={Users} color="blue" subtitle="Registered clients"
          href="/clients"
        />
        <StatCard
          label="Active Plans" value={String(stats?.activePlans || 0)}
          trend={stats?.activePlans > 0 ? "+24%" : "0%"} trendUp={true}
          icon={Salad} color="purple" subtitle="Diet plans generated"
          href="/diet-plans"
        />
        <StatCard
          label="Workout Plans" value={String(stats?.workoutPlans || 0)}
          trend={stats?.workoutPlans > 0 ? "+18%" : "0%"} trendUp={true}
          icon={Dumbbell} color="emerald" subtitle="Workout plans"
        />
        <StatCard
          label="Success Rate" value={`${stats?.successRate || 0}%`}
          trend={stats?.successRate >= 50 ? "+5%" : "0%"} trendUp={stats?.successRate >= 50}
          icon={Activity} color="orange" chartColor="#F59E0B" subtitle="Clients with plans"
        />
      </section>

      {/* ═══ EMPTY STATE ═══ */}
      {stats?.totalClients === 0 && (
        <div className="empty-state" style={{ padding: "var(--space-16) var(--space-6)" }}>
          <div className="empty-state-icon"><Users size={28} /></div>
          <h2 className="empty-state-title">Welcome to FitAI Coach</h2>
          <p className="empty-state-text">
            Get started by adding your first client. FitAI will generate personalized diet and workout plans powered by our AI engine.
          </p>
          <Link href="/clients/add" className="btn btn-primary btn-lg">
            <UserPlus size={16} />
            Add Your First Client
          </Link>
        </div>
      )}

      {/* ═══ MAIN GRID ═══ */}
      {stats?.totalClients > 0 && (
        <section className="section-grid">
          {/* LEFT — Recent Clients */}
          <div className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Recent clients</h2>
              <Link href="/clients" className="btn btn-ghost btn-sm">
                View all <ChevronRight size={14} />
              </Link>
            </div>
            {clients.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Goal</th>
                    <th>Diet</th>
                    <th>AI Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {clients.slice(0, 6).map((c: any, i: number) => (
                    <tr key={c.id} onClick={() => window.location.href = `/clients/${c.id}`}>
                      <td style={{ fontWeight: 600, color: "var(--text)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: 8,
                            background: colorClasses[i % colorClasses.length],
                            color: "white", fontSize: 11, fontWeight: 700,
                            display: "grid", placeItems: "center",
                          }}>
                            {(c.full_name || "?").split(" ").map((s: string) => s[0]).join("").slice(0, 2).toUpperCase()}
                          </div>
                          {c.full_name}
                        </div>
                      </td>
                      <td><span className="text-sm">{c.goal || "—"}</span></td>
                      <td><span className="badge badge-ghost" style={{ fontSize: 11 }}>{c.diet_type || "—"}</span></td>
                      <td>
                        <span className={`badge ${c.plan_status === "calculated" ? "badge-emerald" : "badge-orange"}`} style={{ fontSize: 11 }}>
                          {c.plan_status === "calculated" ? "AI Ready" : c.plan_status === "needs_update" ? "Update" : "Pending"}
                        </span>
                      </td>
                      <td><ArrowUpRight size={14} style={{ color: "var(--text-muted)" }} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="panel-body">
                <p className="text-muted" style={{ fontSize: 14 }}>No clients yet. Add one to get started.</p>
              </div>
            )}
            <div className="panel-footer">
              <Link href="/clients/add" className="btn btn-primary btn-sm">
                <UserPlus size={14} /> Add Client
              </Link>
            </div>
          </div>

          {/* RIGHT — Activity + Quick Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
            {/* Activity */}
            <div className="panel">
              <div className="panel-header">
                <h2 className="panel-title">Activity</h2>
                {activity.length > 0 && <span className="badge badge-blue" style={{ fontSize: 11 }}>Live</span>}
              </div>
              <div className="panel-body" style={{ padding: "var(--space-2) var(--space-6)" }}>
                {activity.length > 0 ? (
                  <div className="timeline">
                    {activity.slice(0, 6).map((a: any, i: number) => {
                      const iconMap: Record<string, any> = {
                        progress: { icon: CheckCircle, color: "emerald" },
                        diet_plan: { icon: Salad, color: "blue" },
                        workout_plan: { icon: Dumbbell, color: "purple" },
                      };
                      const meta = iconMap[a.type] || { icon: Activity, color: "blue" };
                      return (
                        <div key={i} className="timeline-item">
                          <div className={`timeline-dot ${meta.color}`}>
                            <meta.icon size={12} />
                          </div>
                          <div className="timeline-content">
                            <p className="timeline-text">{a.text}</p>
                            <p className="timeline-meta">{new Date(a.ts).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ padding: "var(--space-4) 0", textAlign: "center" }}>
                    <p className="text-muted" style={{ fontSize: 13, margin: 0 }}>No recent activity. Generate a plan to see activity here.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="panel">
              <div className="panel-header">
                <h2 className="panel-title">Quick actions</h2>
              </div>
              <div className="panel-body">
                <div className="quick-actions">
                  <Link href="/clients/add" className="quick-action">
                    <UserPlus size={24} className="quick-action-icon" />
                    Add Client
                  </Link>
                  <button onClick={() => setAiOpen(true)} className="quick-action">
                    <Bot size={24} className="quick-action-icon" />
                    Ask FitAI
                  </button>
                  <Link href="/clients" className="quick-action">
                    <Calendar size={24} className="quick-action-icon" />
                    Clients
                  </Link>
                  <Link href="/analytics" className="quick-action">
                    <BarChart3 size={24} className="quick-action-icon" />
                    Analytics
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ AI INSIGHT ═══ */}
      {stats?.totalClients > 0 && (
        <div className="ai-insight">
          <Brain size={24} style={{ color: "var(--blue)", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: "var(--text)" }}>
              AI Insight
            </p>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "2px 0 0" }}>
              {stats?.totalClients > 0
                ? `${stats.totalClients} client${stats.totalClients > 1 ? "s" : ""} enrolled · ${stats.activePlans} diet plans active · ${stats.successRate}% of clients have an active plan. Keep up the momentum!`
                : "Add clients and generate plans to see AI-powered insights here."}
            </p>
          </div>
          <Link href="/analytics" className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>
            View Analytics
          </Link>
        </div>
      )}

      {/* ═══ AI FAB ═══ */}
      <button className="ai-fab" onClick={() => setAiOpen((o) => !o)}>
        <span className="ai-fab-pulse" />
        <Bot size={24} />
      </button>

      {aiOpen && <AIPanel onClose={() => setAiOpen(false)} />}
    </div>
  );
}
