'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

const PAYBOX_URL = 'https://links.payboxapp.com/24vLYt9zB2b';

export default function RegisterPage() {
  const [mounted, setMounted] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName || !lastName || !phone || !email || !password) { setError('יש למלא את כל השדות'); return; }
    if (password.length < 6) { setError('סיסמה חייבת להכיל לפחות 6 תווים'); return; }
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) { setError(authError.message); setLoading(false); return; }

    if (data.user) {
      await supabase.from('pro_users').insert({
        user_id: data.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
        phone,
        status: 'pending',
        credits: 0,
        free_tournament_used: false,
      });
    }

    setDone(true);
    setLoading(false);
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center px-4" dir="rtl">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-black text-white mb-3">נרשמת בהצלחה!</h2>
          <p className="text-slate-400 mb-6">
            הבקשה שלך נקלטה. בינתיים, הטורניר הראשון שלך <strong className="text-green-400">חינם לגמרי</strong> — אין צורך לשלם עכשיו.
          </p>
          <div className="bg-blue-900/30 border border-blue-700/50 rounded-2xl p-5 mb-6 text-right">
            <p className="text-blue-300 font-bold text-sm mb-2">לטורנירים נוספים — ₪100 לטורניר:</p>
            <a href={PAYBOX_URL} target="_blank" rel="noopener noreferrer"
              className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-center transition-colors">
              לתשלום ב-PayBox →
            </a>
          </div>
          <p className="text-slate-500 text-sm">נאשר את חשבונך בהקדם ותקבל גישה למערכת.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center px-4 py-8" dir="rtl">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-black text-2xl">
            <span className="text-white">PADEL</span>
            <span className="text-blue-400"> PRO</span>
          </Link>
          <p className="text-slate-400 mt-2">יצירת חשבון · טורניר ראשון חינם</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">שם פרטי</label>
                <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="ישראל"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">שם משפחה</label>
                <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="ישראלי"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">טלפון</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="050-0000000" dir="ltr"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">אימייל</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" dir="ltr"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">סיסמה</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="לפחות 6 תווים" dir="ltr"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            </div>

            {error && <p className="text-red-400 text-sm bg-red-900/20 border border-red-800/50 rounded-xl px-3 py-2">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 text-white font-bold py-3.5 rounded-xl text-base transition-colors">
              {loading ? 'יוצר חשבון...' : 'צור חשבון חינם ←'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-4">
            כבר יש לך חשבון?{' '}
            <Link href="/login" className="text-blue-400 hover:text-white">כניסה</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
