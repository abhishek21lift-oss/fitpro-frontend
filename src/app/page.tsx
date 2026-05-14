import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-medium text-emerald-400">FitAI Coach</p>
        <h1 className="mt-3 text-5xl font-bold tracking-tight">Frontend repo ready</h1>
        <p className="mt-4 max-w-2xl text-slate-300">
          Premium AI diet plan generator frontend separated from backend. Auth and DB stay on the API server.
        </p>
        <div className="mt-8 flex gap-4">
          <Link href="/login" className="rounded-xl bg-emerald-500 px-5 py-3 font-medium text-slate-950">Login</Link>
          <Link href="/dashboard" className="rounded-xl border border-white/10 px-5 py-3 font-medium">Open Dashboard</Link>
        </div>
      </div>
    </main>
  )
}
