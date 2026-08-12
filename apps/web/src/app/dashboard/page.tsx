'use client';

import React from 'react';
import Link from 'next/link';
import {
  CloudSun,
  Droplets,
  AlertTriangle,
  Beaker,
  Microscope,
  LayoutDashboard,
  TrendingUp,
  Cloud,
  Users,
  Settings,
  ArrowRight,
  Home,
  Calendar,
  Bot
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="ks-layout" style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-surface-low, #f8f9fa)' }}>
      {/* SIDEBAR (desktop only) */}
      <aside className="ks-sidebar" style={{ width: '240px', backgroundColor: '#ffffff', borderRight: '1px solid var(--color-border, #e2e8f0)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, bottom: 0, left: 0 }}>
        <div style={{ padding: '24px' }}>
          <h1 className="ks-sidebar-logo" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary-base, #326b00)', margin: 0, marginBottom: '24px' }}>
            KisanSeva
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-primary-base, #326b00)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
              PS
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Priya Sharma</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim, #64748b)' }}>Managing 3 Plots</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', fontSize: '0.875rem' }}>
            <span style={{ fontWeight: 500 }}>Language</span>
            <span className="badge" style={{ backgroundColor: 'var(--color-surface-high, #f1f5f9)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>EN / HI</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', fontSize: '0.875rem' }}>
            <span style={{ fontWeight: 500 }}>Low Data Mode</span>
            <div style={{ width: '36px', height: '20px', borderRadius: '10px', backgroundColor: 'var(--color-primary-base, #326b00)', position: 'relative' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#ffffff', position: 'absolute', top: '2px', right: '2px' }}></div>
            </div>
          </div>
        </div>
        
        <div style={{ height: '1px', backgroundColor: 'var(--color-border, #e2e8f0)', margin: '0 24px 16px' }}></div>
        
        <nav style={{ flex: 1, padding: '0 12px' }}>
          <Link href="/dashboard" className="ks-nav-item active" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', color: 'var(--color-primary-base, #326b00)', backgroundColor: 'var(--color-primary-surface, #f0fdf4)', fontWeight: 600, marginBottom: '4px', textDecoration: 'none' }}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link href="/diagnose" className="ks-nav-item" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', color: 'var(--color-text-base, #334155)', fontWeight: 500, marginBottom: '4px', textDecoration: 'none' }}>
            <Microscope size={20} />
            <span>Crop Health</span>
          </Link>
          <Link href="/market" className="ks-nav-item" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', color: 'var(--color-text-base, #334155)', fontWeight: 500, marginBottom: '4px', textDecoration: 'none' }}>
            <TrendingUp size={20} />
            <span>Market Prices</span>
          </Link>
          <Link href="/schedule" className="ks-nav-item" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', color: 'var(--color-text-base, #334155)', fontWeight: 500, marginBottom: '4px', textDecoration: 'none' }}>
            <Cloud size={20} />
            <span>Weather</span>
          </Link>
          <Link href="#" className="ks-nav-item" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', color: 'var(--color-text-base, #334155)', fontWeight: 500, marginBottom: '4px', textDecoration: 'none' }}>
            <Users size={20} />
            <span>Community</span>
          </Link>
          <Link href="#" className="ks-nav-item" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', color: 'var(--color-text-base, #334155)', fontWeight: 500, marginBottom: '4px', textDecoration: 'none' }}>
            <Settings size={20} />
            <span>Settings</span>
          </Link>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="ks-main" style={{ flex: 1, marginLeft: '240px', display: 'flex', flexDirection: 'column' }}>
        {/* Header Bar */}
        <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--color-border, #e2e8f0)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, color: 'var(--color-text-base, #1e293b)' }}>Good morning, Farmer. 🌾</h2>
            <p style={{ margin: '4px 0 0', color: 'var(--color-text-dim, #64748b)' }}>Here is the latest data for your 3 plots.</p>
          </div>
          <div>
            <span className="badge badge-live" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--color-primary-surface, #f0fdf4)', color: 'var(--color-primary-base, #326b00)', padding: '6px 12px', borderRadius: '16px', fontWeight: 600, fontSize: '0.875rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-primary-base, #326b00)' }}></span>
              System Online
            </span>
          </div>
        </header>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Stat Cards Row */}
          <section style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            
            {/* Weather Card */}
            <div className="card" style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid var(--color-border, #e2e8f0)', borderLeft: '4px solid #326b00', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>28°C</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-dim, #64748b)' }}>Partly Cloudy, 60% Humidity</div>
                </div>
                <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#f0fdf4', color: '#326b00' }}>
                  <CloudSun size={24} />
                </div>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-base, #334155)', margin: 0, flex: 1 }}>
                Rain expected in 2 days. Adjust irrigation schedule accordingly.
              </p>
              <Link href="/schedule" className="btn btn-primary btn-sm" style={{ display: 'inline-flex', justifyContent: 'center', padding: '8px 16px', backgroundColor: 'var(--color-primary-base, #326b00)', color: '#ffffff', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', border: 'none' }}>
                View 7-Day Forecast
              </Link>
            </div>

            {/* Irrigation Card */}
            <div className="card" style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid var(--color-border, #e2e8f0)', borderLeft: '4px solid #0ea5e9', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0ea5e9' }}>Skip Today</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-dim, #64748b)' }}>Irrigation Status</div>
                </div>
                <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#e0f2fe', color: '#0ea5e9' }}>
                  <Droplets size={24} />
                </div>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-base, #334155)', margin: 0, flex: 1 }}>
                Soil moisture is optimal. Expected rain will cover needs.
              </p>
              <Link href="/schedule" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', justifyContent: 'center', padding: '8px 16px', backgroundColor: 'transparent', color: 'var(--color-text-base, #334155)', border: '1px solid var(--color-border, #cbd5e1)', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
                View Details
              </Link>
            </div>

            {/* Fertilizer Card */}
            <div className="card" style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid var(--color-border, #e2e8f0)', borderLeft: '4px solid #f59e0b', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#f59e0b' }}>Apply Urea Mix</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-dim, #64748b)' }}>Nutrient Plan</div>
                </div>
                <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#fef3c7', color: '#f59e0b' }}>
                  <Beaker size={24} />
                </div>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-base, #334155)', margin: 0, flex: 1 }}>
                Plot 1 requires nitrogen boost before upcoming rain.
              </p>
              <Link href="/schedule" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', justifyContent: 'center', padding: '8px 16px', backgroundColor: 'transparent', color: 'var(--color-text-base, #334155)', border: '1px solid var(--color-border, #cbd5e1)', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
                View Details
              </Link>
            </div>

            {/* Pest Alert Card */}
            <div className="card" style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid var(--color-border, #e2e8f0)', borderLeft: '4px solid #ef4444', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ef4444' }}>Moderate Risk</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-dim, #64748b)' }}>Pest Alert</div>
                </div>
                <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#fee2e2', color: '#ef4444' }}>
                  <AlertTriangle size={24} />
                </div>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-base, #334155)', margin: 0, flex: 1 }}>
                Conditions favorable for blight. Monitor lower leaves.
              </p>
              <Link href="/diagnose" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', justifyContent: 'center', padding: '8px 16px', backgroundColor: 'transparent', color: 'var(--color-text-base, #334155)', border: '1px solid var(--color-border, #cbd5e1)', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
                View Details
              </Link>
            </div>
          </section>

          {/* Two columns row */}
          <section style={{ padding: '0 24px 24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {/* Left Column: Scan Crop */}
            <div className="card" style={{ flex: '2 1 400px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid var(--color-border, #e2e8f0)', padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <div style={{ width: '6rem', height: '6rem', borderRadius: '50%', backgroundColor: 'var(--color-surface-low, #f8f9fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <Microscope size={40} color="var(--color-primary-base, #326b00)" />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 8px' }}>Scan Crop</h3>
              <p style={{ color: 'var(--color-text-dim, #64748b)', margin: '0 0 24px' }}>Instantly diagnose pests & diseases using AI</p>
              <Link href="/diagnose" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: 'var(--color-primary-base, #326b00)', color: '#ffffff', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, textDecoration: 'none', border: 'none' }}>
                Diagnose Now <ArrowRight size={20} />
              </Link>
            </div>

            {/* Right Column: Nearby Markets */}
            <div className="card" style={{ flex: '1 1 280px', minWidth: '280px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid var(--color-border, #e2e8f0)', padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>Nearby Markets</h3>
                <span className="badge-neutral" style={{ padding: '4px 8px', backgroundColor: 'var(--color-surface-high, #f1f5f9)', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-dim, #64748b)' }}>Wheat (Quintal)</span>
              </div>
              
              <div className="ks-table" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--color-border, #e2e8f0)' }}>
                  <span style={{ fontWeight: 500 }}>Azadpur</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 600 }}>₹2,250</span>
                    <span style={{ color: '#16a34a', fontSize: '0.875rem', fontWeight: 600 }}>+15↑</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--color-border, #e2e8f0)' }}>
                  <span style={{ fontWeight: 500 }}>Najafgarh</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 600 }}>₹2,230</span>
                    <span style={{ color: '#ef4444', fontSize: '0.875rem', fontWeight: 600 }}>-5↓</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px' }}>
                  <span style={{ fontWeight: 500 }}>Narela</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 600 }}>₹2,245</span>
                    <span style={{ color: 'var(--color-text-dim, #64748b)', fontSize: '0.875rem', fontWeight: 600 }}>--</span>
                  </div>
                </div>
              </div>
              
              <Link href="/market" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--color-primary-base, #326b00)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', marginTop: '16px' }}>
                View all prices <ArrowRight size={16} />
              </Link>
            </div>
          </section>

          {/* Quick Actions Row */}
          <section style={{ padding: '0 24px 80px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 16px' }}>Quick Actions</h3>
            <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
              <Link href="/agent" style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid var(--color-border, #e2e8f0)', textDecoration: 'none', color: 'var(--color-text-base, #334155)', fontWeight: 600, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize: '1.25rem' }}>🔬</span> AI Agent Chat
              </Link>
              <Link href="/schedule" style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid var(--color-border, #e2e8f0)', textDecoration: 'none', color: 'var(--color-text-base, #334155)', fontWeight: 600, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize: '1.25rem' }}>📅</span> Irrigation Schedule
              </Link>
              <Link href="/market" style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid var(--color-border, #e2e8f0)', textDecoration: 'none', color: 'var(--color-text-base, #334155)', fontWeight: 600, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize: '1.25rem' }}>📊</span> Market Prices
              </Link>
              <Link href="/schedule" style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid var(--color-border, #e2e8f0)', textDecoration: 'none', color: 'var(--color-text-base, #334155)', fontWeight: 600, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize: '1.25rem' }}>🌧️</span> Weather Forecast
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* MOBILE BOTTOM NAV */}
      <nav className="ks-bottom-nav" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#ffffff', borderTop: '1px solid var(--color-border, #e2e8f0)', display: 'none', padding: '8px 16px', zIndex: 10 }}>
        {/* We use media queries or classes to show this only on mobile, simulated inline for now but class is given */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Link href="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--color-primary-base, #326b00)', textDecoration: 'none' }}>
            <Home size={24} />
            <span style={{ fontSize: '0.625rem', fontWeight: 600 }}>Home</span>
          </Link>
          <Link href="/diagnose" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--color-text-dim, #64748b)', textDecoration: 'none' }}>
            <Microscope size={24} />
            <span style={{ fontSize: '0.625rem', fontWeight: 500 }}>Crops</span>
          </Link>
          <Link href="/market" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--color-text-dim, #64748b)', textDecoration: 'none' }}>
            <TrendingUp size={24} />
            <span style={{ fontSize: '0.625rem', fontWeight: 500 }}>Market</span>
          </Link>
          <Link href="/schedule" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--color-text-dim, #64748b)', textDecoration: 'none' }}>
            <Calendar size={24} />
            <span style={{ fontSize: '0.625rem', fontWeight: 500 }}>Schedule</span>
          </Link>
          <Link href="/agent" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--color-text-dim, #64748b)', textDecoration: 'none' }}>
            <Bot size={24} />
            <span style={{ fontSize: '0.625rem', fontWeight: 500 }}>Agent</span>
          </Link>
        </div>
      </nav>
      
      {/* Basic media query styles can be handled in globals.css, but inline styles block display if not careful, so adding a style block */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .ks-sidebar { display: none !important; }
          .ks-main { margin-left: 0 !important; }
          .ks-bottom-nav { display: flex !important; }
        }
      `}} />
    </div>
  );
}
