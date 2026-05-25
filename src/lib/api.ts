const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('fitai_token')
}

async function request<T = any>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken()
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
    throw new Error(body.message || `Request failed: ${res.status}`)
  }
  return res.json()
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
    me: () => request<{ user: { sub: string; email: string } }>('/auth/me'),
  },
  clients: {
    list: () => request<any[]>('/clients'),
    get: (id: string) => request<any>(`/clients/${id}`),
    create: (data: any) => request<any>('/clients', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/clients/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/clients/${id}`, { method: 'DELETE' }),
    progress: {
      list: (clientId: string) => request<any[]>(`/clients/${clientId}/progress`),
      create: (clientId: string, data: { weight: number; note?: string }) =>
        request<any>(`/clients/${clientId}/progress`, { method: 'POST', body: JSON.stringify(data) }),
    },
  },
  dietPlans: {
    get: (id: string) => request<any>(`/diet-plans/${id}`),
    generate: (clientId: string) =>
      request<any>(`/diet-plans/generate/${clientId}`, { method: 'POST' }),
  },
  analytics: {
    dashboard: () => request<{ totalClients: number; activePlans: number; revenue: number; successRate: number }>('/analytics/dashboard'),
  },
}
