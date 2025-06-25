'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/'); // Redirect jika tidak ada user
      } else {
        setUser(user);
      }
      setLoading(false);
    }
    getUser();
  }, [router]);

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  if (user) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">Dashboard Pribadi</h1>
        <p>Halo, {user.email}! Ini adalah halaman rahasia Anda.</p>
      </div>
    );
  }

  return null;
}