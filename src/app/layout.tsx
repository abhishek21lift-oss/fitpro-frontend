'use client';

import './globals.css';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, ClipboardList, TrendingUp, Settings, Menu, X, LogOut } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/diet-plans', label: 'Plans', icon: ClipboardList },
  { href: '/analytics', label: 'Progress', icon: TrendingUp },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
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
        {/* Top Navigation Bar */}
        <header className="topbar">
          <div className="topbar-left">
            <img src="/logo.png" alt="Logo" className="topbar-logo" />
          </div>

          <nav className="topbar-nav">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href !== '/' && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`topbar-nav-item${active ? ' active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="topbar-right">
            <div className="topbar-user">
              <div className="topbar-avatar">
                AM
                <span className="topbar-avatar-dot" />
              </div>
              <div className="topbar-user-info">
                <div className="topbar-user-name">Dr. Arjun Mehta</div>
                <div className="topbar-user-role">Senior Fitness Coach</div>
              </div>
              <button className="topbar-logout" onClick={() => window.location.href = '/login'} title="Logout">
                <LogOut size={15} />
              </button>
            </div>

            <button className="topbar-hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>

        {mobileOpen && (
          <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />
        )}

        <div className={`mobile-drawer${mobileOpen ? ' open' : ''}`}>
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`mobile-drawer-item${active ? ' active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>

        <div className="app-shell">
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
