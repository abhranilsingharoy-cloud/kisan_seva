import React from 'react';
import { createClient } from '@/lib/supabase/server';
import AppLayoutClient from './AppLayoutClient';
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile: any = { id: user?.id || '', name: 'Kisan', email: '' };

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
    <AppLayoutClient profile={profile}>
      {children}
    </AppLayoutClient>
  );
}
