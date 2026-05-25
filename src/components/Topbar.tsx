"use client";

import { Bell, Search, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <Link href="/">
          <span className="page-title">FitAI Coach</span>
        </Link>
        <div className="ai-search">
          <Search size={16} className="ai-search-icon" />
          <input type="text" placeholder="Ask FitAI anything…" />
          <span className="ai-search-badge">⌘K</span>
        </div>
      </div>
      <div className="topbar-actions">
        <button className="upgrade-btn">
          <Sparkles size={14} />
          Upgrade Pro
        </button>
        <button className="icon-btn">
          <Bell size={18} />
          <span className="badge-dot" />
        </button>
        <button className="avatar-btn">AK</button>
      </div>
    </header>
  );
}
