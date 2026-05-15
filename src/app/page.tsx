import Link from "next/link";

export default function HomePage() {
  return (
    <div className="stack">
      <section
        style={{
          background: "white",
          borderRadius: 32,
          padding: "48px 40px",
          border: "1px solid rgba(0,0,0,0.05)",
          boxShadow: "0 2px 18px rgba(0,0,0,0.07)",
          textAlign: "center",
          maxWidth: 760,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            background: "#e8f0fb", borderRadius: 980, padding: "6px 16px",
            fontSize: 13, color: "#0071e3", fontWeight: 600, marginBottom: 20,
          }}
        >
          FitAI Coach · Premium trainer workspace
        </div>
        <h1
          style={{
            margin: "0 auto 20px",
            fontSize: "clamp(28px, 5vw, 48px)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.07,
            color: "#1d1d1f",
            maxWidth: 640,
          }}
        >
          The intelligent nutrition dashboard for elite personal trainers
        </h1>
        <p
          style={{
            margin: "0 auto 32px",
            maxWidth: 540,
            color: "#6e6e73",
            fontSize: 17,
            lineHeight: 1.65,
          }}
        >
          Manage clients, generate AI-powered diet plans, track progress, and export
          professional deliverables — all in one clean workspace.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/dashboard" className="primary-btn" style={{ marginTop: 0 }}>
            Open Dashboard
          </Link>
          <Link href="/login" className="ghost-btn">
            Login
          </Link>
        </div>
      </section>

      <section className="stats-grid">
        {[
          ["128", "Total Clients", "badge"],
          ["94", "Active Plans", "badge-blue"],
          ["₹1.84L", "Monthly Revenue", "badge"],
          ["87%", "Success Rate", "badge-blue"],
        ].map(([val, label, cls]) => (
          <div key={label} className="stat-card" style={{ textAlign: "center" }}>
            <div className="kpi">{val}</div>
            <p className="subtle" style={{ marginTop: 6 }}>{label}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
