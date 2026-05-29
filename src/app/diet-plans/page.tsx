"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Salad, UserPlus, ArrowUpRight, Loader2, Check } from "lucide-react";

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
    <div className="page-content">
      <section className="hero-banner" style={{ paddingBottom: "var(--space-8)" }}>
        <div className="hero-content">
          <p className="hero-greeting">Diet plans</p>
          <h1 className="hero-title">Client Diet Plans</h1>
          <p className="hero-subtitle">View and manage AI-generated diet plans for your clients.</p>
        </div>
      </section>

      {loading ? (
        <div className="skeleton" style={{ width: "100%", height: 200, borderRadius: "var(--radius-xl)" }} />
      ) : plans.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Salad size={28} /></div>
          <h2 className="empty-state-title">No clients yet</h2>
          <p className="empty-state-text">Add your first client to start generating AI diet plans.</p>
          <Link href="/clients/add" className="btn btn-primary">
            <UserPlus size={16} /> Add Client
          </Link>
        </div>
      ) : (
        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title">All clients</h2>
            <Link href="/clients/add" className="btn btn-primary btn-sm">
              <UserPlus size={14} /> Add Client
            </Link>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Goal</th>
                <th>Calorie Target</th>
                <th>Plan</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {plans.map((client: any) => (
                <tr key={client.id}>
                  <td>
                    <Link href={`/clients/${client.id}`} style={{ color: "var(--blue)", fontWeight: 600, fontSize: 14 }}>
                      {client.full_name}
                    </Link>
                  </td>
                  <td><span className="text-sm">{client.goal || "—"}</span></td>
                  <td><span className="text-sm">{client.calorie_target ? `${client.calorie_target} kcal` : "—"}</span></td>
                  <td>
                    <GeneratePlanButton clientId={client.id} clientName={client.full_name} />
                  </td>
                  <td>
                    <Link href={`/clients/${client.id}`} className="btn btn-ghost btn-sm">
                      View <ArrowUpRight size={12} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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
      className={`btn btn-sm ${done ? '' : 'btn-primary'}`}
      style={done ? { background: "#d1fae5", color: "#065f46", border: "none", cursor: "default", fontSize: 12 } : { fontSize: 12 }}
    >
      {generating ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : done ? <><Check size={14} /> Generated</> : "Generate Plan"}
    </button>
  );
}
