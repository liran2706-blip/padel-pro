'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError('אימייל או סיסמה שגויים'); setLoading(false); }
    else { window.location.href = '/dashboard'; }
  }

  return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center px-4" dir="rtl">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-black text-2xl">
            <span className="text-white">PADEL</span>
            <span className="text-blue-400"> PRO</span>
          </Link>
          <p className="text-slate-400 mt-2">כניסה לחשבון</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">אימייל</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" dir="ltr"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">סיסמה</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" dir="ltr"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 text-white font-bold py-3.5 rounded-xl transition-colors">
              {loading ? 'מתחבר...' : 'כניסה'}
            </button>
          </form>
          <p className="text-center text-slate-500 text-sm mt-4">
            עדיין אין לך חשבון?{' '}
            <Link href="/register" className="text-blue-400 hover:text-white">הרשמה חינם</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
