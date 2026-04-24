'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

const PAYBOX_URL = 'https://links.payboxapp.com/24vLYt9zB2b';
const APP_URL = 'https://app.israelpadel.com';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [proUser, setProUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/login'; return; }
      const { data } = await supabase.from('pro_users').select('*').eq('user_id', user.id).single();
      setProUser(data);
      setLoading(false);
    }
    load();
  }, []);

  async function handleLogout() {
    await createClient().auth.signOut();
    window.location.href = '/';
  }

  if (!mounted || loading) return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center text-slate-400">טוען...</div>
  );

  const isPending = proUser?.status === 'pending';
  const isApproved = proUser?.status === 'approved';
  const hasFree = !proUser?.free_tournament_used;
  const credits = proUser?.credits ?? 0;
  const totalAvailable = (hasFree ? 1 : 0) + credits;

  return (
    <div className="min-h-screen bg-[#050510]" dir="rtl">
      {/* Navbar */}
      <nav className="border-b border-white/10 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-black text-lg">
            <span className="text-white">PADEL</span>
            <span className="text-blue-400"> PRO</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-sm">{proUser?.first_name} {proUser?.last_name}</span>
            <button onClick={handleLogout} className="text-xs text-slate-500 hover:text-white transition-colors">יציאה</button>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-black text-white mb-6">הדשבורד שלי</h1>

        {/* Status card */}
        {isPending && (
          <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-2xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⏳</span>
              <div>
                <p className="font-bold text-yellow-300">הבקשה שלך בבדיקה</p>
                <p className="text-yellow-500 text-sm mt-1">
                  נאשר את חשבונך בהקדם. הטורניר הראשון שלך חינם — אין צורך לשלם עכשיו.
                </p>
              </div>
            </div>
          </div>
        )}

        {isApproved && (
          <>
            {/* Credits */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <p className="text-3xl font-black text-white">{totalAvailable}</p>
                <p className="text-slate-400 text-xs mt-1">טורנירים זמינים</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <p className="text-3xl font-black text-green-400">{hasFree ? '1' : '0'}</p>
                <p className="text-slate-400 text-xs mt-1">חינם</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <p className="text-3xl font-black text-blue-400">{credits}</p>
                <p className="text-slate-400 text-xs mt-1">קרדיטים</p>
              </div>
            </div>

            {/* Go to app */}
            <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-700/50 rounded-2xl p-6 mb-6">
              <h2 className="font-black text-white text-lg mb-2">מוכן לנהל טורניר?</h2>
              <p className="text-slate-400 text-sm mb-4">
                {totalAvailable > 0
                  ? `יש לך ${totalAvailable} טורניר${totalAvailable > 1 ? 'ים' : ''} זמין${totalAvailable > 1 ? 'ים' : ''}`
                  : 'אין לך טורנירים זמינים — רכוש קרדיט כדי להמשיך'}
              </p>
              {totalAvailable > 0 ? (
                <a href={APP_URL} target="_blank" rel="noopener noreferrer"
                  className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl text-center transition-colors">
                  🎾 כנס למערכת הניהול ←
                </a>
              ) : (
                <a href={PAYBOX_URL} target="_blank" rel="noopener noreferrer"
                  className="block w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3.5 rounded-xl text-center transition-colors">
                  💳 רכוש טורניר — ₪300
                </a>
              )}
            </div>

            {/* Buy more */}
            {totalAvailable > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-slate-400 text-sm mb-3">רוצה לרכוש טורנירים נוספים?</p>
                <a href={PAYBOX_URL} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3 transition-colors">
                  <span className="text-sm font-semibold text-white">רכישת טורניר נוסף</span>
                  <span className="text-blue-400 font-bold">₪300 →</span>
                </a>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
