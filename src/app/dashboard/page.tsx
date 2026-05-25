"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Users, Zap, Activity, TrendingUp, UserPlus, Sparkles, BarChart3,
  Download, Calendar, Brain, Target, Bot, ArrowUpRight, Plus,
  Flame, ChevronRight, MessageSquare, X,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";

/* ═══════════════════════════════════════════
   STAT CARD
   ═══════════════════════════════════════════ */
function StatCard({
  label, value, trend, trendUp, icon: Icon, color, chartData, chartColor,
  subtitle,
}: {
  label: string; value: string; trend: string; trendUp: boolean;
  icon: any; color: string; chartData?: { v: number }[]; chartColor?: string;
  subtitle?: string;
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
      <div className="stat-label">{subtitle || label}</div>
      {chartData && (
        <div className="stat-chart">
          <ResponsiveContainer width="100%" height={32}>
            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
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
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   AI ASSISTANT PANEL
   ═══════════════════════════════════════════ */
function AIPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    { role: "bot", text: "Hi Abhishek! I'm your AI coaching assistant. Ask me anything about your clients, plans, or insights." },
  ]);
  const [input, setInput] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  function handleSend() {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((m) => [...m, { role: "user", text: userMsg }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [...m, {
        role: "bot",
        text: `Let me analyze that for you. Based on your current data: ${userMsg.includes("adherence") ? "Rahul Sharma is at 92% and Priya at 88%. Overall average is 84%." : userMsg.includes("client") ? "You have 28 active clients. 5 are due for check-in today." : "I've noted your request. Would you like me to generate a detailed report?"}`,
      }]);
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

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */
const trendData = [
  { v: 8 }, { v: 12 }, { v: 10 }, { v: 15 }, { v: 13 }, { v: 18 },
  { v: 16 }, { v: 21 }, { v: 19 }, { v: 24 }, { v: 22 }, { v: 28 },
];
const revenueData = [
  { v: 3.2 }, { v: 4.1 }, { v: 3.8 }, { v: 5.3 }, { v: 4.9 }, { v: 6.2 },
];

const activities = [
  { text: "Rahul Sharma checked in — 2kg lost this week", meta: "12 min ago", color: "emerald", icon: "↓" },
  { text: "AI plan generated for Priya Patel", meta: "1h ago", color: "blue", icon: "AI" },
  { text: "Ananya missed yesterday's workout", meta: "3h ago", color: "red", icon: "!" },
  { text: "Vikram hit 90% protein target for 5 days", meta: "5h ago", color: "emerald", icon: "★" },
  { text: "New recommendation: Increase water intake for Arjun", meta: "1d ago", color: "orange", icon: "💧" },
  { text: "Milestone: Priya completed 30 days streak", meta: "2d ago", color: "purple", icon: "🏆" },
];

const recentClients = [
  { name: "Rahul Sharma", goal: "Weight Loss", adherence: 92, diet: "Veg", nextCheckin: "Tomorrow", progress: "+2kg" },
  { name: "Priya Patel", goal: "Muscle Gain", adherence: 88, diet: "Non-Veg", nextCheckin: "Today", progress: "+1.5kg" },
  { name: "Vikram Singh", goal: "Maintenance", adherence: 95, diet: "Vegan", nextCheckin: "Fri", progress: "0kg" },
  { name: "Ananya Reddy", goal: "Weight Loss", adherence: 67, diet: "Veg", nextCheckin: "Overdue", progress: "-0.5kg" },
  { name: "Arjun Nair", goal: "Muscle Gain", adherence: 78, diet: "Non-Veg", nextCheckin: "Sat", progress: "+0.8kg" },
];

/* ═══════════════════════════════════════════
   DASHBOARD PAGE
   ═══════════════════════════════════════════ */
export default function DashboardPage() {
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <div className="page-content">
      {/* ═══ HERO — AI COMMAND CENTER ═══ */}
      <section className="hero-banner">
        <div className="hero-content">
          <p className="hero-greeting">Good morning, Abhishek</p>
          <h1 className="hero-title">Your AI coaching command center</h1>
          <p className="hero-subtitle">
            Your clients are <strong style={{ color: "#10B981" }}>32% more consistent</strong> this week.
            Rahul Sharma hit a <strong style={{ color: "#10B981" }}>7-day streak</strong>. Generate plans, track adherence,
            and grow your practice — all powered by AI.
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
            <button onClick={() => setAiOpen(true)} className="hero-cta-secondary">
              <Bot size={18} />
              Ask FitAI
            </button>
          </div>
          <div className="hero-insights">
            <span className="hero-chip"><Zap size={12} /> <span className="hero-chip-trend">12 active</span> plans this week</span>
            <span className="hero-chip"><TrendingUp size={12} /> <span className="hero-chip-trend">89%</span> avg adherence</span>
            <span className="hero-chip"><Target size={12} /> <span className="hero-chip-trend">5</span> check-ins today</span>
            <span className="hero-chip"><Flame size={12} /> <span className="hero-chip-trend">3</span> streaks active</span>
          </div>
        </div>
      </section>

      {/* ═══ METRICS ═══ */}
      <section className="stats-grid">
        <StatCard label="Active Clients" value="28" trend="+12%" trendUp={true} icon={Users} color="blue" chartData={trendData} subtitle="Total active clients" />
        <StatCard label="AI Plans" value="142" trend="+24%" trendUp={true} icon={Zap} color="purple" chartData={trendData} subtitle="Generated this month" />
        <StatCard label="Adherence" value="89%" trend="+5%" trendUp={true} icon={Activity} color="emerald" chartData={trendData} subtitle="Weekly average" />
        <StatCard label="Revenue" value="₹1.84L" trend="+18%" trendUp={true} icon={TrendingUp} color="orange" chartData={revenueData} chartColor="#F59E0B" subtitle="Monthly recurring" />
      </section>

      {/* ═══ MAIN GRID ═══ */}
      <section className="section-grid">
        {/* LEFT — Recent Clients */}
        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Client overview</h2>
            <Link href="/clients" style={{ color: "var(--blue)", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
              View all <ChevronRight size={14} />
            </Link>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Goal</th>
                <th>Adherence</th>
                <th>Diet</th>
                <th>Progress</th>
                <th>Next</th>
              </tr>
            </thead>
            <tbody>
              {recentClients.map((c) => (
                <tr key={c.name}>
                  <td style={{ fontWeight: 600, color: "var(--text)" }}>{c.name}</td>
                  <td><span className="text-sm">{c.goal}</span></td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className="progress-bar" style={{ width: 60 }}>
                        <div className={`progress-fill ${c.adherence >= 80 ? "emerald" : c.adherence >= 70 ? "orange" : "red"}`} style={{ width: `${c.adherence}%` }} />
                      </div>
                      <span className={`badge ${c.adherence >= 80 ? "badge-emerald" : c.adherence >= 70 ? "badge-orange" : "badge-red"}`} style={{ fontSize: 11, padding: "0 6px" }}>
                        {c.adherence}%
                      </span>
                    </div>
                  </td>
                  <td><span className="text-sm">{c.diet}</span></td>
                  <td><span className="text-sm font-semibold" style={{ color: c.progress.startsWith("+") ? "var(--emerald)" : "var(--text-muted)" }}>{c.progress}</span></td>
                  <td>
                    <span className={`badge ${c.nextCheckin === "Overdue" ? "badge-red" : c.nextCheckin === "Today" ? "badge-orange" : "badge-ghost"}`} style={{ fontSize: 11 }}>
                      {c.nextCheckin}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RIGHT — Activity + Quick Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          {/* Activity Feed */}
          <div className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Activity</h2>
              <span className="badge badge-blue" style={{ fontSize: 11 }}>Live</span>
            </div>
            <div className="panel-body" style={{ padding: "var(--space-2) var(--space-6)" }}>
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

          {/* Quick Actions */}
          <div className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Quick actions</h2>
            </div>
            <div className="panel-body">
              <div className="quick-actions">
                <Link href="/clients/add" className="quick-action">
                  <Sparkles size={24} className="quick-action-icon" />
                  Generate AI Plan
                </Link>
                <button onClick={() => setAiOpen(true)} className="quick-action">
                  <Bot size={24} className="quick-action-icon" />
                  Ask FitAI
                </button>
                <Link href="/clients" className="quick-action">
                  <Calendar size={24} className="quick-action-icon" />
                  Schedule Check-in
                </Link>
                <Link href="/analytics" className="quick-action">
                  <BarChart3 size={24} className="quick-action-icon" />
                  View Analytics
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ AI INSIGHT BAR ═══ */}
      <div className="ai-insight">
        <Brain size={24} style={{ color: "var(--blue)", flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: "var(--text)" }}>
            AI Insight
          </p>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "2px 0 0" }}>
            Rahul Sharma&apos;s protein intake is 23% below target. Consider suggesting a whey isolate or plant-based protein boost to maintain muscle during his cut phase.
          </p>
        </div>
        <Link href="/clients" className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>
          View Client
        </Link>
      </div>

      {/* ═══ AI ASSISTANT FAB ═══ */}
      <button className="ai-fab" onClick={() => setAiOpen((o) => !o)}>
        <span className="ai-fab-pulse" />
        <Bot size={24} />
      </button>

      {/* ═══ AI PANEL ═══ */}
      {aiOpen && <AIPanel onClose={() => setAiOpen(false)} />}
    </div>
  );
}
