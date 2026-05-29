"use client";

import { useEffect, useState } from "react";
import { Settings, Bell, CreditCard, Loader2, Check } from "lucide-react";

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
    await new Promise(r => setTimeout(r, 600));
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) {
    return <div className="page-content">
      <div className="skeleton" style={{ width: "100%", height: 400, borderRadius: "var(--radius-xl)" }} />
    </div>;
  }

  return (
    <div className="page-content">
      <section className="hero-banner" style={{ paddingBottom: "var(--space-8)" }}>
        <div className="hero-content">
          <p className="hero-greeting">Account</p>
          <h1 className="hero-title">Settings</h1>
          <p className="hero-subtitle">Manage your profile, notifications, and billing.</p>
        </div>
      </section>

      <section className="section-grid">
        {/* Profile */}
        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title"><Settings size={16} /> Profile</h2>
          </div>
          <div className="panel-body">
            <div className="form-grid">
              <div className="form-group">
                <label className="input-label">Full Name</label>
                <input className="input-field" type="text" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="input-label">Email</label>
                <input className="input-field" type="email" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>
            <button onClick={handleSave} disabled={saving} className="btn btn-primary" style={{ marginTop: 18 }}>
              {saving ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : saved ? <Check size={14} /> : null}
              {saving ? " Saving..." : saved ? " Saved" : "Save Profile"}
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title"><Bell size={16} /> Notifications</h2>
          </div>
          <div className="panel-body">
            <div className="form-grid">
              <div className="form-group">
                <label className="input-label">Client updates email</label>
                <select className="input-field" defaultValue="On">
                  <option>On</option>
                  <option>Off</option>
                </select>
              </div>
              <div className="form-group">
                <label className="input-label">Plan reminders</label>
                <select className="input-field" defaultValue="On">
                  <option>On</option>
                  <option>Off</option>
                </select>
              </div>
            </div>
            <button className="btn btn-primary" style={{ marginTop: 18 }}>Save Notifications</button>
          </div>
        </div>

        {/* Billing */}
        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title"><CreditCard size={16} /> Billing</h2>
          </div>
          <div className="panel-body">
            <div className="form-grid">
              <div className="form-group">
                <label className="input-label">Current plan</label>
                <input className="input-field" type="text" defaultValue="Pro — ₹999/month" disabled />
              </div>
              <div className="form-group">
                <label className="input-label">Next billing</label>
                <input className="input-field" type="text" defaultValue="June 1, 2026" disabled />
              </div>
            </div>
            <button className="btn btn-ghost" style={{ marginTop: 18 }} disabled>Manage Billing →</button>
          </div>
        </div>
      </section>
    </div>
  );
}
