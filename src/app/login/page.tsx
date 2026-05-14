"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<string>("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('fitai_token', data.token);
      router.push('/clients');
    } else {
      setResult(JSON.stringify(data, null, 2));
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-3xl font-semibold">Login</h1>
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <input className="w-full rounded-xl bg-slate-900 px-4 py-3" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full rounded-xl bg-slate-900 px-4 py-3" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="w-full rounded-xl bg-emerald-500 px-4 py-3 font-medium text-slate-950">Login</button>
        </form>
        {result ? <pre className="mt-6 overflow-auto rounded-xl bg-slate-900 p-4 text-xs">{result}</pre> : null}
      </div>
    </main>
  )
}
