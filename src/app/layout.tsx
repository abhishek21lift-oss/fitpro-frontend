"use client";

import "./globals.css";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("fitai_token"));
  }, []);

  function handleLogout() {
    localStorage.removeItem("fitai_token");
    window.location.href = "/";
  }

  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <aside className="sidebar">
            <Link href="/" className="brand">
              <div className="brand-mark">F</div>
              <div>
                <p className="brand-kicker">FitAI</p>
                <h2>Coach</h2>
              </div>
            </Link>
            <nav className="nav">
              <Link href="/dashboard">📊 Dashboard</Link>
              <Link href="/clients">👤 Clients</Link>
              <Link href="/diet-plans">🥗 Diet Plans</Link>
              <Link href="/analytics">📈 Analytics</Link>
              <Link href="/settings">⚙️ Settings</Link>
            </nav>
            <div className="sidebar-card">
              <p className="muted-label">Quick action</p>
              <h3>Generate AI plan</h3>
              <p className="muted-copy">Add a client and instantly create a personalised diet plan.</p>
              <Link href="/clients/add" className="primary-btn">+ Add Client</Link>
            </div>
          </aside>
          <div className="main-wrap">
            <header className="topbar">
              <div className="topbar-left">
                <h1 className="page-title">FitAI Coach</h1>
              </div>
              <div className="topbar-actions">
                {loggedIn ? (
                  <button onClick={handleLogout} className="ghost-btn" style={{ fontSize: 13, padding: '6px 14px' }}>Logout</button>
                ) : (
                  <Link href="/login" className="ghost-btn">Login</Link>
                )}
              </div>
            </header>
            <main className="page-content">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
