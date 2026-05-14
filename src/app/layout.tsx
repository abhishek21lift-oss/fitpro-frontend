import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <aside className="sidebar">
            <Link href="/" className="brand">
              <div className="brand-mark">F</div>
              <div>
                <p className="brand-kicker">Premium SaaS</p>
                <h2>FitAI Coach</h2>
              </div>
            </Link>
            <nav className="nav">
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/clients">Clients</Link>
              <Link href="/diet-plans/plan-demo">Diet Plans</Link>
              <Link href="/analytics">Analytics</Link>
              <Link href="/settings">Settings</Link>
            </nav>
            <div className="sidebar-card">
              <p className="muted-label">Trainer workspace</p>
              <h3>AI Diet Generator</h3>
              <p className="muted-copy">Manage clients, generate plans, and track progress from one panel.</p>
              <Link href="/clients/add" className="primary-btn">Add Client</Link>
            </div>
          </aside>
          <div className="main-wrap">
            <header className="topbar">
              <div>
                <p className="muted-label">Fitness Nutrition CRM</p>
                <h1 className="page-title">FitAI Coach</h1>
              </div>
              <div className="topbar-actions">
                <input className="search-input" placeholder="Search clients, plans, analytics" />
                <Link href="/login" className="ghost-btn">Login</Link>
              </div>
            </header>
            <main className="page-content">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}
