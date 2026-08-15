"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  LayoutDashboard,
  Search, 
  TrendingUp, 
  Calendar, 
  Settings, 
  Bell, 
  Menu,
  X,
  UserCircle,
  Landmark,
  Bot,
  Tractor,
  QrCode,
  FlaskConical,
  ChevronRight,
  Map,
  Wallet,
  Wifi,
  Users,
  LogOut,
  AlertTriangle,
  Droplets
} from 'lucide-react';
import ChatWidget from '@/components/chat/ChatWidget';
import GoogleTranslateWidget from '@/components/layout/GoogleTranslateWidget';
import GlobalCalculatorWidget from '@/components/layout/GlobalCalculatorWidget';
import { signout } from '@/app/actions/auth';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Home',
  '/dashboard': 'My Dashboard',
  '/diagnose': 'Crop Diagnose',
  '/soil-health': 'Soil Health',
  '/market': 'Market Prices',
  '/schedule': 'My Plots',
  '/schemes': 'Govt. Schemes',
  '/rentals': 'Equipment',
  '/blockchain': 'Traceability',
  '/iot': 'IoT Sensors',
  '/agent': 'AI Agent',
  '/topography': 'Farm Topography',
  '/finance': 'Agri-Credit & Lending',
  '/settings': 'Settings',
};

const APP_LINKS = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Diagnose', href: '/diagnose', icon: Search },
  { name: 'Market', href: '/market', icon: TrendingUp },
  { name: 'My Plots', href: '/schedule', icon: Calendar },
  { name: 'Agri-Credit', href: '/finance', icon: Wallet },
  { name: 'Schemes', href: '/schemes', icon: Landmark },
  { name: 'Traceability', href: '/blockchain', icon: QrCode },
  { name: 'AI Agent', href: '/agent', icon: Bot },
];

export default function AppLayoutClient({ 
  children, 
  profile
}: { 
  children: React.ReactNode, 
  profile: any
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    const updateAvatar = () => {
      if (profile?.id) {
         setAvatar(localStorage.getItem(`ks_avatar_${profile.id}`));
      }
    };
    updateAvatar();
    window.addEventListener('avatar-updated', updateAvatar);
    return () => window.removeEventListener('avatar-updated', updateAvatar);
  }, [profile?.id]);

  const pageTitle = PAGE_TITLES[pathname] || 'KisanSeva';
  
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
          {APP_LINKS.map((link) => {
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
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#65a30d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: '0.875rem', flexShrink: 0, overflow: 'hidden' }}>
              {avatar ? <img src={avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initial}
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
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                style={{ position: 'relative', padding: '8px', background: showNotifications ? '#f1f5f9' : 'none', border: 'none', cursor: 'pointer', borderRadius: '8px', color: '#64748b', transition: 'background 0.15s' }} 
                onMouseEnter={e => (e.currentTarget.style.background = '#f1f5f9')} 
                onMouseLeave={e => { if(!showNotifications) e.currentTarget.style.background = 'none' }}>
                <Bell size={20} />
                <span style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%', border: '2px solid #fff' }}></span>
              </button>

              {showNotifications && (
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: '-20px', width: '320px', background: '#fff', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', zIndex: 100, overflow: 'hidden' }}>
                  <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>Notifications</span>
                    <button onClick={() => setShowNotifications(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={16} /></button>
                  </div>
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <AlertTriangle size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a' }}>High Disease Risk: Tomato</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>Apply preventive fungicide in Plot 2A before evening.</div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>2 hours ago</div>
                      </div>
                    </div>
                    <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Droplets size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a' }}>Irrigation Due</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>Plot 1C (Rice) needs 12mm of water today.</div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>5 hours ago</div>
                      </div>
                    </div>
                    <div style={{ padding: '16px', display: 'flex', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f0fdf4', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <TrendingUp size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a' }}>Mandi Price Alert</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>Wheat prices are up by ₹50/q in Bhopal Mandi.</div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>Yesterday</div>
                      </div>
                    </div>
                  </div>
                  <Link href="/dashboard" onClick={() => setShowNotifications(false)} style={{ display: 'block', padding: '12px', textAlign: 'center', fontSize: '0.8rem', fontWeight: 600, color: '#2563eb', textDecoration: 'none', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                    View All in Dashboard
                  </Link>
                </div>
              )}
            </div>
            
            <Link href="/settings" style={{ textDecoration: 'none' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #65a30d, #4d7c0f)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(101,163,13,0.35)', overflow: 'hidden' }}>
                {avatar ? <img src={avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initial}
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
          {APP_LINKS.slice(0, 5).map((link) => {
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
              {APP_LINKS.map((link) => {
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
