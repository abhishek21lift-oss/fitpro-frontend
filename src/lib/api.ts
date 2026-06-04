const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('fitai_token')
}

async function request<T = any>(path: string, options?: RequestInit, fallback?: () => T): Promise<T> {
  const token = getToken()
  try {
    const res = await fetch(`${BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({ message: res.statusText }))
      if (fallback) return fallback()
      throw new Error(body.message || `Request failed: ${res.status}`)
    }
    return res.json()
  } catch {
    if (fallback) return fallback()
    throw new Error('Backend unavailable. Is the server running?')
  }
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ token: string; user: { id: string; name: string; email: string } }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    register: (name: string, email: string, password: string) =>
      request<{ id: string; name: string; email: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      }),
    me: () => request<{ user: any }>('/auth/me'),
  },
  clients: {
    list: () => request<any[]>('/clients', {}),
    get: (id: string) => request<any>(`/clients/${id}`, {}),
    create: (data: any) => request<any>('/clients', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/clients/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/clients/${id}`, { method: 'DELETE' }),
    progress: {
      list: (clientId: string) => request<any[]>(`/clients/${clientId}/progress`, {}),
      create: (clientId: string, data: { weight: number; note?: string }) =>
        request<any>(`/clients/${clientId}/progress`, { method: 'POST', body: JSON.stringify(data) }),
    },
    measurements: {
      list: (clientId: string) => request<any[]>(`/clients/${clientId}/measurements`, {}),
      create: (clientId: string, data: any) =>
        request<any>(`/clients/${clientId}/measurements`, { method: 'POST', body: JSON.stringify(data) }),
    },
    adherence: {
      list: (clientId: string) => request<any[]>(`/clients/${clientId}/adherence`, {}),
      create: (clientId: string, data: any) =>
        request<any>(`/clients/${clientId}/adherence`, { method: 'POST', body: JSON.stringify(data) }),
    },
    workoutLogs: {
      list: (clientId: string) => request<any[]>(`/clients/${clientId}/workout-logs`, {}),
      create: (clientId: string, data: any) =>
        request<any>(`/clients/${clientId}/workout-logs`, { method: 'POST', body: JSON.stringify(data) }),
    },
  },
  dietPlans: {
    byClient: (clientId: string) => request<any[]>(`/diet-plans/by-client/${clientId}`, {}),
    get: (id: string) => request<any>(`/diet-plans/${id}`, {}),
    generate: (clientId: string) =>
      request<any>(`/diet-plans/generate/${clientId}`, { method: 'POST' }),
    update: (id: string, data: any) =>
      request<any>(`/diet-plans/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  },
  workoutPlans: {
    byClient: (clientId: string) => request<any[]>(`/workout-plans/by-client/${clientId}`, {}),
    get: (id: string) => request<any>(`/workout-plans/${id}`, {}),
    generate: (clientId: string) =>
      request<any>(`/workout-plans/generate/${clientId}`, { method: 'POST' }),
    update: (id: string, data: any) =>
      request<any>(`/workout-plans/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  },
  engine: {
    calculate: (clientId: string) =>
      request<any>(`/engine/calculate/${clientId}`, { method: 'POST' }),
    splits: () => request<any>('/engine/splits', {}),
  },
  reEvaluate: {
    analyze: (clientId: string) =>
      request<any>(`/re-evaluate/${clientId}`, { method: 'POST' }),
  },
  assessments: {
    list: (clientId: string) => request<any[]>(`/assessments/by-client/${clientId}`, {}),
    get: (id: string) => request<any>(`/assessments/${id}`, {}),
    create: (data: any) => request<any>('/assessments', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/assessments/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/assessments/${id}`, { method: 'DELETE' }),
  },
  analytics: {
    dashboard: () => request<any>('/analytics/dashboard', {}),
  },
}
