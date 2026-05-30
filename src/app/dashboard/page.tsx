'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Users, ClipboardList, FileText, TrendingUp, Plus, ChevronRight,
  Activity, X,
} from 'lucide-react';
import { MOCK_CLIENTS, MOCK_ACTIVITY, getGreeting, formatDate } from '../../lib/mock-data';

function StatCard({ icon: Icon, label, value, change, color = '#2563EB' }: {
  icon: any; label: string; value: string; change?: number | null; color?: string;
}) {
  return (
    <div className="card card-hover p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon size={20} style={{ color }} />
        </div>
        {change !== undefined && change !== null && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            change >= 0 ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'
          }`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

function QuickAddModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card p-6 max-w-md">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-heading font-bold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>Quick Add Client</h2>
          <button onClick={onClose} className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="input-label">Client Name</label>
            <input className="input-field" placeholder="Full name" autoFocus />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="input-label">Email</label>
              <input className="input-field" type="email" placeholder="email@example.com" />
            </div>
            <div>
              <label className="input-label">Phone</label>
              <input className="input-field" type="tel" placeholder="+91 9XXXX XXXX" />
            </div>
          </div>
          <div>
            <label className="input-label">Primary Goal</label>
            <select className="input-field" defaultValue="Fat Loss">
              <option>Fat Loss</option>
              <option>Muscle Gain</option>
              <option>General Fitness</option>
            </select>
          </div>
          <div className="pt-2 flex justify-end gap-3">
            <button onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button onClick={onClose} className="btn btn-primary">Add Client</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const stats = [
    { icon: Users, label: 'Active Clients', value: '24', change: 12, color: '#2563EB' },
    { icon: ClipboardList, label: 'Plans Generated Today', value: '6', change: null, color: '#8B5CF6' },
    { icon: FileText, label: 'Plans Pending Review', value: '3', change: null, color: '#F59E0B' },
    { icon: TrendingUp, label: 'Avg Client Progress', value: '87%', change: 5, color: '#22C55E' },
  ];

  const priorityClients = MOCK_CLIENTS.filter(c => c.status !== 'delivered').slice(0, 4);

  return (
    <div className="page-content animate-slide-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
            {getGreeting()}, Dr. Mehta
          </h1>
          <p className="text-sm text-gray-500">{formatDate()}</p>
        </div>
        <button
          onClick={() => setShowQuickAdd(true)}
          className="btn btn-primary shadow-lg shadow-blue-500/25"
        >
          <Plus size={18} />
          Quick Add Client
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 card p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-5">Recent Activity</h2>
          <div className="space-y-1">
            {MOCK_ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                  {a.type === 'assessment' && <ClipboardList size={16} />}
                  {a.type === 'plan' && <FileText size={16} />}
                  {a.type === 'delivery' && <Activity size={16} />}
                  {a.type === 'progress' && <TrendingUp size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium text-sm text-gray-900">{a.client}</span>
                    <span className={`badge ${
                      a.type === 'delivery' ? 'badge-success' :
                      a.type === 'progress' ? 'badge-info' :
                      a.type === 'plan' ? 'badge-warning' : 'badge-info'
                    }`}>{a.type}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{a.detail}</p>
                  <p className="text-xs text-gray-400 mt-1">{a.time}</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors shrink-0 mt-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Priority Clients */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-900">Priority Clients</h2>
            <Link href="/clients" className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {priorityClients.map((c, i) => (
              <Link
                key={c.id}
                href="/clients"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{
                    background: `${['#2563EB', '#8B5CF6', '#F59E0B', '#22C55E'][i]}15`,
                    color: ['#2563EB', '#8B5CF6', '#F59E0B', '#22C55E'][i],
                  }}
                >
                  {c.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">{c.name}</div>
                  <div className="text-xs text-gray-500">{c.goal} · {c.calories} kcal</div>
                </div>
                <span className={`badge ${
                  c.status === 'active' ? 'badge-success' :
                  c.status === 'review' ? 'badge-warning' : 'badge-info'
                } shrink-0`}>
                  {c.status === 'active' ? 'Active' : c.status === 'review' ? 'Review' : 'Delivered'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {showQuickAdd && <QuickAddModal onClose={() => setShowQuickAdd(false)} />}
    </div>
  );
}
