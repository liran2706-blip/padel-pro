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
      const { data } = await supabase.from('pro_users').select('*').eq('user_id', user.id).maybeSingle();
      if (!data) { window.location.href = '/register'; return; }
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
  const isActive = proUser?.active === true;

  return (
    <div className="min-h-screen bg-[#050510]" dir="rtl">
      <nav className="border-b border-white/10 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
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

      <main className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-black text-white mb-6">הדשבורד שלי</h1>

        {/* Pending */}
        {isPending && (
          <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-3xl">⏳</span>
              <div>
                <p className="font-bold text-yellow-300 text-lg">הבקשה שלך בבדיקה</p>
                <p className="text-yellow-600 text-sm mt-1">
                  נאשר את חשבונך בהקדם ותקבל גישה למערכת. הטורניר הראשון שלך חינם לגמרי.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Approved + Active */}
        {isApproved && isActive && (
          <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-700/50 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
              <p className="text-green-300 font-semibold text-sm">גישה פעילה</p>
            </div>
            <h2 className="font-black text-white text-xl mb-2">מוכן לנהל טורניר?</h2>
            <p className="text-slate-400 text-sm mb-5">
              יש לך גישה מלאה למערכת הניהול — צור טורניר מיקסינג או בתים.
            </p>
            <a href={APP_URL} target="_blank" rel="noopener noreferrer"
              className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl text-center text-lg transition-colors">
              🎾 כנס למערכת הניהול ←
            </a>
          </div>
        )}

        {/* Approved + Blocked */}
        {isApproved && !isActive && (
          <div className="space-y-4 mb-6">
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-3 bg-red-400 rounded-full"></span>
                <p className="text-red-300 font-semibold text-sm">גישה חסומה</p>
              </div>
              <p className="text-white font-bold text-lg mb-2">הטורניר הסתיים</p>
              <p className="text-slate-400 text-sm">
                כדי להקים טורניר נוסף, יש לשלם ₪100 ולהמתין לאישור.
              </p>
            </div>

            <div className="bg-green-900/20 border border-green-700/50 rounded-2xl p-5">
              <p className="text-green-300 font-bold mb-1">רוצה טורניר נוסף?</p>
              <p className="text-slate-400 text-sm mb-4">לאחר התשלום נאשר את הגישה שלך בהקדם.</p>
              <a href={PAYBOX_URL} target="_blank" rel="noopener noreferrer"
                className="block w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3.5 rounded-xl text-center transition-colors">
                💳 לתשלום ₪100 ב-PayBox ←
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
