import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FitAI Coach",
  description: "Premium AI Diet Plan Generator for personal trainers",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
              <Link href="/diet-plans/plan-demo">🥗 Diet Plans</Link>
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
                <input className="search-input" placeholder="Search clients, plans…" />
                <Link href="/login" className="ghost-btn">Login</Link>
              </div>
            </header>
            <main className="page-content">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
