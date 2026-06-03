"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
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
      background: 'linear-gradient(135deg, #FFF5F5 0%, #FFFFFF 30%, #F0F4FF 60%, #FFF0F6 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Gradient mesh background */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
        <defs>
          <pattern id="mesh" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(200,16,46,0.02)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mesh)" />
      </svg>

      {/* Fitness silhouettes */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.02, pointerEvents: 'none', zIndex: 0 }}>
        <defs>
          <pattern id="figures" x="0" y="0" width="140" height="140" patternUnits="userSpaceOnUse">
            <g transform="scale(0.45)" fill="#C8102E" opacity="0.3">
              <circle cx="70" cy="30" r="10" />
              <path d="M60 42l-6 28c-1 3 1 6 4 7l14 3 5 18c1 3 4 5 7 4s4-4 3-7l-6-21c-1-3-4-5-7-4l-12-3 5-24c1-3-1-6-4-7s-6 1-7 4zm28-3c-3-1-6 1-7 4l-5 24 12 3c3 1 6-1 7-4l5-24c1-3-1-6-4-7z"/>
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#figures)" />
      </svg>

      {/* Floating colorful gradient blobs */}
      {[
        { size: 350, top: -80, left: -60, colors: ['rgba(200,16,46,0.06)', 'rgba(255,107,107,0.04)', 'transparent'], delay: '0s' },
        { size: 300, top: '10%', right: -60, colors: ['rgba(255,159,67,0.05)', 'rgba(255,107,107,0.03)', 'transparent'], delay: '-3s' },
        { size: 250, bottom: '15%', left: '20%', colors: ['rgba(77,171,247,0.05)', 'rgba(255,229,229,0.04)', 'transparent'], delay: '-6s' },
        { size: 200, bottom: '30%', right: '15%', colors: ['rgba(200,16,46,0.04)', 'rgba(255,229,229,0.03)', 'transparent'], delay: '-9s' },
        { size: 180, top: '50%', left: '5%', colors: ['rgba(255,159,67,0.03)', 'transparent', 'transparent'], delay: '-4s' },
      ].map((blob, i) => (
        <div key={i} style={{
          position: 'absolute', width: blob.size, height: blob.size, borderRadius: '50%',
          background: `radial-gradient(circle at 30% 30%, ${blob.colors[0]}, ${blob.colors[1]}, ${blob.colors[2]})`,
          ...(blob.top !== undefined ? { top: blob.top } : {}),
          ...(blob.bottom !== undefined ? { bottom: blob.bottom } : {}),
          ...(blob.right !== undefined ? { right: blob.right } : {}),
          ...(blob.left !== undefined ? { left: blob.left } : {}),
          animation: `float ${25 + i * 5}s ease-in-out ${blob.delay} infinite`,
          pointerEvents: 'none', zIndex: 0,
        }} />
      ))}

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 440,
        padding: '48px 40px 40px', borderRadius: 28,
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        border: '1px solid rgba(255,255,255,0.8)',
        boxShadow: '0 20px 60px rgba(200,16,46,0.06), 0 8px 24px rgba(0,0,0,0.04), 0 0 0 1px rgba(200,16,46,0.03)',
        position: 'relative', zIndex: 1,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)',
        transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <div style={{ position: 'relative' }}>
            <img src="/logo.png" alt="Coach Abhishek" style={{
              width: 88, height: 88, borderRadius: 24, objectFit: 'cover',
              boxShadow: '0 8px 32px rgba(200,16,46,0.12), 0 2px 8px rgba(200,16,46,0.06)',
            }} />
            <div style={{
              position: 'absolute', inset: -6,
              borderRadius: 30,
              border: '1.5px solid rgba(200,16,46,0.08)',
              pointerEvents: 'none',
            }} />
          </div>
        </div>

        {/* Greeting */}
        <h1 style={{
          fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 800,
          color: '#1a1a2e', textAlign: 'center', margin: '0 0 4px',
          letterSpacing: '-0.5px',
        }}>
          Welcome Back
        </h1>
        <p style={{
          fontSize: 13, color: '#94A3B8', textAlign: 'center',
          margin: '0 0 4px', letterSpacing: '2px', textTransform: 'uppercase',
          fontWeight: 500,
        }}>
          Strength &bull; Motivation &bull; Trust
        </p>

        {/* Decorative divider */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          margin: '14px auto 28px',
        }}>
          <span style={{ width: 24, height: 2, borderRadius: 2, background: 'linear-gradient(90deg, transparent, #C8102E)' }} />
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C8102E', opacity: 0.3 }} />
          <span style={{ width: 24, height: 2, borderRadius: 2, background: 'linear-gradient(90deg, #C8102E, transparent)' }} />
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Email */}
          <div>
            <label style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6,
            }}>
              <Mail size={14} style={{ color: '#C8102E', opacity: 0.6 }} />
              Email Address
            </label>
            <input
              type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              required placeholder="admin@fitpro.com"
              style={{
                width: '100%', padding: '14px 16px', fontSize: 14, fontFamily: 'var(--font-sans)',
                borderRadius: 14, border: '1.5px solid #E2E8F0',
                background: 'white', color: '#1a1a2e', outline: 'none',
                transition: 'all 0.25s',
                letterSpacing: '0.2px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
              }}
              onFocus={e => { e.target.style.borderColor = '#C8102E'; e.target.style.boxShadow = '0 0 0 4px rgba(200,16,46,0.06), 0 1px 2px rgba(0,0,0,0.02)'; e.target.style.background = '#FFFAFA' }}
              onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)'; e.target.style.background = 'white' }}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6,
            }}>
              <Lock size={14} style={{ color: '#C8102E', opacity: 0.6 }} />
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required placeholder="Enter your password"
                style={{
                  width: '100%', padding: '14px 48px 14px 16px', fontSize: 14, fontFamily: 'var(--font-sans)',
                  borderRadius: 14, border: '1.5px solid #E2E8F0',
                  background: 'white', color: '#1a1a2e', outline: 'none',
                  transition: 'all 0.25s',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                }}
                onFocus={e => { e.target.style.borderColor = '#C8102E'; e.target.style.boxShadow = '0 0 0 4px rgba(200,16,46,0.06), 0 1px 2px rgba(0,0,0,0.02)'; e.target.style.background = '#FFFAFA' }}
                onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)'; e.target.style.background = 'white' }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#94A3B8', padding: 4, display: 'flex',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#64748B'}
                onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: -2 }}>
            <label style={{
              display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
              fontSize: 13, color: '#64748B',
            }}>
              <input type="checkbox" defaultChecked
                style={{
                  width: 17, height: 17, accentColor: '#C8102E',
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
              onMouseEnter={e => e.currentTarget.style.color = '#FF6B6B'}
              onMouseLeave={e => e.currentTarget.style.color = '#C8102E'}
            >
              Forgot Password?
            </button>
          </div>

          {error && (
            <div style={{
              padding: '12px 16px', borderRadius: 12, fontSize: 13,
              background: '#FFF0F0', color: '#C8102E',
              border: '1px solid rgba(200,16,46,0.1)',
            }}>
              {error}
            </div>
          )}

          {/* Sign In */}
          <button type="submit" disabled={loading}
            style={{
              width: '100%', padding: '16px 24px', marginTop: 2,
              borderRadius: 14, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              background: loading
                ? 'linear-gradient(135deg, rgba(200,16,46,0.6), rgba(255,107,107,0.6))'
                : 'linear-gradient(135deg, #C8102E 0%, #FF6B6B 100%)',
              color: 'white', fontWeight: 700, fontSize: 15,
              fontFamily: 'var(--font-sans)',
              letterSpacing: '0.5px',
              boxShadow: '0 4px 24px rgba(200,16,46,0.25), 0 2px 8px rgba(200,16,46,0.1)',
              transition: 'all 0.25s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
            onMouseEnter={e => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(200,16,46,0.35), 0 2px 8px rgba(200,16,46,0.15)';
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(200,16,46,0.25), 0 2px 8px rgba(200,16,46,0.1)';
            }}
          >
            {loading ? (
              <><span style={{ width: 8, height: 8, borderRadius: '50%', background: 'white', display: 'inline-block', animation: 'pulseGlow 1.5s ease-in-out infinite' }} /> Signing In...</>
            ) : (
              <>Sign In</>
            )}
          </button>
        </form>

        {/* Social Login */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #E2E8F0)' }} />
            <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500, whiteSpace: 'nowrap' }}>
              Or continue with
            </span>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, #E2E8F0, transparent)' }} />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="button" style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: '13px 16px', borderRadius: 14,
              background: 'white', border: '1.5px solid #E2E8F0',
              color: '#334155', cursor: 'pointer',
              fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600,
              transition: 'all 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8102E'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(200,16,46,0.06)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)' }}
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
              padding: '13px 16px', borderRadius: 14,
              background: 'white', border: '1.5px solid #E2E8F0',
              color: '#334155', cursor: 'pointer',
              fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600,
              transition: 'all 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8102E'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(200,16,46,0.06)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" fill="#1a1a2e"/>
              </svg>
              Apple
            </button>
          </div>
        </div>

        {/* Motivational quote */}
        <div style={{
          marginTop: 24, padding: '16px 20px', borderRadius: 16,
          background: 'linear-gradient(135deg, #FFE5E5 0%, #FFF0F0 50%, #FFFAFA 100%)',
          border: '1px solid rgba(200,16,46,0.06)',
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: 13, color: '#C8102E', fontWeight: 600, margin: 0,
            letterSpacing: '0.3px', fontStyle: 'italic',
          }}>
            &ldquo;Transform Your Body, Transform Your Life&rdquo;
          </p>
        </div>

        {/* Demo hint */}
        <p style={{
          fontSize: 12, color: '#94A3B8', textAlign: 'center', marginTop: 16,
        }}>
          Demo: <span style={{ color: '#C8102E', fontWeight: 600 }}>admin@fitpro.com</span> / <span style={{ color: '#C8102E', fontWeight: 600 }}>fitpro123</span>
        </p>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(15px, -20px) rotate(90deg); }
          50% { transform: translate(-10px, 10px) rotate(180deg); }
          75% { transform: translate(20px, 8px) rotate(270deg); }
        }
        @media (max-width: 480px) {
          div > div:last-child { padding: 36px 24px 32px; }
        }
      `}</style>
    </div>
  );
}
