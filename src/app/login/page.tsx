"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Zap, TrendingUp, Target } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("fitai_token", data.token);
        router.push("/dashboard");
      } else {
        setError(data.message || "Invalid credentials. Try admin@fitpro.com / fitpro123");
      }
    } catch {
      setError("Connection failed. Is the backend running?");
    }
    setLoading(false);
  }

  return (
    <div className="login-page">
      {/* LEFT — Login Form */}
      <div className="login-left">
        <div className="login-card">
          <div className="brand-mark" style={{ marginBottom: 24 }}>
            <Zap size={20} strokeWidth={2.5} />
          </div>
          <h1>Welcome back</h1>
          <p>Sign in to your FitAI coaching command center.</p>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="form-group">
              <label className="input-label">Email</label>
              <input
                className="input-field" type="email" value={email}
                onChange={(e) => setEmail(e.target.value)} required
                placeholder="admin@fitpro.com"
              />
            </div>
            <div className="form-group">
              <label className="input-label">Password</label>
              <input
                className="input-field" type="password" value={password}
                onChange={(e) => setPassword(e.target.value)} required
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <p style={{ fontSize: 13, color: "var(--red)", margin: 0 }}>{error}</p>
            )}

            <button
              type="submit" disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: "100%", marginTop: 4, justifyContent: "center" }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="ai-dot" /> Signing in…
                </span>
              ) : (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Sparkles size={16} /> Sign in
                </span>
              )}
            </button>

            <p className="text-sm text-center text-muted" style={{ marginTop: 12 }}>
              Demo: <strong>admin@fitpro.com</strong> / <strong>fitpro123</strong>
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT — Brand Panel */}
      <div className="login-right">
        <div className="login-right-content">
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: "linear-gradient(135deg, #2563EB, #4F46E5)",
            display: "grid", placeItems: "center", margin: "0 auto 24px",
            boxShadow: "0 0 30px rgba(37,99,235,0.25)",
          }}>
            <Zap size={28} strokeWidth={2} color="white" />
          </div>
          <h2>AI-powered fitness coaching</h2>
          <p>Generate personalised diet plans, track client adherence, and grow your coaching business — all from one intelligent workspace.</p>

          <div className="login-stats">
            <div className="login-stat">
              <div className="login-stat-value">28</div>
              <div className="login-stat-label">Active clients</div>
            </div>
            <div className="login-stat">
              <div className="login-stat-value">142</div>
              <div className="login-stat-label">AI plans</div>
            </div>
            <div className="login-stat">
              <div className="login-stat-value">89%</div>
              <div className="login-stat-label">Adherence</div>
            </div>
          </div>

          <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 10, textAlign: "left" }}>
            {[
              { icon: <Zap size={14} />, text: "AI-generated diet plans in seconds" },
              { icon: <TrendingUp size={14} />, text: "Real-time adherence tracking" },
              { icon: <Target size={14} />, text: "Smart recommendations powered by AI" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
                <span style={{ color: "var(--emerald)" }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
