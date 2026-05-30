'use client';

import { useState } from 'react';
import { Users, Plus, Search, ChevronRight } from 'lucide-react';
import { MOCK_CLIENTS } from '../../lib/mock-data';

const colorMap = ['#2563EB', '#8B5CF6', '#F59E0B', '#22C55E', '#EC4899', '#06B6D4'];

export default function ClientsPage() {
  const [search, setSearch] = useState('');
  const filtered = MOCK_CLIENTS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-content animate-slide-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
            Clients
          </h1>
          <p className="text-sm text-gray-500">
            {MOCK_CLIENTS.length} clients · {MOCK_CLIENTS.filter(c => c.status === 'active').length} active ·{' '}
            {MOCK_CLIENTS.filter(c => c.goal.toLowerCase().includes('fat')).length} on fat loss
          </p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} />
          New Assessment
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className="input-field pl-10"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Client list */}
      <div className="space-y-3">
        {filtered.map((c, i) => (
          <div
            key={c.id}
            className="card card-hover p-4 flex items-center gap-4 cursor-pointer"
            role="button"
            tabIndex={0}
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-base font-bold shrink-0"
              style={{ background: `${colorMap[i % colorMap.length]}15`, color: colorMap[i % colorMap.length] }}
            >
              {c.initials}
            </div>
            <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-4 gap-2">
              <div>
                <div className="text-sm font-semibold text-gray-900">{c.name}</div>
                <div className="text-xs text-gray-500">{c.age}{c.gender} · {c.goal}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Program</div>
                <div className="text-sm font-medium text-gray-900">Week {c.programWeek}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Calories</div>
                <div className="text-sm font-medium text-gray-900">{c.calories} kcal</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Split</div>
                <div className="text-sm font-medium text-gray-900 truncate">{c.split}</div>
              </div>
            </div>
            <span className={`badge ${
              c.status === 'active' ? 'badge-success' :
              c.status === 'review' ? 'badge-warning' : 'badge-info'
            } shrink-0`}>
              {c.status === 'active' ? 'Active' : c.status === 'review' ? 'Review' : 'Delivered'}
            </span>
            <ChevronRight size={16} className="text-gray-300 shrink-0" />
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">No clients found</div>
        )}
      </div>
    </div>
  );
}
