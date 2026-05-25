"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, ClipboardCheck, BarChart3, MessageSquare, Settings,
  Zap, Bell, Search, Sparkles,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/diet-plans", label: "AI Plans", icon: ClipboardCheck },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "#", label: "Messages", icon: MessageSquare, badge: "3" },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { document.documentElement.style.setProperty("--sidebar-w", collapsed ? "72px" : "240px"); }, [collapsed]);

  if (!mounted) return null;

  return (
    <>
      <aside className={`sidebar${collapsed ? " collapsed" : ""}`}>
        <Link href="/" className="brand">
          <div className="brand-mark">
            <Zap size={18} strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <div className="brand-text">
              <p className="brand-kicker">FitAI</p>
              <h2>Coach</h2>
            </div>
          )}
        </Link>

        <nav className="nav">
          {navItems.map(({ href, label, icon: Icon, badge }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link key={label} href={href} className={`nav-item${active ? " active" : ""}`}>
                <Icon size={20} strokeWidth={active ? 2 : 1.5} className="nav-icon" />
                {!collapsed && <span className="nav-label">{label}</span>}
                {badge && !collapsed && <span className="nav-badge">{badge}</span>}
                {badge && collapsed && <span className="nav-badge" style={{ position: "absolute", top: 4, right: 4, minWidth: 14, padding: "0 4px", fontSize: 9 }}>{badge}</span>}
              </Link>
            );
          })}
        </nav>

        {!collapsed && (
          <div className="sidebar-footer">
            <div className="sidebar-avatar">AK</div>
            <div className="sidebar-user-info">
              <p className="sidebar-user-name">Abhishek</p>
              <div className="ai-status">
                <span className="ai-dot" />
                AI Active
              </div>
            </div>
          </div>
        )}
      </aside>

      <button
        className="sidebar-toggle"
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        style={{ display: "flex" }}
      >
        {collapsed ? "▶" : "◀"}
      </button>
    </>
  );
}
