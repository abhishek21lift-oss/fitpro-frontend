"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Eye, EyeOff, TrendingUp, Dumbbell, Apple } from "lucide-react";
import { api } from "../../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

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
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
      background: 'linear-gradient(135deg, #0B0F19 0%, #12061a 40%, #0a1628 70%, #0B0F19 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background orbs */}
      {[
        { size: 600, top: -200, left: -100, color: 'rgba(99,102,241,0.06)' },
        { size: 500, bottom: -150, right: -100, color: 'rgba(236,72,153,0.05)' },
        { size: 300, top: '30%', right: '10%', color: 'rgba(245,158,11,0.04)' },
        { size: 250, bottom: '20%', left: '15%', color: 'rgba(16,185,129,0.03)' },
      ].map((orb, i) => (
        <div key={i} style={{
          position: 'absolute', width: orb.size, height: orb.size, borderRadius: '50%',
          background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
          ...(orb.top !== undefined ? { top: orb.top } : {}),
          ...(orb.bottom !== undefined ? { bottom: orb.bottom } : {}),
          ...(orb.right !== undefined ? { right: orb.right } : {}),
          ...(orb.left !== undefined ? { left: orb.left } : {}),
          animation: `float ${20 + i * 5}s ease-in-out ${i * 3}s infinite`,
          pointerEvents: 'none', zIndex: 0,
        }} />
      ))}

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 440,
        padding: '48px 40px 40px', borderRadius: 28,
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(32px)',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 16px 64px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)',
        position: 'relative', zIndex: 1,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(24px)',
        transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <img src="/logo.png" alt="FitPro" style={{
            width: 72, height: 72, objectFit: 'contain',
            filter: 'drop-shadow(0 0 30px rgba(99,102,241,0.25))',
          }} />
        </div>

        {/* Greeting */}
        <h1 style={{
          fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 800,
          color: 'white', textAlign: 'center', margin: '0 0 4px',
          letterSpacing: '-0.3px',
        }}>
          Welcome Back, Champion 💪
        </h1>
        <p style={{
          fontSize: 14, color: 'rgba(255,255,255,0.4)', textAlign: 'center',
          margin: '0 0 32px',
        }}>
          Access Your Coaching Dashboard
        </p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Email */}
          <div>
            <label style={{
              display: 'block', fontSize: 13, fontWeight: 600,
              color: 'rgba(255,255,255,0.6)', marginBottom: 7,
            }}>Email</label>
            <input
              type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              required placeholder="admin@fitpro.com"
              style={{
                width: '100%', padding: '13px 16px', fontSize: 14, fontFamily: 'var(--font-sans)',
                borderRadius: 12, border: '1.5px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.04)', color: 'white', outline: 'none',
                transition: 'all 0.25s',
              }}
              onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.background = 'rgba(99,102,241,0.06)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.04)'; e.target.style.boxShadow = '' }}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{
              display: 'block', fontSize: 13, fontWeight: 600,
              color: 'rgba(255,255,255,0.6)', marginBottom: 7,
            }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required placeholder="Enter your password"
                style={{
                  width: '100%', padding: '13px 44px 13px 16px', fontSize: 14, fontFamily: 'var(--font-sans)',
                  borderRadius: 12, border: '1.5px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.04)', color: 'white', outline: 'none',
                  transition: 'all 0.25s',
                }}
                onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.background = 'rgba(99,102,241,0.06)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.04)'; e.target.style.boxShadow = '' }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'rgba(255,255,255,0.3)', padding: 4, display: 'flex',
                }} tabIndex={-1}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{
              display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
              fontSize: 13, color: 'rgba(255,255,255,0.45)',
            }}>
              <input type="checkbox" defaultChecked
                style={{
                  width: 16, height: 16, accentColor: '#6366F1',
                  borderRadius: 4, cursor: 'pointer',
                }}
              />
              Remember Me
            </label>
            <button type="button" style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, color: '#818CF8', fontWeight: 600,
              fontFamily: 'var(--font-sans)', padding: 0,
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#A5B4FC'}
              onMouseLeave={e => e.currentTarget.style.color = '#818CF8'}
            >
              Forgot Password?
            </button>
          </div>

          {error && (
            <div style={{
              padding: '11px 14px', borderRadius: 10, fontSize: 13,
              background: 'rgba(244,63,94,0.1)', color: '#FB7185',
              border: '1px solid rgba(244,63,94,0.15)',
            }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={loading}
            style={{
              width: '100%', padding: '14px 24px',
              borderRadius: 12, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              background: loading
                ? 'linear-gradient(135deg, #6366F188, #EC489988)'
                : 'linear-gradient(135deg, #6366F1, #8B5CF6, #EC4899)',
              color: 'white', fontWeight: 700, fontSize: 15,
              fontFamily: 'var(--font-sans)',
              boxShadow: '0 4px 24px rgba(99,102,241,0.35)',
              transition: 'all 0.25s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              backgroundSize: '200% auto',
            }}
            onMouseEnter={e => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.5)';
                e.currentTarget.style.backgroundPosition = 'right center';
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(99,102,241,0.35)';
              e.currentTarget.style.backgroundPosition = 'left center';
            }}
          >
            {loading ? (
              <><span style={{ width: 8, height: 8, borderRadius: '50%', background: 'white', display: 'inline-block', animation: 'pulseGlow 1.5s ease-in-out infinite' }} /> Signing in...</>
            ) : (
              <><Sparkles size={16} /> ACCESS PORTAL</>
            )}
          </button>

          <p style={{
            fontSize: 12, color: 'rgba(255,255,255,0.25)', textAlign: 'center', margin: '4px 0 0',
          }}>
            Demo: <span style={{ fontWeight: 600, color: '#818CF8' }}>admin@fitpro.com</span> / <span style={{ fontWeight: 600, color: '#818CF8' }}>fitpro123</span>
          </p>
        </form>

        {/* Divider */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16, margin: '28px 0',
        }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}>
            Features
          </span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
        </div>

        {/* Feature list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { icon: TrendingUp, text: 'Client Progress Tracking', color: '#34D399' },
            { icon: Dumbbell, text: 'Workout Plans', color: '#818CF8' },
            { icon: Apple, text: 'Nutrition Programs', color: '#F472B6' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px', borderRadius: 10,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.04)',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(10px)',
                transition: `all 0.5s cubic-bezier(0.16,1,0.3,1) ${0.4 + i * 0.1}s`,
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                  background: `linear-gradient(135deg, ${item.color}15, ${item.color}08)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: item.color,
                }}>
                  <Icon size={14} />
                </div>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(25px, -20px) rotate(90deg); }
          50% { transform: translate(-15px, 15px) rotate(180deg); }
          75% { transform: translate(20px, 10px) rotate(270deg); }
        }
      `}</style>
    </div>
  );
}
