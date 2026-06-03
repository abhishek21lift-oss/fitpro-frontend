'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, ClipboardList, TrendingUp, Settings, LogOut,
} from 'lucide-react';
import { MOCK_TRAINER } from '../lib/mock-data';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/diet-plans', label: 'Plans', icon: ClipboardList },
  { href: '/analytics', label: 'Progress', icon: TrendingUp },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/logo.png" alt="Logo" className="sidebar-logo-icon" style={{ width: 38, height: 38, objectFit: 'cover' }} />
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
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-avatar">{MOCK_TRAINER.initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="sidebar-user-name">{MOCK_TRAINER.name}</div>
          <div className="sidebar-user-role">{MOCK_TRAINER.title}</div>
        </div>
        <button className="sidebar-footer-action" aria-label="Logout" onClick={() => window.location.href = '/login'} title="Logout">
          <LogOut size={15} />
        </button>
      </div>
    </aside>
  );
}
