"use client";

import "./globals.css";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, ClipboardCheck, BarChart3, Settings } from "lucide-react";
import Link from "next/link";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";

const mobileNav = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/diet-plans", label: "Plans", icon: ClipboardCheck },
  { href: "/analytics", label: "Stats", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setToken(localStorage.getItem("fitai_token"));
  }, []);

  const isAuthPage = pathname === "/login";

  if (isAuthPage) {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <Sidebar />
          <div className="main-wrap">
            <Topbar />
            <main>{children}</main>
          </div>
        </div>
        <nav className="mobile-nav">
          {mobileNav.map(({ href, label, icon: Icon }) => (
            <Link key={label} href={href} className={`mobile-nav-item${pathname.startsWith(href) ? " active" : ""}`}>
              <Icon size={20} strokeWidth={1.5} />
              {label}
            </Link>
          ))}
        </nav>
      </body>
    </html>
  );
}
