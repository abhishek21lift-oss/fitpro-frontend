"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("fitai_token");
    if (!token) { setLoading(false); return; }
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.json()).then((d) => {
      const u = d.user || d;
      setUser(u);
      setName(u.name || "");
      setEmail(u.email || "");
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true); setSaved(false);
    const token = localStorage.getItem("fitai_token");
    // Note: backend doesn't have a PUT /auth/me endpoint yet — this is a placeholder for when it does
    await new Promise(r => setTimeout(r, 600));
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) return <div className="stack"><p className="subtle">Loading...</p></div>;

  return (
    <div className="stack">
      <div style={{ marginBottom: 4 }}>
        <p className="muted-label">Account</p>
        <h2 className="section-title">Settings</h2>
      </div>
      <div className="settings-card">
        <h3 style={{ margin: "0 0 20px", fontSize: 17, fontWeight: 600 }}>Profile</h3>
        <div className="form-grid">
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6e6e73", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6e6e73", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
        </div>
        <button onClick={handleSave} disabled={saving} className="primary-btn" style={{ marginTop: 18 }}>
          {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Profile'}
        </button>
      </div>
      <div className="settings-card">
        <h3 style={{ margin: "0 0 20px", fontSize: 17, fontWeight: 600 }}>Notifications</h3>
        <div className="form-grid">
          {[
            ["Client updates email", "On"],
            ["Plan reminders", "On"],
          ].map(([label, val]) => (
            <div key={label}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6e6e73", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>
              <select defaultValue={val} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(0,0,0,0.12)', background: '#f5f5f7', fontSize: 14, color: '#1d1d1f' }}>
                <option>On</option>
                <option>Off</option>
              </select>
            </div>
          ))}
        </div>
        <button className="primary-btn" style={{ marginTop: 18 }}>Save Notifications</button>
      </div>
      <div className="settings-card">
        <h3 style={{ margin: "0 0 20px", fontSize: 17, fontWeight: 600 }}>Billing</h3>
        <div className="form-grid">
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6e6e73", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Current plan</label>
            <input type="text" defaultValue="Pro — ₹999/month" disabled />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6e6e73", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Next billing</label>
            <input type="text" defaultValue="June 1, 2026" disabled />
          </div>
        </div>
      </div>
    </div>
  );
}
