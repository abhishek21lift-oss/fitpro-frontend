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

function mockClient(id: string): any {
  return {
    id, full_name: 'Demo Client', age: 28, gender: 'M', goal: 'Fat Loss',
    height: 175, weight: 82, body_fat_percentage: 22, calorie_target: 2100,
    diet_type: 'Non-Veg', experience_level: 'Intermediate',
    activity_level: 'Moderate', plan_status: 'calculated',
    recovery_score: 85, created_at: new Date().toISOString(),
  }
}

function mockClients(): any[] {
  return Array.from({ length: 6 }, (_, i) => mockClient(String(i + 1)))
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ token: string; user: { id: string; name: string; email: string } }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }, () => ({ token: 'demo-token', user: { id: '1', name: 'Dr. Arjun Mehta', email } })),
    register: (name: string, email: string, password: string) =>
      request<{ id: string; name: string; email: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      }),
    me: () => request<{ user: any }>('/auth/me', {}, () => ({ user: { id: '1', name: 'Dr. Arjun Mehta', email: 'arjun@aifitness.in' } })),
  },
  clients: {
    list: () => request<any[]>('/clients', {}, () => mockClients()),
    get: (id: string) => request<any>(`/clients/${id}`, {}, () => mockClient(id)),
    create: (data: any) => request<any>('/clients', { method: 'POST', body: JSON.stringify(data) }, () => ({ id: Date.now().toString(), ...data })),
    update: (id: string, data: any) => request<any>(`/clients/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, () => ({ id, ...data })),
    delete: (id: string) => request<any>(`/clients/${id}`, { method: 'DELETE' }, () => ({ success: true })),
    progress: {
      list: (clientId: string) => request<any[]>(`/clients/${clientId}/progress`, {}, () => []),
      create: (clientId: string, data: { weight: number; note?: string }) =>
        request<any>(`/clients/${clientId}/progress`, { method: 'POST', body: JSON.stringify(data) }, () => ({ id: Date.now(), ...data })),
    },
    measurements: {
      list: (clientId: string) => request<any[]>(`/clients/${clientId}/measurements`, {}, () => []),
      create: (clientId: string, data: any) =>
        request<any>(`/clients/${clientId}/measurements`, { method: 'POST', body: JSON.stringify(data) }, () => ({ id: Date.now(), ...data })),
    },
    adherence: {
      list: (clientId: string) => request<any[]>(`/clients/${clientId}/adherence`, {}, () => []),
      create: (clientId: string, data: any) =>
        request<any>(`/clients/${clientId}/adherence`, { method: 'POST', body: JSON.stringify(data) }, () => ({ id: Date.now(), ...data })),
    },
    workoutLogs: {
      list: (clientId: string) => request<any[]>(`/clients/${clientId}/workout-logs`, {}, () => []),
      create: (clientId: string, data: any) =>
        request<any>(`/clients/${clientId}/workout-logs`, { method: 'POST', body: JSON.stringify(data) }, () => ({ id: Date.now(), ...data })),
    },
  },
  dietPlans: {
    byClient: (clientId: string) => request<any[]>(`/diet-plans/by-client/${clientId}`, {}, () => []),
    get: (id: string) => request<any>(`/diet-plans/${id}`, {}, () => ({ id, title: 'Sample Diet Plan', total_calories: 2100, protein_g: 150, carbs_g: 220, fats_g: 55, meals: [] })),
    generate: (clientId: string) =>
      request<any>(`/diet-plans/generate/${clientId}`, { method: 'POST' }, () => ({ id: Date.now().toString(), status: 'generated' })),
    update: (id: string, data: any) =>
      request<any>(`/diet-plans/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, () => ({ id, ...data })),
  },
  workoutPlans: {
    byClient: (clientId: string) => request<any[]>(`/workout-plans/by-client/${clientId}`, {}, () => []),
    get: (id: string) => request<any>(`/workout-plans/${id}`, {}, () => ({ id, title: 'Sample Workout', split_type: 'PPL', days_per_week: 4, days: [] })),
    generate: (clientId: string) =>
      request<any>(`/workout-plans/generate/${clientId}`, { method: 'POST' }, () => ({ id: Date.now().toString(), status: 'generated' })),
    update: (id: string, data: any) =>
      request<any>(`/workout-plans/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, () => ({ id, ...data })),
  },
  engine: {
    calculate: (clientId: string) =>
      request<any>(`/engine/calculate/${clientId}`, { method: 'POST' }, () => ({ bmr: 1750, tdee: 2450, calorieTarget: 2100, proteinTargetG: 150, carbsTargetG: 220, fatTargetG: 55, recoveryScore: 85, trainingVolumeMinutes: 240, workoutSplit: 'Upper/Lower 4x' })),
    splits: () => request<any>('/engine/splits', {}, () => ({ splits: ['PPL', 'Upper/Lower', 'Full Body', 'Push/Pull/Legs'] })),
  },
  reEvaluate: {
    analyze: (clientId: string) =>
      request<any>(`/re-evaluate/${clientId}`, { method: 'POST' }, () => ({
        goalAligned: 'on_track', goal: 'Fat Loss', clientName: 'Demo Client',
        weightChange: -2.5, weeklyRate: -0.6, avgDietAdherence: 88, avgWorkoutAdherence: 85,
        recommendations: ['Increase protein intake to 160g', 'Add 2 cardio sessions per week'],
        suggestedCalories: 1950, suggestedProteinG: 160, suggestedCarbsG: 200, suggestedFatG: 50,
        measurementChanges: { waistCm: -3, chestCm: 1 },
      })),
  },
  assessments: {
    list: (clientId: string) => request<any[]>(`/assessments/by-client/${clientId}`, {}, () => []),
    get: (id: string) => request<any>(`/assessments/${id}`, {}, () => ({
      id, client_id: '1', full_name: 'Priya Sharma', age: 28, gender: 'F',
      height: 165, weight: 72, body_fat_percentage: 31,
      goal: 'Fat Loss', activity_level: 'Moderate (3-4x/wk)',
      diet_type: 'Vegetarian', meal_frequency: '3',
      health_conditions: 'None', medications: 'None',
      experience_level: 'Intermediate', workout_days_per_week: '4',
      sleep_hours: '7', stress_level: 'Moderate',
      status: 'completed', created_at: new Date().toISOString(),
    })),
    create: (data: any) => request<any>('/assessments', { method: 'POST', body: JSON.stringify(data) }, () => ({ id: Date.now().toString(), ...data, status: 'completed', created_at: new Date().toISOString() })),
    update: (id: string, data: any) => request<any>(`/assessments/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, () => ({ id, ...data })),
    delete: (id: string) => request<any>(`/assessments/${id}`, { method: 'DELETE' }, () => ({ success: true })),
  },
  analytics: {
    dashboard: () => request<any>('/analytics/dashboard', {}, () => ({ activeClients: 6, totalPlans: 14, avgAdherence: 88 })),
  },
}
