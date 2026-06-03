"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Zap, TrendingUp, Target, Eye, EyeOff } from "lucide-react";
import { api } from "../../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const data = await api.auth.login(email, password);
      localStorage.setItem("fitai_token", data.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Try admin@fitpro.com / fitpro123");
    }
    setLoading(false);
  }

  return (
    <div style={{
      display: 'flex', minHeight: '100vh',
      background: 'var(--bg)',
    }}>
      {/* LEFT — Form */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 40, position: 'relative',
      }}>
        {/* Background orbs */}
        <div style={{
          position: 'absolute', top: -120, right: -100, width: 500, height: 500,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.06), transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -80, left: -80, width: 400, height: 400,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.04), transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ width: '100%', maxWidth: 400, position: 'relative' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
            <img src="/logo.png" alt="FitPro" style={{
              width: 40, height: 40, borderRadius: 12, objectFit: 'cover',
              boxShadow: '0 4px 16px rgba(99,102,241,0.25)',
            }} />
            <div>
              <div style={{
                fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 18,
                background: 'linear-gradient(135deg, #6366F1, #EC4899)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>FitPro</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>AI Prescription System</div>
            </div>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-heading)', fontSize: 30, fontWeight: 800,
            color: 'var(--text)', margin: '0 0 6px', letterSpacing: '-0.5px',
          }}>
            Welcome back
          </h1>
          <p style={{
            fontSize: 14, color: 'var(--text-muted)', margin: '0 0 32px', lineHeight: 1.5,
          }}>
            Sign in to your coaching command center.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{
                display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text)',
                marginBottom: 6,
              }}>Email</label>
              <input
                className="input-field"
                type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="admin@fitpro.com"
                style={{
                  width: '100%', padding: '12px 16px', fontSize: 14,
                  borderRadius: 12, border: '1.5px solid rgba(0,0,0,0.06)',
                  background: 'rgba(255,255,255,0.8)',
                  transition: 'all 0.2s',
                  outline: 'none',
                }}
                onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.06)'; e.target.style.boxShadow = '' }}
              />
            </div>

            <div>
              <label style={{
                display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text)',
                marginBottom: 6,
              }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="input-field"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  style={{
                    width: '100%', padding: '12px 44px 12px 16px', fontSize: 14,
                    borderRadius: 12, border: '1.5px solid rgba(0,0,0,0.06)',
                    background: 'rgba(255,255,255,0.8)',
                    transition: 'all 0.2s',
                    outline: 'none',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.06)'; e.target.style.boxShadow = '' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#94A3B8', padding: 4, display: 'flex',
                  }}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: 10, fontSize: 13,
                background: 'rgba(244,63,94,0.08)', color: '#E11D48',
                border: '1px solid rgba(244,63,94,0.12)',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '13px 24px', marginTop: 4,
                borderRadius: 12, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                background: loading
                  ? 'linear-gradient(135deg, #6366F188, #8B5CF688)'
                  : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                color: 'white', fontWeight: 700, fontSize: 15,
                fontFamily: 'var(--font-sans)',
                boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
              onMouseEnter={e => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 8px 28px rgba(99,102,241,0.45)';
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.35)';
              }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                    display: 'inline-block',
                    animation: 'pulseGlow 1.5s ease-in-out infinite',
                  }} />
                  Signing in...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Sign in
                </>
              )}
            </button>

            <p style={{
              fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', margin: '12px 0 0',
            }}>
              Demo: <span style={{ fontWeight: 600, color: '#6366F1' }}>admin@fitpro.com</span> / <span style={{ fontWeight: 600, color: '#6366F1' }}>fitpro123</span>
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT — Brand Panel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 40, position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #0B0F19 0%, #1a1027 50%, #0f1a2e 100%)',
      }}>
        {/* Animated orbs */}
        <div style={{
          position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%)',
          top: -120, right: -120, animation: 'float 20s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', width: 350, height: 350, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236,72,153,0.08), transparent 70%)',
          bottom: -60, left: -80, animation: 'float 25s ease-in-out infinite reverse',
        }} />
        <div style={{
          position: 'absolute', width: 250, height: 250, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.06), transparent 70%)',
          top: '40%', right: '10%', animation: 'float 18s ease-in-out infinite 2s',
        }} />

        <div style={{ textAlign: 'center', maxWidth: 420, position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <div style={{
            width: 80, height: 80, borderRadius: 22, margin: '0 auto 28px',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1))',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 6,
            boxShadow: '0 0 40px rgba(99,102,241,0.15)',
          }}>
            <img src="/logo.png" alt="FitPro" style={{
              width: '100%', height: '100%', borderRadius: 16, objectFit: 'cover',
            }} />
          </div>

          <h2 style={{
            fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 700,
            color: 'white', margin: '0 0 12px',
          }}>
            AI-powered fitness coaching
          </h2>
          <p style={{
            fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, margin: '0 0 36px',
          }}>
            Generate personalised diet plans, track client adherence, and grow your coaching business — all from one intelligent workspace.
          </p>

          {/* Stats */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 48,
            paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.06)',
            marginBottom: 36,
          }}>
            {[
              { value: '28', label: 'Active clients' },
              { value: '142', label: 'AI plans' },
              { value: '89%', label: 'Adherence' },
            ].map((s, i) => (
              <div key={i}>
                <div style={{
                  fontSize: 30, fontWeight: 800,
                  background: 'linear-gradient(135deg, #6366F1, #EC4899)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' }}>
            {[
              { icon: Zap, text: 'AI-generated diet plans in seconds' },
              { icon: TrendingUp, text: 'Real-time adherence tracking' },
              { icon: Target, text: 'Smart recommendations powered by AI' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  color: 'rgba(255,255,255,0.5)', fontSize: 13,
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: 'rgba(16,185,129,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#10B981', flexShrink: 0,
                  }}>
                    <Icon size={13} />
                  </div>
                  {item.text}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }
        @media (max-width: 768px) {
          div > div:last-child { display: none; }
        }
      `}</style>
    </div>
  );
}
