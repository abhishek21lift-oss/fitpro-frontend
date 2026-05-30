'use client';

import './globals.css';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, ClipboardList, TrendingUp, Settings, Menu, X } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/diet-plans', label: 'Plans', icon: ClipboardList },
  { href: '/analytics', label: 'Progress', icon: TrendingUp },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAuthPage = pathname === '/login';

  if (isAuthPage) {
    return (
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Lora:wght@400;500;600;700&display=swap" rel="stylesheet" />
        </head>
        <body>{children}</body>
      </html>
    );
  }

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Lora:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {/* Mobile hamburger */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm border border-white/50 flex items-center justify-center text-gray-600 shadow-lg"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <div className="app-shell">
          <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
            <div className="sidebar-logo">
              <div className="sidebar-logo-icon">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 5h.01M6 5a1 1 0 0 1 2 0M6 5c0 .5.5 1 1 1"/><path d="M9 4.86A5 5 0 0 1 19 9v2a5 5 0 0 1-5 5h-3"/><path d="M9 16v4"/><path d="M5 22h8"/><path d="M5 22V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v18"/><path d="M15 10.5V10a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3v.5"/></svg>
              </div>
              <div className="sidebar-logo-text">
                <div className="sidebar-logo-title">AI Fitness</div>
                <div className="sidebar-logo-sub">Prescription System</div>
              </div>
            </div>

            <nav className="sidebar-nav">
              {navItems.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || (href !== '/' && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`sidebar-nav-item${active ? ' active' : ''}`}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="sidebar-footer">
              <div className="sidebar-avatar">
                AM
                <span className="sidebar-avatar-dot" />
              </div>
              <div>
                <div className="sidebar-user-name">Dr. Arjun Mehta</div>
                <div className="sidebar-user-role">Senior Fitness Coach</div>
              </div>
              <button className="sidebar-footer-action" aria-label="Settings">
                <Settings size={15} />
              </button>
            </div>
          </aside>

          <main className="main-content">{children}</main>
        </div>

        <nav className="mobile-nav">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className={`mobile-nav-item${pathname.startsWith(href) ? ' active' : ''}`}
            >
              <Icon size={20} strokeWidth={1.5} />
              {label}
            </Link>
          ))}
        </nav>
      </body>
    </html>
  );
}
