"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.token) {
      localStorage.setItem("fitai_token", data.token);
      router.push("/dashboard");
    } else {
      setError(data.error || "Login failed. Please check your credentials.");
    }
  }

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 16px" }}>
      <div
        style={{
          background: "white", borderRadius: 28, padding: "44px 40px", width: "100%", maxWidth: 420,
          border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
        }}
      >
        <div
          style={{
            width: 48, height: 48, borderRadius: 14, background: "#0071e3",
            display: "grid", placeItems: "center", color: "white", fontSize: 22, fontWeight: 700, marginBottom: 24,
          }}
        >F</div>
        <h2 style={{ margin: "0 0 4px", fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em" }}>Sign in</h2>
        <p style={{ margin: "0 0 28px", color: "#6e6e73", fontSize: 15 }}>Welcome back to FitAI Coach</p>

        <form onSubmit={handleLogin}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#424245", marginBottom: 6 }}>Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="you@example.com"
                style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.12)", background: "#f5f5f7", fontSize: 15 }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#424245", marginBottom: 6 }}>Password</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="Enter your password"
                style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.12)", background: "#f5f5f7", fontSize: 15 }}
              />
            </div>
          </div>
          {error && <p style={{ marginTop: 12, color: "#e53935", fontSize: 13 }}>{error}</p>}
          <button
            type="submit" disabled={loading}
            style={{
              width: "100%", marginTop: 20, padding: "14px", borderRadius: 980,
              background: loading ? "#90c2f5" : "#0071e3", color: "white",
              fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em", cursor: loading ? "not-allowed" : "pointer",
              transition: "background 160ms",
            }}
          >{loading ? "Signing in…" : "Sign in"}</button>
        </form>
        <p style={{ marginTop: 20, textAlign: "center", fontSize: 14, color: "#6e6e73" }}>
          New here?{" "}
          <Link href="/dashboard" style={{ color: "#0071e3", fontWeight: 600 }}>Open dashboard</Link>
        </p>
      </div>
    </div>
  );
}
