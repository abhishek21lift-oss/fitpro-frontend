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
      setError(err.message || "Invalid email or password");
    }
    setLoading(false);
  }

  return (
    <div className="login-page-container" style={{
      minHeight: '100vh', display: 'flex',
      background: 'linear-gradient(135deg, #FFF5F5 0%, #FFFFFF 30%, #F0F4FF 60%, #FFF0F6 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background blobs */}
      <div style={{
        position: 'absolute', width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%, rgba(200,16,46,0.05), transparent 70%)',
        top: -100, left: '30%', pointerEvents: 'none', zIndex: 0,
        animation: 'float 20s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', width: 350, height: 350, borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%, rgba(255,107,107,0.04), transparent 70%)',
        bottom: '10%', right: '5%', pointerEvents: 'none', zIndex: 0,
        animation: 'float 25s ease-in-out infinite reverse',
      }} />
      <div style={{
        position: 'absolute', width: 250, height: 250, borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%, rgba(77,171,247,0.04), transparent 70%)',
        top: '20%', right: '40%', pointerEvents: 'none', zIndex: 0,
        animation: 'float 18s ease-in-out infinite 5s',
      }} />

      {/* LEFT — Brand Half */}
      <div className="login-brand-section" style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 60, position: 'relative', zIndex: 1,
        background: 'linear-gradient(135deg, rgba(200,16,46,0.02), rgba(255,107,107,0.01))',
        minHeight: '100vh',
      }}>
        <div style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 1s cubic-bezier(0.16,1,0.3,1)',
          textAlign: 'center',
        }}>
          {/* Large Logo */}
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 32 }}>
            <img src="/logo.png" alt="Coach Abhishek" style={{
              width: 220, height: 220, borderRadius: 48, objectFit: 'cover',
              boxShadow: '0 20px 80px rgba(200,16,46,0.15), 0 4px 20px rgba(200,16,46,0.06)',
            }} />
            <div style={{
              position: 'absolute', inset: -10,
              borderRadius: 56,
              border: '2px solid rgba(200,16,46,0.08)',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', inset: -18,
              borderRadius: 72,
              border: '1px solid rgba(200,16,46,0.04)',
              pointerEvents: 'none',
            }} />
          </div>

          <h1 style={{
            fontFamily: 'var(--font-heading)', fontSize: 36, fontWeight: 800,
            color: '#1a1a2e', margin: '0 0 4px', letterSpacing: '-0.5px',
          }}>
            Coach Abhishek
          </h1>
          <p style={{
            fontSize: 14, color: '#94A3B8', margin: '0 0 6px',
            letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 500,
          }}>
            Strength &bull; Motivation &bull; Trust
          </p>

          <div style={{
            width: 48, height: 3, borderRadius: 2,
            background: 'linear-gradient(90deg, #C8102E, #FF6B6B)',
            margin: '20px auto 24px',
          }} />

          <p style={{
            fontSize: 15, color: '#64748B', maxWidth: 360, lineHeight: 1.7,
            margin: '0 auto',
          }}>
            &ldquo;Transform Your Body, Transform Your Life&rdquo;
          </p>
        </div>
      </div>

      {/* RIGHT — Form Half */}
      <div className="login-form-section" style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 60, position: 'relative', zIndex: 1,
        minHeight: '100vh',
      }}>
        <div style={{
          width: '100%', maxWidth: 420,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 800,
            color: '#1a1a2e', margin: '0 0 4px', letterSpacing: '-0.5px',
          }}>
            Welcome Back
          </h2>
          <p style={{
            fontSize: 14, color: '#94A3B8', margin: '0 0 32px',
          }}>
            Sign in to access your coaching dashboard
          </p>

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
                required placeholder="you@example.com"
                style={{
                  width: '100%', padding: '14px 16px', fontSize: 14, fontFamily: 'var(--font-sans)',
                  borderRadius: 14, border: '1.5px solid #E2E8F0',
                  background: 'white', color: '#1a1a2e', outline: 'none',
                  transition: 'all 0.25s',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                }}
                onFocus={e => { e.target.style.borderColor = '#C8102E'; e.target.style.boxShadow = '0 0 0 4px rgba(200,16,46,0.06)'; e.target.style.background = '#FFFAFA' }}
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
                  onFocus={e => { e.target.style.borderColor = '#C8102E'; e.target.style.boxShadow = '0 0 0 4px rgba(200,16,46,0.06)'; e.target.style.background = '#FFFAFA' }}
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
                  style={{ width: 17, height: 17, accentColor: '#C8102E', borderRadius: 4, cursor: 'pointer' }}
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
                boxShadow: '0 4px 24px rgba(200,16,46,0.25)',
                transition: 'all 0.25s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
              onMouseEnter={e => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(200,16,46,0.35)';
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(200,16,46,0.25)';
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
          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #E2E8F0)' }} />
              <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500, whiteSpace: 'nowrap' }}>Or continue with</span>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, #E2E8F0, transparent)' }} />
            </div>

            <div className="login-social" style={{ display: 'flex', gap: 12 }}>
              {[
                { label: 'Google', icon: <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> },
                { label: 'Apple', icon: <svg width="18" height="18" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" fill="#1a1a2e"/></svg> },
              ].map((s, i) => (
                <button key={i} type="button" style={{
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
                  {s.icon}
                  {s.label}
                </button>
              ))}
            </div>
          </div>


        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(20px, -20px) rotate(90deg); }
          50% { transform: translate(-15px, 15px) rotate(180deg); }
          75% { transform: translate(25px, 10px) rotate(270deg); }
        }
        @media (max-width: 900px) {
          .login-page-container { flex-direction: column !important; }
          .login-brand-section { min-height: auto !important; padding: 48px 32px !important; }
          .login-form-section { min-height: auto !important; padding: 48px 32px !important; }
          .login-brand-section img { width: 140px; height: 140px; border-radius: 32px; }
          .login-brand-section h1 { font-size: 24px; }
          .login-form-section h2 { font-size: 24px; }
        }
        @media (max-width: 480px) {
          .login-brand-section { padding: 32px 20px !important; }
          .login-form-section { padding: 32px 20px !important; }
          .login-brand-section img { width: 100px; height: 100px; border-radius: 24px; }
          .login-brand-section h1 { font-size: 20px; }
          .login-form-section h2 { font-size: 20px; }
          .login-form-section button[type="submit"] { padding: 14px 20px; font-size: 14px; }
          .login-social button { padding: 11px 12px !important; font-size: 12px !important; }
        }
      `}</style>
    </div>
  );
}
