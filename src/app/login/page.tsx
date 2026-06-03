"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Dumbbell } from "lucide-react";
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
      background: '#0A0A0A',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Subtle fitness silhouette pattern */}
      <svg style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        opacity: 0.03, pointerEvents: 'none', zIndex: 0,
      }}>
        <defs>
          <pattern id="silhouette" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
            <g transform="scale(0.4)" fill="white">
              <path d="M60 10c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9zm-4 14l-8 36c-1 3 1 6 4 7l18 4 6 22c1 3 4 5 7 4s4-4 3-7l-7-25c-1-3-4-5-7-4l-16-4 6-28c1-3-1-6-4-7s-6 1-7 4zm32-4c-3-1-6 1-7 4l-6 28 16 4c3 1 6-1 7-4l6-28c1-3-1-6-4-7z"/>
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#silhouette)" />
      </svg>

      {/* Red glow orbs */}
      {[
        { size: 500, top: -180, right: -120, opacity: 0.12 },
        { size: 400, bottom: -150, left: -100, opacity: 0.08 },
        { size: 250, top: '40%', left: '5%', opacity: 0.05 },
        { size: 200, bottom: '25%', right: '10%', opacity: 0.06 },
      ].map((orb, i) => (
        <div key={i} style={{
          position: 'absolute', width: orb.size, height: orb.size, borderRadius: '50%',
          background: `radial-gradient(circle, rgba(200,16,46,${orb.opacity}), transparent 70%)`,
          ...(orb.top !== undefined ? { top: orb.top } : {}),
          ...(orb.bottom !== undefined ? { bottom: orb.bottom } : {}),
          ...(orb.right !== undefined ? { right: orb.right } : {}),
          ...(orb.left !== undefined ? { left: orb.left } : {}),
          animation: `float ${25 + i * 5}s ease-in-out ${i * 4}s infinite`,
          pointerEvents: 'none', zIndex: 0,
        }} />
      ))}

      {/* Red accent lines */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: 'linear-gradient(90deg, transparent, #C8102E, #8B0000, #C8102E, transparent)',
        zIndex: 2, opacity: 0.6,
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
        background: 'linear-gradient(90deg, transparent, #C8102E, #8B0000, #C8102E, transparent)',
        zIndex: 2, opacity: 0.6,
      }} />

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 420,
        padding: '44px 36px 36px', borderRadius: 24,
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 40px rgba(200,16,46,0.06), inset 0 1px 0 rgba(255,255,255,0.04)',
        position: 'relative', zIndex: 1,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1)',
      }}>
        {/* Card red accent top */}
        <div style={{
          position: 'absolute', top: 0, left: '20%', right: '20%', height: 2.5,
          background: 'linear-gradient(90deg, transparent, #C8102E, #8B0000, #C8102E, transparent)',
          borderTopLeftRadius: 24, borderTopRightRadius: 24,
          opacity: 0.5,
        }} />

        {/* Logo */}
        <div style={{
          display: 'flex', justifyContent: 'center', marginBottom: 28,
        }}>
          <div style={{ position: 'relative' }}>
            <img src="/logo.png" alt="Coach Abhishek" style={{
              width: 80, height: 80, borderRadius: 20, objectFit: 'cover',
              boxShadow: '0 0 40px rgba(200,16,46,0.15), 0 8px 32px rgba(0,0,0,0.3)',
            }} />
            <div style={{
              position: 'absolute', inset: -8,
              borderRadius: 28,
              border: '1.5px solid rgba(200,16,46,0.15)',
              pointerEvents: 'none',
            }} />
          </div>
        </div>

        {/* Greeting */}
        <h1 style={{
          fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 800,
          color: 'white', textAlign: 'center', margin: '0 0 3px',
          letterSpacing: '-0.3px',
        }}>
          Welcome Back
        </h1>
        <p style={{
          fontSize: 13, color: 'rgba(255,255,255,0.3)', textAlign: 'center',
          margin: '0 0 6px', letterSpacing: '1.5px', textTransform: 'uppercase',
          fontWeight: 500,
        }}>
          Strength &bull; Motivation &bull; Trust
        </p>

        <div style={{
          width: 40, height: 2.5, borderRadius: 2,
          background: 'linear-gradient(90deg, #C8102E, #8B0000)',
          margin: '10px auto 28px',
          opacity: 0.4,
        }} />

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Email */}
          <div>
            <label style={{
              display: 'block', fontSize: 12, fontWeight: 600,
              color: 'rgba(255,255,255,0.5)', marginBottom: 6,
              letterSpacing: '0.5px', textTransform: 'uppercase',
            }}>Email</label>
            <input
              type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              required placeholder="admin@fitpro.com"
              style={{
                width: '100%', padding: '14px 16px', fontSize: 14, fontFamily: 'var(--font-sans)',
                borderRadius: 14, border: '1.5px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.03)', color: 'white', outline: 'none',
                transition: 'all 0.25s',
                letterSpacing: '0.2px',
              }}
              onFocus={e => { e.target.style.borderColor = '#C8102E'; e.target.style.background = 'rgba(200,16,46,0.04)'; e.target.style.boxShadow = '0 0 0 3px rgba(200,16,46,0.08)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.06)'; e.target.style.background = 'rgba(255,255,255,0.03)'; e.target.style.boxShadow = '' }}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{
              display: 'block', fontSize: 12, fontWeight: 600,
              color: 'rgba(255,255,255,0.5)', marginBottom: 6,
              letterSpacing: '0.5px', textTransform: 'uppercase',
            }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required placeholder="Enter your password"
                style={{
                  width: '100%', padding: '14px 48px 14px 16px', fontSize: 14, fontFamily: 'var(--font-sans)',
                  borderRadius: 14, border: '1.5px solid rgba(255,255,255,0.06)',
                  background: 'rgba(255,255,255,0.03)', color: 'white', outline: 'none',
                  transition: 'all 0.25s',
                }}
                onFocus={e => { e.target.style.borderColor = '#C8102E'; e.target.style.background = 'rgba(200,16,46,0.04)'; e.target.style.boxShadow = '0 0 0 3px rgba(200,16,46,0.08)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.06)'; e.target.style.background = 'rgba(255,255,255,0.03)'; e.target.style.boxShadow = '' }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'rgba(255,255,255,0.25)', padding: 4, display: 'flex',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
            <label style={{
              display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
              fontSize: 13, color: 'rgba(255,255,255,0.4)',
            }}>
              <input type="checkbox" defaultChecked
                style={{
                  width: 16, height: 16, accentColor: '#C8102E',
                  borderRadius: 4, cursor: 'pointer',
                }}
              />
              Remember Me
            </label>
            <button type="button" style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, color: '#C8102E', fontWeight: 600,
              fontFamily: 'var(--font-sans)', padding: 0,
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#E8444A'}
              onMouseLeave={e => e.currentTarget.style.color = '#C8102E'}
            >
              Forgot Password?
            </button>
          </div>

          {error && (
            <div style={{
              padding: '11px 14px', borderRadius: 10, fontSize: 13,
              background: 'rgba(200,16,46,0.08)', color: '#E8444A',
              border: '1px solid rgba(200,16,46,0.12)',
            }}>
              {error}
            </div>
          )}

          {/* Sign In */}
          <button type="submit" disabled={loading}
            style={{
              width: '100%', padding: '15px 24px', marginTop: 4,
              borderRadius: 14, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              background: loading
                ? 'linear-gradient(135deg, rgba(200,16,46,0.5), rgba(139,0,0,0.5))'
                : 'linear-gradient(135deg, #C8102E, #8B0000)',
              color: 'white', fontWeight: 800, fontSize: 14,
              fontFamily: 'var(--font-sans)',
              letterSpacing: '1px', textTransform: 'uppercase',
              boxShadow: '0 4px 24px rgba(200,16,46,0.3)',
              transition: 'all 0.25s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
            onMouseEnter={e => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 36px rgba(200,16,46,0.45)';
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(200,16,46,0.3)';
            }}
          >
            {loading ? (
              <><span style={{ width: 8, height: 8, borderRadius: '50%', background: 'white', display: 'inline-block', animation: 'pulseGlow 1.5s ease-in-out infinite' }} /> SIGNING IN...</>
            ) : (
              <>SIGN IN</>
            )}
          </button>
        </form>

        {/* Social Login */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}>
              or continue with
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: '11px 16px', borderRadius: 12,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
              fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600,
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button type="button" style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: '11px 16px', borderRadius: 12,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
              fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600,
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" fill="currentColor"/>
              </svg>
              Apple
            </button>
          </div>
        </div>

        {/* Demo hint */}
        <p style={{
          fontSize: 12, color: 'rgba(255,255,255,0.15)', textAlign: 'center', marginTop: 20,
        }}>
          Demo: <span style={{ color: '#C8102E', fontWeight: 600 }}>admin@fitpro.com</span> / <span style={{ color: '#C8102E', fontWeight: 600 }}>fitpro123</span>
        </p>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(20px, -25px) rotate(90deg); }
          50% { transform: translate(-15px, 15px) rotate(180deg); }
          75% { transform: translate(25px, 10px) rotate(270deg); }
        }
        @media (max-width: 480px) {
          div > div:last-child > div { padding: 36px 24px 28px; }
        }
      `}</style>
    </div>
  );
}
