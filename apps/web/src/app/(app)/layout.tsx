import React from 'react';
import Link from 'next/link';
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
  Users
} from 'lucide-react';
import ChatWidget from '@/components/chat/ChatWidget';
import GoogleTranslateWidget from '@/components/layout/GoogleTranslateWidget';
import GlobalCalculatorWidget from '@/components/layout/GlobalCalculatorWidget';
import { createClient } from '@/lib/supabase/server';
import AppLayoutClient from './AppLayoutClient';

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
  { name: 'Home', href: '/', icon: Home },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Diagnose', href: '/diagnose', icon: Search },
  { name: 'Soil Health', href: '/soil-health', icon: FlaskConical },
  { name: 'Market', href: '/market', icon: TrendingUp },
  { name: 'My Plots', href: '/schedule', icon: Calendar },
  { name: 'Farm Map', href: '/topography', icon: Map },
  { name: 'Agri-Credit', href: '/finance', icon: Wallet },
  { name: 'Schemes', href: '/schemes', icon: Landmark },
  { name: 'Equipment', href: '/rentals', icon: Tractor },
  { name: 'Traceability', href: '/blockchain', icon: QrCode },
  { name: 'Kisan Sabha', href: '/community', icon: Users },
  { name: 'AI Agent', href: '/agent', icon: Bot },
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile = { name: 'Kisan', email: '' };

  if (user) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileData) {
      profile = profileData;
    } else {
      profile.email = user.email || '';
    }
  }

  return (
    <AppLayoutClient 
      profile={profile} 
      appLinks={APP_LINKS} 
      pageTitles={PAGE_TITLES}
    >
      {children}
    </AppLayoutClient>
  );
}
