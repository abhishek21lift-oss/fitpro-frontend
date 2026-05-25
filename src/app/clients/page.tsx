"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Plus, Search, Sparkles, ArrowUpRight, Target, Flame, Salad, Zap } from "lucide-react";

const colorClasses = ["#2563EB", "#8B5CF6", "#10B981", "#F59E0B", "#EC4899", "#EF4444"];

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("fitai_token");
    if (!token) { setLoading(false); return; }
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => r.json()).then((d) => setClients(Array.isArray(d) ? d : [])).finally(() => setLoading(false));
  }, []);

  const filtered = clients.filter(
    (c) => c.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-content">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
        <div>
          <p className="text-xs">Client management</p>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", margin: "4px 0 4px", lineHeight: 1.15 }}>
            Your clients
          </h1>
          <p className="text-muted" style={{ fontSize: 14 }}>
            {clients.length} active client{clients.length !== 1 ? "s" : ""} · {clients.filter((c) => c.goal === "Weight Loss").length} on weight loss · {clients.filter((c) => c.diet_type === "Veg").length} vegetarian
          </p>
        </div>
        <Link href="/clients/add" className="btn btn-primary">
          <Plus size={16} />
          Add Client
        </Link>
      </div>

      {/* Search + Filters */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div className="ai-search" style={{ width: "100%", maxWidth: 400 }}>
          <Search size={16} className="ai-search-icon" />
          <input
            type="text" placeholder="Search clients…" value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["All", "Weight Loss", "Muscle Gain", "Maintenance"].map((f) => (
            <button key={f} className="btn btn-ghost btn-sm" style={{ background: f === "All" ? "var(--bg-muted)" : undefined, color: f === "All" ? "var(--text)" : undefined }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {!loading && clients.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Users size={28} />
          </div>
          <h2 className="empty-state-title">No clients yet</h2>
          <p className="empty-state-text">
            Start building your coaching business by adding your first client and generating an AI-powered diet plan.
          </p>
          <Link href="/clients/add" className="btn btn-primary btn-lg">
            <Plus size={16} />
            Add your first client
          </Link>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="client-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="client-card">
              <div className="skeleton" style={{ width: 44, height: 44, borderRadius: "var(--radius)" }} />
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                <div className="skeleton" style={{ width: "60%", height: 16 }} />
                <div className="skeleton" style={{ width: "40%", height: 12 }} />
                <div className="skeleton" style={{ width: "80%", height: 12 }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Client Grid */}
      {!loading && clients.length > 0 && (
        <div className="client-grid">
          {filtered.map((client, i) => {
            const color = colorClasses[i % colorClasses.length];
            const initials = client.full_name?.split(" ").map((s: string) => s[0]).join("").slice(0, 2).toUpperCase() || "?";
            const adherence = Math.floor(Math.random() * 30) + 65; // TODO: real adherence from backend

            return (
              <Link key={client.id} href={`/clients/${client.id}`} className="client-card">
                <div className="client-card-header">
                  <div className="client-avatar" style={{ background: color }}>{initials}</div>
                  <ArrowUpRight size={16} style={{ color: "var(--text-muted)", marginTop: 4 }} />
                </div>

                <div className="client-body">
                  <div className="client-name">{client.full_name}</div>
                  <div className="client-goal">{client.goal || "No goal set"}</div>
                  <div className="client-meta">
                    {client.diet_type && <span className="badge badge-blue" style={{ fontSize: 11 }}>{client.diet_type}</span>}
                    {client.goal && <span className="badge badge-ghost" style={{ fontSize: 11 }}>{client.goal}</span>}
                  </div>
                </div>

                {/* Stats */}
                <div className="client-footer">
                  <div className="client-stat">
                    <div className="client-stat-value">{client.weight || "—"}</div>
                    <div className="client-stat-label">Weight</div>
                  </div>
                  <div className="client-stat">
                    <div className="client-stat-value">{adherence}%</div>
                    <div className="client-stat-label">Adherence</div>
                  </div>
                  <div className="client-stat">
                    <div className="client-stat-value">{client.workout_time || "—"}</div>
                    <div className="client-stat-label">Time</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Callout */}
      {!loading && clients.length > 0 && (
        <div className="ai-insight" style={{ marginTop: 8 }}>
          <Zap size={20} style={{ color: "var(--blue)", flexShrink: 0 }} />
          <p className="text-sm" style={{ margin: 0, color: "var(--text-secondary)" }}>
            <strong style={{ color: "var(--text)" }}>{clients.length} clients</strong> · Average adherence is{" "}
            <strong style={{ color: "var(--emerald)" }}>84%</strong> ·{" "}
            {clients.filter((c) => c.goal === "Weight Loss").length} clients on weight loss programs
          </p>
        </div>
      )}
    </div>
  );
}
