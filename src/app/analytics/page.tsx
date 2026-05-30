'use client';

import { useState } from 'react';
import {
  Activity, Camera, CheckCircle, Clock,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { MOCK_CLIENTS } from '../../lib/mock-data';

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-lg">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-sm font-bold text-gray-900">
          {payload[0].value}{payload[0].name === 'val' ? ' kg' : ' %'}
        </p>
      </div>
    );
  }
  return null;
}

export default function AnalyticsPage() {
  const [selectedId, setSelectedId] = useState(MOCK_CLIENTS[0].id);
  const client = MOCK_CLIENTS.find(c => c.id === selectedId) || MOCK_CLIENTS[0];
  const p = client.progress;

  const metrics = [
    { label: 'Current Weight', value: p.weight.length > 0 ? `${p.weight[p.weight.length - 1].val} kg` : '—', color: '#2563EB' },
    { label: 'Body Fat', value: p.bodyFat.length > 0 ? `${p.bodyFat[p.bodyFat.length - 1].val}%` : '—', color: '#8B5CF6' },
    { label: 'Adherence', value: p.adherence.length > 0 ? `${p.adherence[p.adherence.length - 1].val}%` : '—', color: '#22C55E' },
    { label: 'Avg Water', value: p.water.length > 0 ? `${p.water[p.water.length - 1].val}L` : '—', color: '#06B6D4' },
  ];

  return (
    <div className="page-content animate-slide-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
            Progress Tracking
          </h1>
          <p className="text-sm text-gray-500">Monitor client progress over time</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            className="input-field max-w-[200px]"
            value={selectedId}
            onChange={(e) => setSelectedId(Number(e.target.value))}
          >
            {MOCK_CLIENTS.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Client header */}
      <div className="card p-5 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-xl font-bold text-blue-600">
            {client.initials}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-gray-900">{client.name}</h2>
              <span className="badge badge-success">Week {client.programWeek}</span>
              <span className="badge badge-info">{client.goal}</span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              {client.age}{client.gender} · {client.assessment.height}cm · {client.assessment.weight}kg
            </p>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {metrics.map((m, i) => (
          <div key={i} className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${m.color}15` }}>
                <Activity size={15} style={{ color: m.color }} />
              </div>
            </div>
            <div className="text-xl font-bold text-gray-900">{m.value}</div>
            <div className="text-xs text-gray-500">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Weight */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Weight Trend</h3>
          <div style={{ height: 240 }}>
            {p.weight.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={p.weight} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="val" stroke="#2563EB" strokeWidth={2.5} dot={{ fill: '#2563EB', r: 4 }} activeDot={{ r: 6 }} name="val" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">No data yet</div>
            )}
          </div>
        </div>

        {/* Body Fat */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Body Fat % Trend</h3>
          <div style={{ height: 240 }}>
            {p.bodyFat.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={p.bodyFat} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="val" stroke="#8B5CF6" strokeWidth={2.5} dot={{ fill: '#8B5CF6', r: 4 }} activeDot={{ r: 6 }} name="val" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">No data yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Progress photos + logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Progress Photos</h3>
          <div className="space-y-3">
            {['Before (Start)', 'Current (Week 4)'].map((label, i) => (
              <div key={i} className="bg-gray-50 rounded-xl overflow-hidden">
                <div className="h-36 bg-gray-200 flex items-center justify-center">
                  <Camera size={24} className="text-gray-400" />
                </div>
                <div className="p-2 text-center text-xs font-medium text-gray-600">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 card p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Recent Workout Logs</h3>
          {client.progress.logs && client.progress.logs.length > 0 ? (
            <div className="space-y-2">
              {client.progress.logs.map((log, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${log.adherence >= 100 ? 'bg-green-50' : 'bg-amber-50'}`}>
                    {log.adherence >= 100
                      ? <CheckCircle size={16} className="text-green-600" />
                      : <Clock size={16} className="text-amber-600" />
                    }
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{log.workout}</span>
                      <span className={`badge ${log.adherence >= 100 ? 'badge-success' : 'badge-warning'} text-xs`}>
                        {log.adherence}%
                      </span>
                    </div>
                    {log.notes && <p className="text-xs text-gray-500 mt-0.5">{log.notes}</p>}
                    <p className="text-xs text-gray-400 mt-1">{log.date}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm">No workout logs yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
