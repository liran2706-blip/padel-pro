'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

const ADMIN_EMAIL = 'liranh2706@gmail.com';

export default function AdminPage() {
  const [mounted, setMounted] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== ADMIN_EMAIL) { window.location.href = '/'; return; }
      const { data } = await supabase
        .from('pro_users')
        .select('*')
        .neq('email', ADMIN_EMAIL)
        .order('created_at', { ascending: false });
      setUsers(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  async function approveUser(id: string) {
    const supabase = createClient();
    await supabase.from('pro_users').update({ status: 'approved', active: true }).eq('id', id);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'approved', active: true } : u));
  }

  async function activateUser(id: string) {
    const supabase = createClient();
    await supabase.from('pro_users').update({ active: true }).eq('id', id);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, active: true } : u));
  }

  async function deactivateUser(id: string) {
    const supabase = createClient();
    await supabase.from('pro_users').update({ active: false }).eq('id', id);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, active: false } : u));
  }

  async function rejectUser(id: string) {
    const supabase = createClient();
    await supabase.from('pro_users').update({ status: 'rejected', active: false }).eq('id', id);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'rejected', active: false } : u));
  }

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-900/30 text-yellow-300 border-yellow-700/50',
    approved: 'bg-green-900/30 text-green-300 border-green-700/50',
    rejected: 'bg-red-900/30 text-red-300 border-red-700/50',
  };
  const statusLabel: Record<string, string> = { pending: 'ממתין', approved: 'מאושר', rejected: 'נדחה' };

  if (!mounted || loading) return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center text-slate-400">טוען...</div>
  );

  const pending = users.filter(u => u.status === 'pending');
  const approved = users.filter(u => u.status === 'approved');

  return (
    <div className="min-h-screen bg-[#050510] p-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-white">ניהול לקוחות PRO</h1>
          <div className="flex gap-3 text-sm">
            <span className="bg-yellow-900/30 text-yellow-300 px-3 py-1 rounded-lg border border-yellow-700/50">
              ממתינים: {pending.length}
            </span>
            <span className="bg-green-900/30 text-green-300 px-3 py-1 rounded-lg border border-green-700/50">
              פעילים: {approved.filter(u => u.active).length}
            </span>
          </div>
        </div>

        {users.length === 0 && (
          <p className="text-center text-slate-500 py-20">אין לקוחות עדיין</p>
        )}

        <div className="space-y-3">
          {users.map(u => (
            <div key={u.id} className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-bold text-white">{u.first_name} {u.last_name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColor[u.status]}`}>
                      {statusLabel[u.status]}
                    </span>
                    {u.status === 'approved' && (
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${
                        u.active
                          ? 'bg-blue-900/30 text-blue-300 border-blue-700/50'
                          : 'bg-slate-900/30 text-slate-400 border-slate-700/50'
                      }`}>
                        {u.active ? '🟢 פעיל' : '🔴 חסום'}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm">{u.email} · {u.phone}</p>
                  <p className="text-slate-600 text-xs mt-1">
                    נרשם: {new Date(u.created_at).toLocaleDateString('he-IL')}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {u.status === 'pending' && (
                    <>
                      <button onClick={() => approveUser(u.id)}
                        className="bg-green-700 hover:bg-green-600 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors">
                        ✓ אשר
                      </button>
                      <button onClick={() => rejectUser(u.id)}
                        className="bg-red-900/50 hover:bg-red-900 text-red-300 text-xs font-bold px-3 py-2 rounded-lg transition-colors">
                        ✕ דחה
                      </button>
                    </>
                  )}
                  {u.status === 'approved' && (
                    <>
                      {u.active ? (
                        <button onClick={() => deactivateUser(u.id)}
                          className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors">
                          🔴 חסום
                        </button>
                      ) : (
                        <button onClick={() => activateUser(u.id)}
                          className="bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors">
                          🟢 הפעל
                        </button>
                      )}
                    </>
                  )}
                  {u.status === 'rejected' && (
                    <button onClick={() => approveUser(u.id)}
                      className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors">
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
