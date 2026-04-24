'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    createClient().auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  return (
    <main className="min-h-screen bg-[#050510]">

      {/* Navbar */}
      <nav className="border-b border-white/10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="font-black text-xl">
            <span className="text-white">PADEL</span>
            <span className="text-blue-400"> PRO</span>
          </div>
          <div className="flex gap-3">
            {mounted && user ? (
              <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors">
                לדשבורד שלי
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-slate-300 hover:text-white text-sm font-medium transition-colors px-3 py-2">
                  כניסה
                </Link>
                <Link href="/register" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors">
                  התחל עכשיו
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-900/30 border border-blue-700/50 text-blue-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          🎾 הפלטפורמה המובילה לניהול טורנירי פאדל בישראל
        </div>
        <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
          נהל טורנירי פאדל
          <span className="block text-blue-400">כמו מקצוען</span>
        </h1>
        <p className="text-slate-400 text-xl mb-10 max-w-2xl mx-auto">
          מערכת ניהול מתקדמת לטורנירי מיקסינג ובתים. שיבוץ אוטומטי, דירוג חי, מסך הקרנה — הכל במקום אחד.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/register"
            className="bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-4 rounded-2xl text-lg transition-colors shadow-lg shadow-blue-900/50">
            התחל בחינם ←
          </Link>
          <a href="#features"
            className="bg-white/10 hover:bg-white/15 text-white font-medium px-8 py-4 rounded-2xl text-lg transition-colors">
            למד עוד
          </a>
        </div>
        <p className="text-slate-500 text-sm mt-4">טורניר ראשון חינם · ₪100 לטורניר לאחר מכן</p>
      </section>

      {/* Features */}
      <section id="features" className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-center text-3xl font-black mb-12">שני סוגי טורנירים</h2>
        <div className="grid md:grid-cols-2 gap-6">

          {/* Mixing */}
          <div className="bg-gradient-to-br from-blue-900/40 to-blue-950/40 border border-blue-800/50 rounded-2xl p-6">
            <div className="text-4xl mb-4">🎾</div>
            <h3 className="text-xl font-black text-white mb-2">טורניר מיקסינג</h3>
            <p className="text-slate-400 text-sm mb-4">20 שחקנים, 7 סיבובים, שיבוץ אוטומטי חכם</p>
            <ul className="space-y-2 text-sm text-slate-300">
              {['שיבוץ אקראי + גמר לפי דירוג', 'דירוג חי לאורך הטורניר', 'מסך הקרנה לשחקנים', 'סיבוב השלמה לארבעת האחרונים'].map(f => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-blue-400">✓</span> {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Groups */}
          <div className="bg-gradient-to-br from-purple-900/40 to-purple-950/40 border border-purple-800/50 rounded-2xl p-6">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-black text-white mb-2">טורניר בתים</h3>
            <p className="text-slate-400 text-sm mb-4">16 זוגות, 4 בתים, נוקאאוט מלא</p>
            <ul className="space-y-2 text-sm text-slate-300">
              {['4 בתים של 4 זוגות', 'טבלת דירוג לכל בית', 'חצי גמר + 2 גמרים', 'עץ נוקאאוט ויזואלי'].map(f => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-purple-400">✓</span> {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-center text-3xl font-black mb-12">איך זה עובד?</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { step: '1', title: 'נרשם', desc: 'יצירת חשבון חינם', icon: '👤' },
            { step: '2', title: 'משלם', desc: '₪100 לטורניר דרך PayBox', icon: '💳' },
            { step: '3', title: 'מאושר', desc: 'גישה מלאה למערכת', icon: '✅' },
            { step: '4', title: 'מנהל', desc: 'יוצר וינהל טורניר', icon: '🎯' },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="text-4xl mb-2">{s.icon}</div>
              <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-sm font-black mx-auto mb-2">{s.step}</div>
              <p className="font-bold text-white">{s.title}</p>
              <p className="text-slate-400 text-xs mt-1">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-md mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-black mb-8">תמחור פשוט</h2>
        <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-700/50 rounded-2xl p-8">
          <p className="text-blue-300 font-semibold mb-2">לכל טורניר</p>
          <div className="text-6xl font-black text-white mb-1">₪100</div>
          <p className="text-slate-400 text-sm mb-6">תשלום חד פעמי לכל טורניר</p>
          <div className="bg-green-900/30 border border-green-700/50 rounded-xl p-3 mb-6">
            <p className="text-green-300 font-bold text-sm">🎁 טורניר ראשון — חינם לגמרי!</p>
          </div>
          <Link href="/register"
            className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl text-lg transition-colors">
            התחל עכשיו — בחינם
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 text-center py-6 text-slate-600 text-sm">
        <p>PADEL PRO · pro.israelpadel.com</p>
      </footer>
    </main>
  );
}
