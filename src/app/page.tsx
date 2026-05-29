import Link from "next/link";
import { ArrowRight, Users, Salad, TrendingUp, Bot } from "lucide-react";

export default function HomePage() {
  return (
    <div className="page-content" style={{ maxWidth: 800, margin: "0 auto" }}>
      <section className="hero-banner" style={{ textAlign: "center", padding: "var(--space-12) var(--space-8)" }}>
        <div className="hero-content">
          <span className="badge badge-blue" style={{ margin: "0 auto var(--space-4)", display: "inline-flex" }}>
            FitAI Coach · Premium trainer workspace
          </span>
          <h1 className="hero-title" style={{ fontSize: "clamp(28px, 5vw, 48px)", maxWidth: 640, margin: "0 auto var(--space-4)" }}>
            The intelligent nutrition dashboard for elite personal trainers
          </h1>
          <p className="hero-subtitle" style={{ maxWidth: 540, margin: "0 auto var(--space-8)", fontSize: 17 }}>
            Manage clients, generate AI-powered diet plans, track progress, and export
            professional deliverables — all in one clean workspace.
          </p>
          <div className="hero-actions" style={{ justifyContent: "center" }}>
            <Link href="/dashboard" className="hero-cta">
              Open Dashboard <ArrowRight size={16} />
            </Link>
            <Link href="/login" className="hero-cta-secondary">
              Login
            </Link>
          </div>
        </div>
      </section>

      <section className="stats-grid" style={{ marginTop: "var(--space-6)" }}>
        {[
          { val: "128", label: "Total Clients" },
          { val: "94", label: "Active Plans" },
          { val: "₹1.84L", label: "Monthly Revenue" },
          { val: "87%", label: "Success Rate" },
        ].map((item) => (
          <div key={item.label} className="stat-card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{item.val}</div>
            <div className="text-sm text-muted" style={{ margin: 0 }}>{item.label}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
