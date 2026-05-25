"use client";

import "./globals.css";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, ClipboardCheck, BarChart3, MessageSquare, Settings,
  Moon, Sun,
} from "lucide-react";
import Link from "next/link";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";

const mobileNav = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/diet-plans", label: "Plans", icon: ClipboardCheck },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("fitai_dark") === "true";
    setDark(saved);
    document.documentElement.classList.toggle("dark", saved);
  }, []);

  function toggleDark() {
    const next = !dark;
    setDark(next);
    localStorage.setItem("fitai_dark", String(next));
    document.documentElement.classList.toggle("dark", next);
  }

  const isAuthPage = pathname === "/login";

  if (isAuthPage) {
    return (
      <html lang="en" className={dark ? "dark" : ""}>
        <body>{children}</body>
      </html>
    );
  }

  return (
    <html lang="en" className={dark ? "dark" : ""}>
      <body>
        <div className="app-shell">
          <Sidebar />
          <div className="main-wrap">
            <Topbar>
              <button onClick={toggleDark} className="icon-btn" title={dark ? "Light mode" : "Dark mode"}>
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </Topbar>
            <main>{children}</main>
          </div>
        </div>

        <nav className="mobile-nav">
          {mobileNav.map(({ href, label, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className={`mobile-nav-item${pathname.startsWith(href) ? " active" : ""}`}
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
