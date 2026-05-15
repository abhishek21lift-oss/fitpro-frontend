import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", padding: "64px 24px" }}>
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          background: "rgba(255,255,255,0.76)",
          border: "1px solid rgba(108, 92, 68, 0.14)",
          boxShadow: "0 24px 60px rgba(84, 63, 34, 0.12)",
          borderRadius: 36,
          padding: 40,
        }}
      >
        <p style={{ margin: 0, color: "#9a8f81", fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 700 }}>
          FitAI Coach
        </p>
        <h1 style={{ margin: "16px 0 0", fontSize: 52, lineHeight: 1.05, color: "#1f1a14" }}>
          Classic premium nutrition dashboard for personal trainers
        </h1>
        <p style={{ marginTop: 20, maxWidth: 720, color: "#746a5d", fontSize: 18, lineHeight: 1.7 }}>
          Manage clients, generate AI diet plans, track progress, and operate your coaching business from one elegant light theme workspace.
        </p>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 32 }}>
          <Link href="/dashboard" className="primary-btn">Open Dashboard</Link>
          <Link href="/login" className="ghost-btn">Login</Link>
        </div>
      </div>
    </main>
  );
}
