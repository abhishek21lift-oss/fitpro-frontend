'use client';

import { useState } from 'react';
import {
  User, Mail, Bell, Shield, Download, Trash2,
  ChevronRight, Sparkles, Moon, Sun, Globe,
  Clock, Zap, Palette, Camera, Check,
} from 'lucide-react';

/* ─── Toggle ─── */
function Toggle({ on, onChange, color = '#2563EB' }: { on: boolean; onChange: (v: boolean) => void; color?: string }) {
  return (
    <div onClick={() => onChange(!on)} style={{
      width: 44, height: 24, borderRadius: 12, position: 'relative', cursor: 'pointer',
      transition: 'all 0.2s', flexShrink: 0,
      background: on ? `linear-gradient(135deg, ${color}, ${color}CC)` : 'rgba(0,0,0,0.06)',
      boxShadow: on ? `0 2px 8px ${color}30` : 'inset 0 1px 2px rgba(0,0,0,0.04)',
    }}>
      <div style={{
        width: 18, height: 18, borderRadius: 9, background: 'white',
        position: 'absolute', top: 3, transition: 'all 0.2s var(--ease)',
        left: on ? 23 : 3,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }} />
    </div>
  );
}

/* ─── Color theme ─── */
const themes = [
  { name: 'Ocean', primary: '#2563EB', gradient: 'linear-gradient(135deg, #2563EB, #1D4ED8)' },
  { name: 'Purple', primary: '#8B5CF6', gradient: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' },
  { name: 'Emerald', primary: '#10B981', gradient: 'linear-gradient(135deg, #10B981, #059669)' },
  { name: 'Sunset', primary: '#F59E0B', gradient: 'linear-gradient(135deg, #F59E0B, #F97316)' },
  { name: 'Rose', primary: '#F43F5E', gradient: 'linear-gradient(135deg, #F43F5E, #E11D48)' },
  { name: 'Cyan', primary: '#06B6D4', gradient: 'linear-gradient(135deg, #06B6D4, #0891B2)' },
];

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [whatsapp, setWhatsapp] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(0);

  return (
    <div className="page-content" style={{ animation: 'slideUp 0.4s var(--ease) both' }}>
      {/* Orbs */}
      <div className="orb orb-purple animate-float-slow" style={{ top: -60, right: -80 }} />
      <div className="orb orb-blue animate-float" style={{ bottom: 100, left: -60, animationDelay: '-3s' }} />

      {/* ─── Header ─── */}
      <header style={{ position: 'relative', zIndex: 1, marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14,
            background: 'linear-gradient(135deg, #8B5CF6, #2563EB)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
            boxShadow: '0 6px 20px rgba(139,92,246,0.25)',
          }}>
            <User size={22} />
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700,
            background: 'linear-gradient(135deg, var(--text) 40%, #8B5CF6 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            letterSpacing: '-0.4px',
          }}>
            Settings
          </h1>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Manage your profile, preferences, and account
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, position: 'relative', zIndex: 1, maxWidth: 900 }}>
        {/* ─── LEFT COLUMN ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Profile */}
          <div className="card" style={{ padding: 24, borderTop: '3px solid #8B5CF6' }}>
            <h3 style={{
              fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 700, color: 'var(--text)',
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20,
            }}>
              <span style={{ width: 4, height: 16, borderRadius: 2, background: 'linear-gradient(180deg, #8B5CF6, #7C3AED)' }} />
              Profile
            </h3>

            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 20 }}>
              <div style={{
                width: 64, height: 64, borderRadius: 18,
                background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: 20, fontWeight: 700,
                boxShadow: '0 4px 16px rgba(139,92,246,0.25)',
                position: 'relative',
              }}>
                AM
                <div style={{
                  position: 'absolute', bottom: -2, right: -2,
                  width: 22, height: 22, borderRadius: 7,
                  background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.08)', cursor: 'pointer',
                }}>
                  <Camera size={12} style={{ color: '#8B5CF6' }} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Dr. Arjun Mehta</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Senior Fitness Coach, CSCS</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <User size={13} style={{ color: '#8B5CF6' }} />
                  Full Name
                </label>
                <input className="input-field" defaultValue="Dr. Arjun Mehta" />
              </div>
              <div>
                <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Mail size={13} style={{ color: '#2563EB' }} />
                  Email
                </label>
                <input className="input-field" defaultValue="arjun@aifitness.in" />
              </div>
              <div>
                <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Globe size={13} style={{ color: '#10B981' }} />
                  Bio
                </label>
                <textarea
                  className="input-field"
                  style={{ minHeight: 72, resize: 'vertical' }}
                  defaultValue="Senior Fitness Coach with 10+ years of experience in strength training and sports nutrition. CSCS certified."
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
              <button className="btn btn-primary btn-sm" style={{ padding: '9px 22px' }}>
                <Check size={14} />
                Save Changes
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="card" style={{
            padding: 24, border: '1px solid rgba(239,68,68,0.15)',
            background: 'linear-gradient(135deg, rgba(239,68,68,0.02), transparent)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626',
              }}>
                <Shield size={16} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 700, color: '#DC2626' }}>
                Danger Zone
              </h3>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.5 }}>
              Export all your client data or permanently delete your account. These actions cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', borderRadius: 10, border: '1px solid rgba(0,0,0,0.06)',
                background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)',
                fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, color: 'var(--text)',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.95)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.8)' }}
              >
                <Download size={14} />
                Export Data
              </button>
              <button style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', borderRadius: 10, border: '1px solid rgba(239,68,68,0.2)',
                background: 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(239,68,68,0.02))',
                fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, color: '#DC2626',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(239,68,68,0.04))' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(239,68,68,0.02))' }}
              >
                <Trash2 size={14} />
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* ─── RIGHT COLUMN ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Preferences */}
          <div className="card" style={{ padding: 24, borderTop: '3px solid #10B981' }}>
            <h3 style={{
              fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 700, color: 'var(--text)',
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20,
            }}>
              <span style={{ width: 4, height: 16, borderRadius: 2, background: 'linear-gradient(180deg, #10B981, #059669)' }} />
              Preferences
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { icon: Bell, label: 'Email Notifications', desc: 'Receive updates when plans are generated or delivered', state: notifications, set: setNotifications, color: '#2563EB' },
                { icon: Zap, label: 'WhatsApp Delivery', desc: 'Enable WhatsApp as delivery channel', state: whatsapp, set: setWhatsapp, color: '#10B981' },
                { icon: Moon, label: 'Dark Mode', desc: 'Switch to dark theme for reduced eye strain', state: darkMode, set: setDarkMode, color: '#8B5CF6' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 14px', borderRadius: 12,
                  transition: 'all 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.01)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                    background: `linear-gradient(135deg, ${item.color}15, ${item.color}05)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color,
                  }}>
                    <item.icon size={16} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{item.desc}</div>
                  </div>
                  <Toggle on={item.state} onChange={item.set} color={item.color} />
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(0,0,0,0.04)' }}>
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <Clock size={13} style={{ color: '#F59E0B' }} />
                Default Plan Duration
              </label>
              <select className="input-field" defaultValue="12">
                <option value="4">4 weeks</option>
                <option value="8">8 weeks</option>
                <option value="12">12 weeks</option>
                <option value="16">16 weeks</option>
              </select>
            </div>
          </div>

          {/* Theme */}
          <div className="card" style={{ padding: 24, borderTop: '3px solid #F59E0B' }}>
            <h3 style={{
              fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 700, color: 'var(--text)',
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
            }}>
              <span style={{ width: 4, height: 16, borderRadius: 2, background: 'linear-gradient(180deg, #F59E0B, #F97316)' }} />
              <Palette size={15} style={{ color: '#F59E0B' }} />
              Theme Color
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {themes.map((t, i) => (
                <button key={i} onClick={() => setSelectedTheme(i)}
                  style={{
                    padding: '12px 8px', borderRadius: 10, border: 'none', cursor: 'pointer',
                    background: selectedTheme === i ? t.gradient : 'rgba(0,0,0,0.02)',
                    color: selectedTheme === i ? 'white' : 'var(--text)',
                    fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600,
                    transition: 'all 0.15s', textAlign: 'center',
                    boxShadow: selectedTheme === i ? `0 4px 12px ${t.primary}30` : 'none',
                  }}
                  onMouseEnter={e => { if (selectedTheme !== i) e.currentTarget.style.background = 'rgba(0,0,0,0.04)' }}
                  onMouseLeave={e => { if (selectedTheme !== i) e.currentTarget.style.background = 'rgba(0,0,0,0.02)' }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', margin: '0 auto 6px',
                    background: t.gradient,
                    boxShadow: selectedTheme === i ? '0 0 0 2px white, 0 0 0 3px rgba(0,0,0,0.1)' : 'none',
                  }} />
                  {t.name}
                  {selectedTheme === i && <Check size={10} style={{ display: 'block', margin: '4px auto 0', opacity: 0.8 }} />}
                </button>
              ))}
            </div>
          </div>

          {/* Account Info */}
          <div className="card" style={{ padding: 20, background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12, color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Account Type</span>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>Professional</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Client Limit</span>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>50</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Storage Used</span>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>2.4 GB / 10 GB</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Last Login</span>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
