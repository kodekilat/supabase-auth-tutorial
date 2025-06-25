'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';

export default function AuthUI() {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
  }

  async function handleMagicLinkLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.origin },
      });
      alert('Link login telah dikirim ke email Anda!');
    } catch (error) {
      console.error('Error:', error);
      alert('Gagal mengirim link.');
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setSession(null);
  }

  if (!session) {
    return (
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <button
          onClick={signInWithGoogle}
          className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          Login dengan Google
        </button>
        <div className="my-4 text-center text-gray-500">atau</div>
        <form onSubmit={handleMagicLinkLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            className="w-full p-2 border rounded"
            required
          />
          <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-green-500 rounded hover:bg-green-700">
            Kirim Link Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm p-8 text-center bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold">Selamat Datang!</h2>
      <p className="my-4">Anda login sebagai: <strong>{session.user.email}</strong></p>
      <button
        onClick={handleLogout}
        className="w-full px-4 py-2 font-semibold text-white bg-red-500 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}