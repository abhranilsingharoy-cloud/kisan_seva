"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Settings, 
  Bell, 
  Menu,
  X,
  ChevronRight,
  LogOut
} from 'lucide-react';
import ChatWidget from '@/components/chat/ChatWidget';
import GoogleTranslateWidget from '@/components/layout/GoogleTranslateWidget';
import GlobalCalculatorWidget from '@/components/layout/GlobalCalculatorWidget';
import { signout } from '@/app/actions/auth';

export default function AppLayoutClient({ 
  children, 
  profile, 
  appLinks, 
  pageTitles 
}: { 
  children: React.ReactNode, 
  profile: any,
  appLinks: any[],
  pageTitles: Record<string, string>
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pageTitle = pageTitles[pathname] || 'KisanSeva';
  
  const initial = profile?.name ? profile.name.charAt(0).toUpperCase() : '?';

  return (
    <div className="flex h-screen overflow-hidden text-slate-900 font-sans" style={{ backgroundColor: '#f0f4f0' }}>
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 shrink-0" style={{ background: 'linear-gradient(180deg, #1a2e1a 0%, #1e3a1e 60%, #162816 100%)', boxShadow: '4px 0 24px rgba(0,0,0,0.18)' }}>
        
        {/* Brand */}
        <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ background: 'rgba(101,163,13,0.25)', borderRadius: '10px', padding: '6px', border: '1px solid rgba(101,163,13,0.35)' }}>
            <img src="/icon.jpg" alt="KisanSeva" style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'cover', display: 'block' }} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.125rem', color: '#fff', letterSpacing: '-0.3px' }}>KisanSeva</div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Smart Farm Platform</div>
          </div>
        </div>

        {/* Live status pill */}
        <div style={{ margin: '8px 16px', backgroundColor: 'rgba(101,163,13,0.15)', border: '1px solid rgba(101,163,13,0.3)', borderRadius: '8px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#84cc16', display: 'inline-block', boxShadow: '0 0 6px #84cc16', animation: 'none' }} />
          <span style={{ fontSize: '0.75rem', color: '#86efac', fontWeight: 600 }}>All Systems Online</span>
        </div>
        
        <nav style={{ flex: 1, padding: '2px 12px 10px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {appLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link 
                key={link.name} 
                href={link.href}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px',
                  borderRadius: '10px', textDecoration: 'none', transition: 'all 0.15s ease', fontSize: '0.9rem',
                  fontWeight: isActive ? 700 : 500,
                  backgroundColor: isActive ? 'rgba(101,163,13,0.22)' : 'transparent',
                  color: isActive ? '#a3e635' : 'rgba(255,255,255,0.55)',
                  borderLeft: isActive ? '3px solid #84cc16' : '3px solid transparent',
                }}
                onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.9)'; } }}
                onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)'; } }}
              >
                <Icon size={18} style={{ color: isActive ? '#84cc16' : 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{link.name}</span>
                {isActive && <ChevronRight size={14} style={{ color: '#84cc16', opacity: 0.7 }} />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom user card */}
        <div style={{ margin: '0 12px 8px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Link
            href="/settings"
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '10px', textDecoration: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', fontWeight: 500, transition: 'all 0.15s', backgroundColor: 'transparent' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.85)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}
          >
            <Settings size={17} style={{ flexShrink: 0 }} />
            Settings
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#65a30d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: '0.875rem', flexShrink: 0 }}>
              {initial}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem' }}>Verified Farmer</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOP HEADER */}
        <header style={{ height: '60px', backgroundColor: '#fff', borderBottom: '1px solid #e9eef0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', zIndex: 10, flexShrink: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="md:hidden" style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }} onClick={() => setMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="md:hidden" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src="/icon.jpg" alt="KisanSeva" style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'cover' }} />
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1a2e1a' }}>KisanSeva</span>
            </div>
            {/* Desktop breadcrumb */}
            <div className="hidden md:flex" style={{ alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>KisanSeva</span>
              <ChevronRight size={14} style={{ color: '#cbd5e1' }} />
              <span style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>{pageTitle}</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GoogleTranslateWidget className="hidden sm:inline-block mt-1" />
            <GlobalCalculatorWidget />
            <button style={{ position: 'relative', padding: '8px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '8px', color: '#64748b', transition: 'background 0.15s' }} onMouseEnter={e => (e.currentTarget.style.background = '#f1f5f9')} onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
              <Bell size={20} />
              <span style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.45rem', color: '#fff', fontWeight: 700 }}>3</span>
            </button>
            
            <Link href="/settings" style={{ textDecoration: 'none' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #65a30d, #4d7c0f)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(101,163,13,0.35)' }}>
                {initial}
              </div>
            </Link>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto relative pb-20 md:pb-0" style={{ backgroundColor: '#f0f4f0' }}>
          <div className="w-full h-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* MOBILE BOTTOM NAV — only show 5 key tabs */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-40">
        <div className="flex justify-around items-center h-16">
          {appLinks.slice(0, 5).map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link 
                key={link.name} 
                href={link.href}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, height: '100%', textDecoration: 'none', gap: '3px', color: isActive ? '#4d7c0f' : '#94a3b8', transition: 'color 0.15s' }}
              >
                <Icon size={21} style={{ color: isActive ? '#65a30d' : '#94a3b8' }} />
                <span style={{ fontSize: '9px', fontWeight: isActive ? 700 : 500 }}>{link.name}</span>
                {isActive && <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#65a30d', position: 'absolute', bottom: '6px' }} />}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* MOBILE DRAWER OVERLAY */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" 
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-4">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white bg-slate-800 text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 flex items-center gap-3 border-b border-slate-100">
              <img src="/icon.jpg" alt="KisanSeva Logo" className="w-8 h-8 rounded-lg object-cover shadow-sm" />
              <span className="font-bold text-xl tracking-tight text-slate-800">KisanSeva</span>
            </div>
            
            <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
              {appLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-[#65a30d]/10 text-[#4d7c0f] font-semibold' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'
                    }`}
                  >
                    <Icon size={22} className={isActive ? 'text-[#65a30d]' : 'text-slate-400'} />
                    <span className="text-base">{link.name}</span>
                  </Link>
                );
              })}
              
              <div className="pt-4 mt-4 border-t border-slate-100">
                <Link 
                  href="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium transition-all"
                >
                  <Settings size={22} className="text-slate-400" />
                  <span className="text-base">Settings</span>
                </Link>
                <form action={signout}>
                    <button 
                      type="submit"
                      className="w-full mt-2 flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-700 font-medium transition-all"
                    >
                      <LogOut size={22} className="text-red-400" />
                      <span className="text-base">Logout</span>
                    </button>
                </form>
              </div>
            </nav>
          </div>
        </div>
      )}
      
      {/* GLOBAL CHATBOT */}
      <ChatWidget />
    </div>
  );
}
