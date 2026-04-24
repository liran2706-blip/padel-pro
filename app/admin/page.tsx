'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

const ADMIN_EMAIL = 'liranh2706@gmail.com';

export default function AdminPage() {
  const [mounted, setMounted] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== ADMIN_EMAIL) { window.location.href = '/'; return; }
      setIsAdmin(true);
      const { data } = await supabase.from('pro_users')
        .select('*')
        .neq('email', ADMIN_EMAIL)
        .order('created_at', { ascending: false });
      setUsers(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  async function approveUser(userId: string, giveCredit: boolean) {
    const supabase = createClient();
    await supabase.from('pro_users').update({
      status: 'approved',
      credits: giveCredit ? 1 : 0,
    }).eq('id', userId);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'approved', credits: giveCredit ? 1 : 0 } : u));
  }

  async function addCredit(userId: string, currentCredits: number) {
    const supabase = createClient();
    await supabase.from('pro_users').update({ credits: currentCredits + 1 }).eq('id', userId);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, credits: currentCredits + 1 } : u));
  }

  async function rejectUser(userId: string) {
    const supabase = createClient();
    await supabase.from('pro_users').update({ status: 'rejected' }).eq('id', userId);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'rejected' } : u));
  }

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-900/30 text-yellow-300 border-yellow-700/50',
    approved: 'bg-green-900/30 text-green-300 border-green-700/50',
    rejected: 'bg-red-900/30 text-red-300 border-red-700/50',
  };
  const statusLabel: Record<string, string> = { pending: 'ממתין', approved: 'מאושר', rejected: 'נדחה' };

  if (!mounted || loading) return <div className="min-h-screen bg-[#050510] flex items-center justify-center text-slate-400">טוען...</div>;

  const pending = users.filter(u => u.status === 'pending');
  const approved = users.filter(u => u.status === 'approved');

  return (
    <div className="min-h-screen bg-[#050510] p-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-white">ניהול לקוחות PRO</h1>
          <div className="flex gap-3 text-sm">
            <span className="bg-yellow-900/30 text-yellow-300 px-3 py-1 rounded-lg">ממתינים: {pending.length}</span>
            <span className="bg-green-900/30 text-green-300 px-3 py-1 rounded-lg">מאושרים: {approved.length}</span>
          </div>
        </div>

        <div className="space-y-3">
          {users.map(u => (
            <div key={u.id} className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-bold text-white">{u.first_name} {u.last_name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColor[u.status]}`}>
                      {statusLabel[u.status]}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm">{u.email} · {u.phone}</p>
                  <p className="text-slate-500 text-xs mt-1">
                    נרשם: {new Date(u.created_at).toLocaleDateString('he-IL')} ·
                    קרדיטים: <span className="text-blue-400 font-bold">{u.credits}</span> ·
                    חינם: <span className={u.free_tournament_used ? 'text-red-400' : 'text-green-400'}>{u.free_tournament_used ? 'נוצל' : 'זמין'}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {u.status === 'pending' && (
                    <>
                      <button onClick={() => approveUser(u.id, false)}
                        className="bg-green-700 hover:bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                        אשר (חינם)
                      </button>
                      <button onClick={() => rejectUser(u.id)}
                        className="bg-red-900/50 hover:bg-red-900 text-red-300 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                        דחה
                      </button>
                    </>
                  )}
                  {u.status === 'approved' && (
                    <button onClick={() => addCredit(u.id, u.credits)}
                      className="bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                      ➕ קרדיט
                    </button>
                  )}
                  {u.status === 'rejected' && (
                    <button onClick={() => approveUser(u.id, false)}
                      className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                      אשר
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
