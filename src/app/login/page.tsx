"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Zap, TrendingUp, Target, Eye, EyeOff, CheckCircle } from "lucide-react";
import { api } from "../../lib/api";

const COLS = ['#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', '#F59E0B', '#10B981'];

function Particle({ i }: { i: number }) {
  const size = 2 + Math.random() * 4;
  const x = Math.random() * 100;
  const y = Math.random() * 100;
  const dur = 15 + Math.random() * 25;
  const del = Math.random() * 10;
  return (
    <div style={{
      position: 'absolute', left: `${x}%`, top: `${y}%`,
      width: size, height: size, borderRadius: '50%',
      background: COLS[i % COLS.length],
      opacity: 0.15 + Math.random() * 0.2,
      animation: `particleFloat ${dur}s ease-in-out ${del}s infinite`,
      pointerEvents: 'none',
    }} />
  );
}

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
      display: 'flex', minHeight: '100vh',
      background: 'linear-gradient(135deg, #0B0F19 0%, #12061a 30%, #0a1628 60%, #0B0F19 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Global particles */}
      {mounted && Array.from({ length: 20 }, (_, i) => <Particle key={i} i={i} />)}

      {/* Large gradient orbs */}
      <div style={{
        position: 'absolute', width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.08), transparent 70%)',
        top: -200, left: -100,
        animation: 'particleFloat 30s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(236,72,153,0.06), transparent 70%)',
        bottom: -150, right: -100,
        animation: 'particleFloat 25s ease-in-out infinite reverse',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,158,11,0.05), transparent 70%)',
        top: '40%', left: '30%',
        animation: 'particleFloat 20s ease-in-out infinite 5s',
        pointerEvents: 'none',
      }} />

      {/* LEFT — Form */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 40, position: 'relative', zIndex: 1,
      }}>
        <div style={{
          width: '100%', maxWidth: 420,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
        }}>
          {/* Logo + Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 44 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6, #EC4899)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
              padding: 4,
            }}>
              <img src="/logo.png" alt="" style={{ width: '100%', height: '100%', borderRadius: 10, objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 20,
                background: 'linear-gradient(135deg, #818CF8, #EC4899)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>FitPro</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 500, marginTop: 1 }}>
                AI Prescription System
              </div>
            </div>
          </div>

          {/* Form card */}
          <div style={{
            padding: '36px 32px', borderRadius: 24,
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 8px 48px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}>
            <h1 style={{
              fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 800,
              color: 'white', margin: '0 0 4px', letterSpacing: '-0.5px',
            }}>
              Welcome back
            </h1>
            <p style={{
              fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: '0 0 28px', lineHeight: 1.5,
            }}>
              Sign in to your coaching command center.
            </p>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{
                  display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)',
                  marginBottom: 7,
                }}>Email</label>
                <input
                  type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  required placeholder="admin@fitpro.com"
                  style={{
                    width: '100%', padding: '13px 16px', fontSize: 14,
                    borderRadius: 12, border: '1.5px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.04)',
                    color: 'white', outline: 'none',
                    transition: 'all 0.25s',
                    fontFamily: 'var(--font-sans)',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.background = 'rgba(99,102,241,0.06)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.04)'; e.target.style.boxShadow = '' }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)',
                  marginBottom: 7,
                }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required placeholder="Enter your password"
                    style={{
                      width: '100%', padding: '13px 44px 13px 16px', fontSize: 14,
                      borderRadius: 12, border: '1.5px solid rgba(255,255,255,0.08)',
                      background: 'rgba(255,255,255,0.04)',
                      color: 'white', outline: 'none',
                      transition: 'all 0.25s',
                      fontFamily: 'var(--font-sans)',
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

              {error && (
                <div style={{
                  padding: '11px 14px', borderRadius: 10, fontSize: 13,
                  background: 'rgba(244,63,94,0.1)', color: '#FB7185',
                  border: '1px solid rgba(244,63,94,0.15)',
                }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                style={{
                  width: '100%', padding: '14px 24px', marginTop: 4,
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
                  <><Sparkles size={16} /> Sign in</>
                )}
              </button>

              <p style={{
                fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'center', margin: '8px 0 0',
              }}>
                Demo: <span style={{ fontWeight: 600, color: '#818CF8' }}>admin@fitpro.com</span> / <span style={{ fontWeight: 600, color: '#818CF8' }}>fitpro123</span>
              </p>
            </form>
          </div>

          {/* Footer text */}
          <p style={{
            fontSize: 12, color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: 24,
          }}>
            &copy; 2026 FitPro. All rights reserved.
          </p>
        </div>
      </div>

      {/* RIGHT — Brand Panel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 40, position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #0a0f1e 0%, #140626 30%, #1a0a2e 50%, #0d1a2e 70%, #0a0f1e 100%)',
      }}>
        {/* Decorative grid */}
        <svg style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          opacity: 0.03, pointerEvents: 'none',
        }}>
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#818CF8" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Animated glow orbs */}
        {[
          { size: 450, top: -100, right: -80, color: 'rgba(99,102,241,0.1)', del: '0s' },
          { size: 350, bottom: -60, left: -60, color: 'rgba(236,72,153,0.07)', del: '-5s' },
          { size: 250, top: '35%', right: '15%', color: 'rgba(245,158,11,0.05)', del: '-10s' },
          { size: 200, bottom: '20%', right: '30%', color: 'rgba(16,185,129,0.04)', del: '-3s' },
        ].map((orb, i) => (
          <div key={i} style={{
            position: 'absolute', width: orb.size, height: orb.size, borderRadius: '50%',
            background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
            ...(orb.top !== undefined ? { top: orb.top } : {}),
            ...(orb.bottom !== undefined ? { bottom: orb.bottom } : {}),
            ...(orb.right !== undefined ? { right: orb.right } : {}),
            ...(orb.left !== undefined ? { left: orb.left } : {}),
            animation: `particleFloat ${20 + i * 5}s ease-in-out ${orb.del} infinite`,
            pointerEvents: 'none',
          }} />
        ))}

        <div style={{
          textAlign: 'center', maxWidth: 440, position: 'relative', zIndex: 1,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s',
        }}>
          {/* Logo */}
          <div style={{
            display: 'flex', justifyContent: 'center', marginBottom: 40,
            animation: mounted ? 'logoReveal 1s cubic-bezier(0.16,1,0.3,1) 0.3s both' : 'none',
          }}>
            <div style={{
              position: 'relative',
            }}>
              <img src="/logo.png" alt="FitPro" style={{
                width: 160, height: 160, objectFit: 'contain',
                filter: 'drop-shadow(0 0 40px rgba(99,102,241,0.3))',
              }} />
              <div style={{
                position: 'absolute', inset: -20,
                background: 'radial-gradient(circle, rgba(99,102,241,0.08), transparent 70%)',
                borderRadius: '50%',
                animation: 'pulseGlow 3s ease-in-out infinite',
                pointerEvents: 'none',
              }} />
            </div>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700,
            margin: '0 0 14px',
            background: 'linear-gradient(135deg, #A5B4FC, #C084FC, #F472B6, #FB923C)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            backgroundSize: '200% auto',
            animation: 'gradientShift 8s ease infinite',
          }}>
            AI-Powered Fitness Coaching
          </h2>
          <p style={{
            fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.8, margin: '0 0 40px',
          }}>
            Generate personalised diet plans, track client adherence, and grow your coaching business — all from one intelligent workspace.
          </p>

          {/* Stats */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 56,
            paddingTop: 36, borderTop: '1px solid rgba(255,255,255,0.06)',
            marginBottom: 40,
          }}>
            {[
              { value: '28', label: 'Active clients' },
              { value: '142', label: 'AI plans' },
              { value: '89%', label: 'Adherence' },
            ].map((s, i) => (
              <div key={i} style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(15px)',
                transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${0.4 + i * 0.15}s`,
              }}>
                <div style={{
                  fontSize: 32, fontWeight: 800,
                  background: [ '#6366F1', '#EC4899', '#10B981' ][i],
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 10,
            maxWidth: 360, margin: '0 auto',
          }}>
            {[
              { icon: Zap, text: 'AI-generated diet & workout plans in seconds', color: '#818CF8' },
              { icon: TrendingUp, text: 'Real-time adherence & progress tracking', color: '#34D399' },
              { icon: Target, text: 'Smart recommendations powered by AI', color: '#F472B6' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 16px', borderRadius: 12,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateX(0)' : 'translateX(-15px)',
                  transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${0.6 + i * 0.12}s`,
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    background: `linear-gradient(135deg, ${item.color}20, ${item.color}08)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: item.color,
                  }}>
                    <Icon size={15} />
                  </div>
                  <span style={{
                    fontSize: 13, color: 'rgba(255,255,255,0.55)', fontWeight: 500,
                  }}>
                    {item.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes particleFloat {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(20px, -25px) rotate(90deg); }
          50% { transform: translate(-15px, 15px) rotate(180deg); }
          75% { transform: translate(25px, 10px) rotate(270deg); }
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 100% center; }
        }
        @keyframes logoReveal {
          0% { opacity: 0; transform: scale(0.8) rotate(-5deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @media (max-width: 768px) {
          div > div:last-child { display: none; }
        }
      `}</style>
    </div>
  );
}
