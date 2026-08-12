'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Microscope,
  TrendingUp,
  CloudSun,
  Droplets,
  Leaf,
  Phone,
  Bell,
  Globe,
  Users,
  Upload,
  Cpu,
  CheckCircle,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* FLOATING PILL NAVBAR */}
      <nav className="ks-nav" style={{ position: 'fixed', top: '16px', left: '50%', transform: 'translateX(-50%)', zIndex: 50, width: '90%', maxWidth: '1200px', backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', borderRadius: '999px', padding: '0.75rem 1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)' }}>
        <div className="ks-nav-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <Link href="/" className="ks-nav-logo" style={{ fontWeight: 800, fontSize: '1.25rem', color: '#1a1c18', textDecoration: 'none', letterSpacing: '-0.02em' }}>
              KisanSeva
            </Link>
            
            <div className="ks-nav-links" style={{ display: 'flex' }}>
              <ul style={{ display: 'flex', gap: '1.5rem', listStyle: 'none', margin: 0, padding: 0 }}>
                <li><Link href="/" style={{ textDecoration: 'none', color: 'var(--color-ink-mid, #4a4d46)', fontWeight: 500, fontSize: '0.9rem' }}>Home</Link></li>
                <li><Link href="/diagnose" style={{ textDecoration: 'none', color: 'var(--color-ink-mid, #4a4d46)', fontWeight: 500, fontSize: '0.9rem' }}>Crops</Link></li>
                <li><Link href="/market" style={{ textDecoration: 'none', color: 'var(--color-ink-mid, #4a4d46)', fontWeight: 500, fontSize: '0.9rem' }}>Markets</Link></li>
                <li><Link href="/schedule" style={{ textDecoration: 'none', color: 'var(--color-ink-mid, #4a4d46)', fontWeight: 500, fontSize: '0.9rem' }}>Weather</Link></li>
                <li><Link href="/dashboard" style={{ textDecoration: 'none', color: 'var(--color-ink-mid, #4a4d46)', fontWeight: 500, fontSize: '0.9rem' }}>Dashboard</Link></li>
              </ul>
            </div>
          </div>

          <div className="ks-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
             <Link href="/login" className="btn btn-outline btn-sm" style={{ padding: '0.4rem 1rem', borderRadius: '999px', border: '1px solid #d1d5db', textDecoration: 'none', color: '#1a1c18', fontSize: '0.875rem', fontWeight: 600 }}>Login</Link>
             <Link href="/login" className="btn btn-primary btn-sm" style={{ padding: '0.4rem 1rem', borderRadius: '999px', backgroundColor: '#326b00', color: 'white', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>Register</Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero-bg" style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '88px', background: 'radial-gradient(circle at top, rgba(251, 191, 36, 0.15) 0%, rgba(50, 107, 0, 0.05) 50%, transparent 100%)', position: 'relative', overflow: 'hidden' }}>
        
        <div style={{ maxWidth: '900px', width: '100%', padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', zIndex: 10 }}>
          <div className="section-eyebrow" style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: '999px', backgroundColor: 'rgba(50,107,0,0.1)', color: '#326b00', border: '1px solid rgba(50,107,0,0.2)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
            Track 03 · AgriTech · IEMH4-AG-01
          </div>
          
          <h1 style={{ fontSize: 'clamp(2.75rem, 6vw, 4.5rem)', fontWeight: 800, color: '#1a1c18', letterSpacing: '-0.03em', lineHeight: 1.08, margin: '0 0 1.5rem 0' }}>
            Empower your farm,<br />grow your future
          </h1>
          
          <p style={{ color: 'var(--color-ink-mid, #4a4d46)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 0 2.5rem 0', lineHeight: 1.6 }}>
            Track prices, get weather updates, and manage crops all in one place.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/market" className="btn btn-outline btn-lg" style={{ display: 'inline-flex', alignItems: 'center', padding: '0.75rem 1.5rem', borderRadius: '8px', border: '2px solid #e5e7eb', textDecoration: 'none', color: '#1a1c18', fontSize: '1rem', fontWeight: 600 }}>
              Monitor Prices
            </Link>
            <Link href="/diagnose" className="btn btn-primary btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '8px', backgroundColor: '#326b00', color: 'white', textDecoration: 'none', fontSize: '1rem', fontWeight: 600 }}>
              <Microscope size={20} />
              Diagnose Crop
            </Link>
          </div>
        </div>

        {/* Clean SVG Farm Line-art Illustration */}
        <div style={{ width: '100%', height: '260px', marginTop: 'auto', position: 'absolute', bottom: 0, left: 0, zIndex: 1 }}>
          <svg width="100%" height="100%" viewBox="0 0 1440 260" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,200 C320,100 640,300 960,150 C1280,0 1440,150 1440,150 L1440,260 L0,260 Z" fill="rgba(50, 107, 0, 0.03)" />
            <path d="M0,200 C320,100 640,300 960,150 C1280,0 1440,150 1440,150" stroke="#326b00" strokeWidth="2" strokeOpacity="0.15" fill="none" />
            <path d="M200,220 C250,200 300,230 350,210" stroke="#326b00" strokeWidth="1.5" strokeOpacity="0.15" fill="none" strokeDasharray="4 4" />
            <path d="M400,240 C450,220 500,250 550,230" stroke="#326b00" strokeWidth="1.5" strokeOpacity="0.15" fill="none" strokeDasharray="4 4" />
            <path d="M1000,180 C1050,160 1100,190 1150,170" stroke="#326b00" strokeWidth="1.5" strokeOpacity="0.15" fill="none" strokeDasharray="4 4" />
            {/* Minimal Tractor */}
            <g opacity="0.15" transform="translate(700, 200)">
              <rect x="0" y="10" width="40" height="20" rx="4" stroke="#326b00" strokeWidth="2" fill="none" />
              <circle cx="10" cy="35" r="8" stroke="#326b00" strokeWidth="2" fill="none" />
              <circle cx="35" cy="32" r="12" stroke="#326b00" strokeWidth="2" fill="none" />
              <path d="M5,10 L10,0 L25,0 L30,10" stroke="#326b00" strokeWidth="2" fill="none" />
            </g>
            {/* Minimal Plants */}
            <g opacity="0.15" transform="translate(250, 210)">
              <path d="M10,20 Q10,10 5,5 M10,20 Q10,10 15,5 M10,20 L10,0" stroke="#326b00" strokeWidth="1.5" fill="none" />
            </g>
            <g opacity="0.15" transform="translate(450, 230)">
              <path d="M10,20 Q10,10 5,5 M10,20 Q10,10 15,5 M10,20 L10,0" stroke="#326b00" strokeWidth="1.5" fill="none" />
            </g>
            <g opacity="0.15" transform="translate(1050, 165)">
              <path d="M10,20 Q10,10 5,5 M10,20 Q10,10 15,5 M10,20 L10,0" stroke="#326b00" strokeWidth="1.5" fill="none" />
            </g>
          </svg>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section style={{ backgroundColor: 'var(--color-bg, #f9fafb)', padding: '80px 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="section-eyebrow" style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: '999px', backgroundColor: 'rgba(50,107,0,0.1)', color: '#326b00', border: '1px solid rgba(50,107,0,0.2)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '1rem' }}>
              ● AGRI INTELLIGENCE PLATFORM
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1a1c18', margin: '0 0 1rem 0', letterSpacing: '-0.02em' }}>
              Engineered for Indian Smallholder Farmers
            </h2>
            <p style={{ color: 'var(--color-ink-mid, #4a4d46)', fontSize: '1.125rem', maxWidth: '700px', margin: '0 auto' }}>
              Secure, data-driven tools built to help 140 million smallholder farmers make better decisions.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            
            {/* Feature 1 */}
            <div className="feature-card" style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ padding: '0.75rem', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                  <Microscope size={24} />
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6b7280', letterSpacing: '0.05em', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px' }}>AI ENGINE</span>
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#1a1c18' }}>Crop Disease AI</h3>
                <p style={{ fontSize: '0.9rem', color: '#4a4d46', margin: 0, lineHeight: 1.5 }}>Upload a photo — get disease name, confidence score, and treatment plan in under 5 seconds.</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: 'auto', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.75rem', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', color: '#4b5563' }}>38 Diseases</span>
                <span style={{ fontSize: '0.75rem', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', color: '#4b5563' }}>MobileNetV3</span>
                <span style={{ fontSize: '0.75rem', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', color: '#4b5563' }}>&lt;5s Result</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="feature-card" style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ padding: '0.75rem', backgroundColor: '#fffbeb', color: '#d97706', borderRadius: '12px', border: '1px solid #fde68a' }}>
                  <TrendingUp size={24} />
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6b7280', letterSpacing: '0.05em', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px' }}>LIVE MARKET</span>
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#1a1c18' }}>Live Mandi Prices</h3>
                <p style={{ fontSize: '0.9rem', color: '#4a4d46', margin: 0, lineHeight: 1.5 }}>Real-time Agmarknet prices across 500+ mandis with net-value ranking and distance-based filtering.</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: 'auto', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.75rem', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', color: '#4b5563' }}>Agmarknet Live</span>
                <span style={{ fontSize: '0.75rem', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', color: '#4b5563' }}>500+ Mandis</span>
                <span style={{ fontSize: '0.75rem', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', color: '#4b5563' }}>Distance Ranked</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="feature-card" style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ padding: '0.75rem', backgroundColor: '#ecfeff', color: '#0891b2', borderRadius: '12px', border: '1px solid #a5f3fc' }}>
                  <CloudSun size={24} />
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6b7280', letterSpacing: '0.05em', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px' }}>WEATHER AI</span>
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#1a1c18' }}>Weather Advisory</h3>
                <p style={{ fontSize: '0.9rem', color: '#4a4d46', margin: 0, lineHeight: 1.5 }}>OpenWeather 7-day forecast with crop-specific irrigation recommendations using ET₀ Hargreaves.</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: 'auto', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.75rem', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', color: '#4b5563' }}>7-Day Forecast</span>
                <span style={{ fontSize: '0.75rem', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', color: '#4b5563' }}>ET₀ Calc</span>
                <span style={{ fontSize: '0.75rem', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', color: '#4b5563' }}>Spray Windows</span>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="feature-card" style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ padding: '0.75rem', backgroundColor: '#f0fdfa', color: '#0d9488', borderRadius: '12px', border: '1px solid #99f6e4' }}>
                  <Droplets size={24} />
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6b7280', letterSpacing: '0.05em', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px' }}>IRRIGATION</span>
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#1a1c18' }}>Smart Scheduling</h3>
                <p style={{ fontSize: '0.9rem', color: '#4a4d46', margin: 0, lineHeight: 1.5 }}>Personalised weekly irrigation and fertilizer schedules based on soil health and crop growth stage.</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: 'auto', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.75rem', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', color: '#4b5563' }}>Plot-wise</span>
                <span style={{ fontSize: '0.75rem', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', color: '#4b5563' }}>N-P-K Tracking</span>
                <span style={{ fontSize: '0.75rem', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', color: '#4b5563' }}>Stage Aware</span>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="feature-card" style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ padding: '0.75rem', backgroundColor: '#ecfdf5', color: '#059669', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
                  <Leaf size={24} />
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6b7280', letterSpacing: '0.05em', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px' }}>SOIL HEALTH</span>
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#1a1c18' }}>Soil Health Monitor</h3>
                <p style={{ fontSize: '0.9rem', color: '#4a4d46', margin: 0, lineHeight: 1.5 }}>Track N-P-K levels, pH, organic carbon and moisture. Integrated with Soil Card Portal.</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: 'auto', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.75rem', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', color: '#4b5563' }}>N-P-K Bars</span>
                <span style={{ fontSize: '0.75rem', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', color: '#4b5563' }}>pH Tracking</span>
                <span style={{ fontSize: '0.75rem', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', color: '#4b5563' }}>Soil Card</span>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="feature-card" style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ padding: '0.75rem', backgroundColor: '#faf5ff', color: '#9333ea', borderRadius: '12px', border: '1px solid #e9d5ff' }}>
                  <Phone size={24} />
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6b7280', letterSpacing: '0.05em', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px' }}>OUTREACH</span>
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#1a1c18' }}>SMS & IVR Access</h3>
                <p style={{ fontSize: '0.9rem', color: '#4a4d46', margin: 0, lineHeight: 1.5 }}>Full advisory access via SMS or missed-call IVR — no smartphone or internet required.</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: 'auto', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.75rem', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', color: '#4b5563' }}>No Internet</span>
                <span style={{ fontSize: '0.75rem', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', color: '#4b5563' }}>Hindi Support</span>
                <span style={{ fontSize: '0.75rem', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', color: '#4b5563' }}>IVR Ready</span>
              </div>
            </div>

            {/* Feature 7 */}
            <div className="feature-card" style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ padding: '0.75rem', backgroundColor: '#fff1f2', color: '#e11d48', borderRadius: '12px', border: '1px solid #fecdd3' }}>
                  <Bell size={24} />
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6b7280', letterSpacing: '0.05em', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px' }}>ALERTS</span>
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#1a1c18' }}>Outbreak Detection</h3>
                <p style={{ fontSize: '0.9rem', color: '#4a4d46', margin: 0, lineHeight: 1.5 }}>Regional disease outbreak alerts based on aggregated farmer reports and weather patterns.</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: 'auto', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.75rem', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', color: '#4b5563' }}>Regional</span>
                <span style={{ fontSize: '0.75rem', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', color: '#4b5563' }}>Auto-Alert</span>
                <span style={{ fontSize: '0.75rem', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', color: '#4b5563' }}>Pattern AI</span>
              </div>
            </div>

            {/* Feature 8 */}
            <div className="feature-card" style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ padding: '0.75rem', backgroundColor: '#eef2ff', color: '#4f46e5', borderRadius: '12px', border: '1px solid #c7d2fe' }}>
                  <Globe size={24} />
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6b7280', letterSpacing: '0.05em', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px' }}>MULTI-LANG</span>
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#1a1c18' }}>Hindi + English</h3>
                <p style={{ fontSize: '0.9rem', color: '#4a4d46', margin: 0, lineHeight: 1.5 }}>8 Indian languages supported with automatic transliteration and voice-ready response cards.</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: 'auto', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.75rem', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', color: '#4b5563' }}>8 Languages</span>
                <span style={{ fontSize: '0.75rem', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', color: '#4b5563' }}>Transliterate</span>
                <span style={{ fontSize: '0.75rem', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', color: '#4b5563' }}>Voice Ready</span>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section style={{ backgroundColor: 'white', padding: '80px 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#6b7280', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 0.5rem 0' }}>MEASURABLE RESULTS</h3>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1a1c18', margin: 0 }}>Trusted by Farmers Across India</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            <div className="stat-card" style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
              <div style={{ backgroundColor: '#2563eb', color: 'white', padding: '1rem', borderRadius: '50%' }}>
                <Users size={28} />
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e3a8a', lineHeight: 1 }}>50,000+</div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1e3a8a' }}>Farmers Assisted</div>
            </div>

            <div className="stat-card" style={{ backgroundColor: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
              <div style={{ backgroundColor: '#9333ea', color: 'white', padding: '1rem', borderRadius: '50%' }}>
                <Microscope size={28} />
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#581c87', lineHeight: 1 }}>38</div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: '#581c87' }}>Diseases Detected</div>
            </div>

            <div className="stat-card" style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
              <div style={{ backgroundColor: '#059669', color: 'white', padding: '1rem', borderRadius: '50%' }}>
                <TrendingUp size={28} />
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#064e3b', lineHeight: 1 }}>500+</div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: '#064e3b' }}>Live Mandi Prices</div>
            </div>

            <div className="stat-card" style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
              <div style={{ backgroundColor: '#f59e0b', color: 'white', padding: '1rem', borderRadius: '50%' }}>
                <CloudSun size={28} />
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#78350f', lineHeight: 1 }}>7 Days</div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: '#78350f' }}>Weather Forecast</div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section style={{ backgroundColor: 'var(--color-bg, #f9fafb)', padding: '80px 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', flexWrap: 'wrap', gap: '4rem' }}>
          
          <div style={{ flex: '1 1 30%', minWidth: '300px' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#6b7280', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>SIMPLE 3-STEP PROCESS</div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1a1c18', margin: '0 0 1.5rem 0', lineHeight: 1.1 }}>From Photo to Treatment Plan in Seconds</h2>
            <p style={{ color: '#4a4d46', fontSize: '1.125rem', lineHeight: 1.6 }}>
              Our streamlined AI engine allows you to simply point your camera and get instantaneous actionable advice.
            </p>
          </div>

          <div style={{ flex: '1 1 60%', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div className="step-card" style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: '-1rem', top: '-1rem', fontSize: '8rem', fontWeight: 900, color: '#f3f4f6', zIndex: 0, lineHeight: 1, userSelect: 'none' }}>01</div>
              <div style={{ backgroundColor: '#fffbeb', color: '#d97706', padding: '1rem', borderRadius: '16px', zIndex: 1, border: '1px solid #fef3c7' }}>
                <Upload size={32} />
              </div>
              <div style={{ zIndex: 1 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#d97706', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>STEP 1</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1a1c18', margin: '0 0 0.5rem 0' }}>Take a Photo</h3>
                <p style={{ color: '#4a4d46', margin: 0 }}>Point your camera at the affected crop leaf or stem</p>
              </div>
            </div>

            <div className="step-card" style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: '-1rem', top: '-1rem', fontSize: '8rem', fontWeight: 900, color: '#f3f4f6', zIndex: 0, lineHeight: 1, userSelect: 'none' }}>02</div>
              <div style={{ backgroundColor: '#f8fafc', color: '#475569', padding: '1rem', borderRadius: '16px', zIndex: 1, border: '1px solid #e2e8f0' }}>
                <Cpu size={32} />
              </div>
              <div style={{ zIndex: 1 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>STEP 2</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1a1c18', margin: '0 0 0.5rem 0' }}>AI Analyses</h3>
                <p style={{ color: '#4a4d46', margin: 0 }}>Our MobileNetV3 model identifies disease with 91%+ accuracy</p>
              </div>
            </div>

            <div className="step-card" style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: '-1rem', top: '-1rem', fontSize: '8rem', fontWeight: 900, color: '#f3f4f6', zIndex: 0, lineHeight: 1, userSelect: 'none' }}>03</div>
              <div style={{ backgroundColor: 'rgba(50,107,0,0.1)', color: '#326b00', padding: '1rem', borderRadius: '16px', zIndex: 1, border: '1px solid rgba(50,107,0,0.2)' }}>
                <CheckCircle size={32} />
              </div>
              <div style={{ zIndex: 1 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#326b00', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>STEP 3</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1a1c18', margin: '0 0 0.5rem 0' }}>Get Treatment</h3>
                <p style={{ color: '#4a4d46', margin: 0 }}>Receive step-by-step treatment, prevention tips, and nearest agri-input shop</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA GRID */}
      <section style={{ backgroundColor: 'white', padding: '80px 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1a1c18', textAlign: 'center', margin: '0 0 3rem 0' }}>Choose Your Path</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <Link href="/diagnose" style={{ textDecoration: 'none', display: 'block', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '2rem', transition: 'transform 0.2s, box-shadow 0.2s', color: 'inherit' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '3rem' }}>🔬</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#eff6ff', color: '#2563eb', padding: '4px 12px', borderRadius: '999px' }}>AI Powered</span>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1c18', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Diagnose Crop <ArrowRight size={20} /></h3>
              <p style={{ color: '#4a4d46', margin: 0, lineHeight: 1.5 }}>Upload a photo and get AI-powered disease detection in under 5 seconds.</p>
            </Link>

            <Link href="/market" style={{ textDecoration: 'none', display: 'block', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '2rem', transition: 'transform 0.2s, box-shadow 0.2s', color: 'inherit' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '3rem' }}>📈</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#ecfdf5', color: '#059669', padding: '4px 12px', borderRadius: '999px' }}>Live Data</span>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1c18', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Check Mandi Prices <ArrowRight size={20} /></h3>
              <p style={{ color: '#4a4d46', margin: 0, lineHeight: 1.5 }}>Live Agmarknet prices from 500+ mandis ranked by net value to your farm.</p>
            </Link>

            <Link href="/schedule" style={{ textDecoration: 'none', display: 'block', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '2rem', transition: 'transform 0.2s, box-shadow 0.2s', color: 'inherit' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '3rem' }}>📅</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#fffbeb', color: '#d97706', padding: '4px 12px', borderRadius: '999px' }}>Personalised</span>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1c18', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Farm Schedule <ArrowRight size={20} /></h3>
              <p style={{ color: '#4a4d46', margin: 0, lineHeight: 1.5 }}>Get your personalised weekly irrigation and fertilizer schedule based on weather.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#1a2e16', color: 'white', padding: '60px 0', position: 'relative', overflow: 'hidden' }}>
        {/* Background Subtle Line Art */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.05, pointerEvents: 'none' }}>
           <svg width="100%" height="100%" viewBox="0 0 1440 300" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,200 C320,100 640,300 960,150 C1280,0 1440,150 1440,150 L1440,300 L0,300 Z" fill="white" />
            <path d="M0,200 C320,100 640,300 960,150 C1280,0 1440,150 1440,150" stroke="white" strokeWidth="2" fill="none" />
          </svg>
        </div>

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '3rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '3rem', marginBottom: '2rem' }}>
            <div style={{ flex: '1 1 300px' }}>
              <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', textDecoration: 'none', letterSpacing: '-0.02em', display: 'block', marginBottom: '1rem' }}>
                KisanSeva
              </Link>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', maxWidth: '300px', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>
                Empowering Indian smallholder farmers with actionable, data-driven insights.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', margin: 0 }}>
                &copy; {new Date().getFullYear()} KisanSeva. All rights reserved.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'white', marginBottom: '1.5rem' }}>Platform</h4>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <li><Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem' }}>Home</Link></li>
                  <li><Link href="/diagnose" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem' }}>Diagnose Crop</Link></li>
                  <li><Link href="/market" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem' }}>Mandi Prices</Link></li>
                  <li><Link href="/schedule" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem' }}>Farm Schedule</Link></li>
                  <li><Link href="/agent" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem' }}>AI Agent</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            Built for Track 03 AgriTech · IEMH4-AG-01 · Powered by Gemini, Groq, OpenWeather, Agmarknet
          </div>
        </div>
      </footer>

    </div>
  );
}
