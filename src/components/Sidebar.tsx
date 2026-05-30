'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, ClipboardList, TrendingUp, Settings, Dumbbell,
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
        <div className="sidebar-logo-icon">
          <Dumbbell size={18} />
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
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-avatar">{MOCK_TRAINER.initials}</div>
        <div>
          <div className="sidebar-user-name">{MOCK_TRAINER.name}</div>
          <div className="sidebar-user-role">{MOCK_TRAINER.title}</div>
        </div>
      </div>
    </aside>
  );
}
