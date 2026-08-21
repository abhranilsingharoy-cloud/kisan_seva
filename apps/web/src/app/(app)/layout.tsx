import React from 'react';
import { createClient } from '@/lib/supabase/server';
import AppLayoutClient from './AppLayoutClient';
import { currentUser } from '@clerk/nextjs/server';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  const supabase = await createClient();

  let profile: any = { id: user?.id || '', name: user?.firstName || 'Kisan', email: user?.primaryEmailAddress?.emailAddress || '' };

  if (user) {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileData) {
        profile = profileData;
      } else if (error) {
        if (error.code !== '22P02' && error.code !== 'PGRST303') {
          console.error('Supabase profile fetch error:', JSON.stringify(error, null, 2));
        }
      }
    } catch (err) {
      console.error('Failed to fetch profile from Supabase:', err);
    }
  }

  return (
    <AppLayoutClient profile={profile}>
      {children}
    </AppLayoutClient>
  );
}
