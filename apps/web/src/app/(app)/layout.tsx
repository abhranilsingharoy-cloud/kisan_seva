"use client";

import React, { useState } from 'react';
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
  Bot
} from 'lucide-react';
import ChatWidget from '@/components/chat/ChatWidget';
import GoogleTranslateWidget from '@/components/layout/GoogleTranslateWidget';

const APP_LINKS = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Diagnose', href: '/diagnose', icon: Search },
  { name: 'Market', href: '/market', icon: TrendingUp },
  { name: 'My Plots', href: '/schedule', icon: Calendar },
  { name: 'Schemes', href: '/schemes', icon: Landmark },
  { name: 'AI Agent', href: '/agent', icon: Bot },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900 font-sans">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#65a30d] to-[#4d7c0f] flex items-center justify-center text-white font-bold text-lg">
            K
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">KisanSeva</span>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {APP_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-[#65a30d]/10 text-[#4d7c0f] font-semibold' 
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 font-medium'
                }`}
              >
                <link.icon size={20} className={isActive ? 'text-[#65a30d]' : 'text-slate-400'} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <Link 
            href="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 font-medium transition-all"
          >
            <Settings size={20} className="text-slate-400" />
            Settings
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOP HEADER (Desktop + Mobile) */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="md:hidden flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#65a30d] to-[#4d7c0f] flex items-center justify-center text-white font-bold text-sm">
                K
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-800">KisanSeva</span>
            </div>
            {/* Desktop Page Title */}
            <h1 className="hidden md:block text-xl font-semibold text-slate-800 capitalize">
              {pathname.split('/')[1] || 'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <GoogleTranslateWidget className="hidden sm:inline-block mt-1" />
            <button className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-300 transition-colors">
              <UserCircle size={20} />
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto bg-slate-50 relative pb-20 md:pb-0">
          <div className="w-full h-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-40">
        <div className="flex justify-around items-center h-16">
          {APP_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                  isActive ? 'text-[#4d7c0f]' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <link.icon size={22} className={isActive ? 'text-[#65a30d]' : ''} />
                <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>
                  {link.name}
                </span>
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
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#65a30d] to-[#4d7c0f] flex items-center justify-center text-white font-bold text-lg">
                K
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-800">KisanSeva</span>
            </div>
            
            <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
              {APP_LINKS.map((link) => {
                const isActive = pathname === link.href;
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
                    <link.icon size={22} className={isActive ? 'text-[#65a30d]' : 'text-slate-400'} />
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
