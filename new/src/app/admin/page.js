'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import {
  Users, Crown, BarChart3, Activity, Target, TrendingUp,
  ShieldCheck, Flame, LogOut, AlertTriangle, X, Check,
  Search, ChevronDown, Sparkles, Menu
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { fetchAdminStats, fetchAdminUsers, fetchWeeklyActivity, updateUserRole, fetchAdminUserDetail } from './actions';

const COLORS = {
  premium: '#00f2fe',
  free: '#64748b',
  good: '#10b981',
  bad: '#ef4444',
  primary: '#6366f1',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleUpdating, setRoleUpdating] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const supabase = createClient();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError('');

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          window.location.href = '/login';
          return;
        }

        const { data: prof } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!prof || prof.role !== 'admin') {
          window.location.href = '/dashboard';
          return;
        }

        if (cancelled) return;
        setProfile(prof);

        const [statsData, usersData, weeklyData] = await Promise.all([
          fetchAdminStats(),
          fetchAdminUsers({ limit: 100 }),
          fetchWeeklyActivity(),
        ]);

        if (cancelled) return;
        setStats(statsData);
        setUsers(usersData);
        setChartData(weeklyData);
      } catch (err) {
        if (cancelled) return;
        setError(err.message || 'Failed to load admin data');
        if (err.message.includes('Forbidden') || err.message.includes('Unauthorized')) {
          window.location.href = '/dashboard';
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const handleRoleUpdate = async (userId, newRole) => {
    setRoleUpdating(userId);
    setError('');
    try {
      await updateUserRole(userId, newRole);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole, is_premium: newRole === 'premium' || newRole === 'admin' } : u));
    } catch (err) {
      setError(err.message);
    } finally {
      setRoleUpdating(null);
    }
  };

  const viewUserDetail = async (userId) => {
    try {
      const detail = await fetchAdminUserDetail(userId);
      setSelectedUser(detail);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 min-h-screen bg-[#07080e] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center font-black text-[#07080e] text-xl animate-pulse">
            H
          </div>
          <span className="text-slate-400 text-sm">Loading admin panel...</span>
        </div>
      </div>
    );
  }

  const habitPieData = stats ? [
    { name: 'Good Habits', value: stats.goodHabits, color: COLORS.good },
    { name: 'Bad Habits', value: stats.badHabits, color: COLORS.bad },
  ] : [];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#07080e]">
      {/* Admin Header */}
      <header className="h-14 sm:h-20 border-b border-white/[0.04] bg-[#07080e]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto h-full px-3 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <a href="/dashboard" className="flex items-center gap-2 sm:gap-3">
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center font-black text-[#07080e] text-sm sm:text-lg">
                H
              </div>
              <span className="font-extrabold text-base sm:text-xl tracking-tight text-white hidden sm:block">HabTrackIt</span>
            </a>
            <span className="text-[10px] bg-amber-950/40 border border-amber-800/30 text-amber-400 px-2 py-0.5 rounded-full font-mono">
              Admin
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 sm:gap-6">
            <a href="/dashboard" className="text-cyan-400 hover:text-cyan-300 transition flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/[0.03] text-sm">
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </a>
            <span className="text-sm text-slate-400">
              <span className="text-amber-400 font-semibold">{profile?.username}</span>
            </span>
            <button
              onClick={handleSignOut}
              className="text-slate-400 hover:text-white transition flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/[0.03] text-sm cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="sm:hidden text-slate-400 p-2.5 -mr-1 rounded-lg hover:bg-white/[0.05] cursor-pointer">
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-white/[0.04] bg-[#0c0e17] px-3 py-4 flex flex-col gap-3 animate-fadeIn">
            <span className="text-sm text-slate-400">
              Logged in as <span className="text-amber-400 font-semibold">{profile?.username}</span>
            </span>
            <a href="/dashboard" className="text-cyan-400 flex items-center gap-2 text-sm py-2">
              <BarChart3 className="h-4 w-4" /> Dashboard
            </a>
            <button onClick={handleSignOut} className="text-slate-400 hover:text-white flex items-center gap-2 text-sm py-2 cursor-pointer">
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 w-full flex flex-col gap-4 sm:gap-6">
        {/* Error */}
        {error && (
          <div className="bg-red-950/40 border border-red-500/20 text-red-300 text-xs px-4 py-3 rounded-lg flex items-center justify-between gap-2">
            <span className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              {error}
            </span>
            <button onClick={() => setError('')} className="text-red-400 hover:text-red-300 cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard icon={<Users className="h-5 w-5" />} label="Total Users" value={stats?.totalUsers || 0} color="text-indigo-400" bgColor="bg-indigo-950/40 border-indigo-800/30" />
          <StatCard icon={<Crown className="h-5 w-5" />} label="Premium Users" value={stats?.premiumUsers || 0} color="text-cyan-400" bgColor="bg-cyan-950/40 border-cyan-800/30" />
          <StatCard icon={<Users className="h-5 w-5" />} label="Free Users" value={stats?.freeUsers || 0} color="text-slate-400" bgColor="bg-slate-950/40 border-slate-800/30" />
          <StatCard icon={<Target className="h-5 w-5" />} label="Total Habits" value={stats?.totalHabits || 0} color="text-emerald-400" bgColor="bg-emerald-950/40 border-emerald-800/30" />
          <StatCard icon={<Activity className="h-5 w-5" />} label="Total Logs" value={stats?.totalLogs || 0} color="text-purple-400" bgColor="bg-purple-950/40 border-purple-800/30" />
          <StatCard icon={<Flame className="h-5 w-5" />} label="Today's Logs" value={stats?.todayLogs || 0} color="text-orange-400" bgColor="bg-orange-950/40 border-orange-800/30" />
          <StatCard icon={<Check className="h-5 w-5" />} label="Good Habits" value={stats?.goodHabits || 0} color="text-emerald-400" bgColor="bg-emerald-950/40 border-emerald-800/30" />
          <StatCard icon={<X className="h-5 w-5" />} label="Bad Habits" value={stats?.badHabits || 0} color="text-red-400" bgColor="bg-red-950/40 border-red-800/30" />
        </section>

        {/* Charts Row */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Activity */}
          <div className="lg:col-span-2 glass-panel p-6 border border-white/[0.02] flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">Platform Activity (7 Days)</h2>
            </div>
            <div className="h-64 w-full">
              {mounted && chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="activityGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#111422', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '11px', color: '#f8fafc' }}
                      itemStyle={{ color: '#00f2fe' }}
                    />
                    <Area type="monotone" dataKey="completions" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#activityGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 text-sm">No activity data yet.</div>
              )}
            </div>
          </div>

          {/* Habit Distribution Pie */}
          <div className="glass-panel p-6 border border-white/[0.02] flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-400" />
              <h2 className="text-lg font-bold text-white">Habit Distribution</h2>
            </div>
            <div className="flex-1 flex items-center justify-center min-h-[200px]">
              {mounted && habitPieData.some(d => d.value > 0) ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={habitPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                      {habitPieData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#111422', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '11px', color: '#f8fafc' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <span className="text-slate-500 text-sm">No habits created yet</span>
              )}
            </div>
            <div className="flex justify-center gap-6 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
                Good ({stats?.goodHabits || 0})
              </span>
              <span className="flex items-center gap-1.5 text-red-400">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400"></span>
                Bad ({stats?.badHabits || 0})
              </span>
            </div>
          </div>
        </section>

        {/* User Management */}
        <section className="glass-panel border border-white/[0.02] flex flex-col">
          <div className="p-6 border-b border-white/[0.04] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white">User Management</h2>
            </div>
            <span className="text-xs text-slate-400">{users.length} users</span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.04] text-xs text-slate-400 uppercase tracking-wider">
                  <th className="text-left px-6 py-4 font-semibold">User</th>
                  <th className="text-left px-6 py-4 font-semibold">Role</th>
                  <th className="text-center px-6 py-4 font-semibold">Score</th>
                  <th className="text-center px-6 py-4 font-semibold">Premium</th>
                  <th className="text-right px-6 py-4 font-semibold">Joined</th>
                  <th className="text-right px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-500 text-sm">No users found</td>
                  </tr>
                ) : (
                  users.map(u => (
                    <tr key={u.id} className="border-b border-white/[0.02] hover:bg-white/[0.01] transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
                            {(u.username || '?')[0].toUpperCase()}
                          </div>
                          <span className="text-white font-medium">{u.username || 'Unnamed'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                          u.role === 'admin' ? 'bg-amber-950/40 text-amber-400 border border-amber-800/30' :
                          u.role === 'premium' ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-800/30' :
                          'bg-slate-950/40 text-slate-400 border border-slate-800/30'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-slate-300 font-mono">{u.user_score}</td>
                      <td className="px-6 py-4 text-center">
                        {u.is_premium ? (
                          <Crown className="h-4 w-4 text-cyan-400 inline" />
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right text-slate-400 text-xs">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleUpdate(u.id, e.target.value)}
                            disabled={roleUpdating === u.id || u.id === profile?.id}
                            className="text-xs bg-[#090b11] border border-white/[0.08] rounded px-2 py-1 text-slate-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed outline-none focus:border-cyan-500"
                          >
                            <option value="user">user</option>
                            <option value="premium">premium</option>
                            <option value="admin">admin</option>
                          </select>
                          <button
                            onClick={() => viewUserDetail(u.id)}
                            className="text-xs text-slate-500 hover:text-cyan-400 transition cursor-pointer px-2 py-1 hover:bg-white/[0.03] rounded"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* User Detail Modal */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg glass-panel p-6 border border-white/[0.05] relative max-h-[80vh] overflow-y-auto">
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute right-4 top-4 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white">
                  {(selectedUser.profile.username || '?')[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedUser.profile.username}</h3>
                  <span className="text-xs text-slate-400">{selectedUser.profile.email || selectedUser.profile.id}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/[0.02] p-4 rounded-xl border border-white/[0.04]">
                  <span className="text-xs text-slate-400">Role</span>
                  <p className="text-white font-bold mt-1 capitalize">{selectedUser.profile.role}</p>
                </div>
                <div className="bg-white/[0.02] p-4 rounded-xl border border-white/[0.04]">
                  <span className="text-xs text-slate-400">Score</span>
                  <p className="text-white font-bold mt-1">{selectedUser.profile.user_score}</p>
                </div>
                <div className="bg-white/[0.02] p-4 rounded-xl border border-white/[0.04]">
                  <span className="text-xs text-slate-400">Habits</span>
                  <p className="text-white font-bold mt-1">{selectedUser.habitCount}</p>
                </div>
                <div className="bg-white/[0.02] p-4 rounded-xl border border-white/[0.04]">
                  <span className="text-xs text-slate-400">Completed (7d)</span>
                  <p className="text-white font-bold mt-1">{selectedUser.completedThisWeek}</p>
                </div>
              </div>

              <h4 className="text-sm font-bold text-white mb-3">Habits</h4>
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                {selectedUser.habits.length === 0 ? (
                  <span className="text-slate-500 text-xs">No habits</span>
                ) : (
                  selectedUser.habits.map(h => (
                    <div key={h.id} className="flex items-center justify-between bg-white/[0.01] p-3 rounded-lg border border-white/[0.03]">
                      <span className="text-sm text-slate-300">{h.title}</span>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2 py-0.5 rounded ${h.type === 'good' ? 'bg-emerald-950/40 text-emerald-400' : 'bg-red-950/40 text-red-400'}`}>
                          {h.type}
                        </span>
                        <span className="text-xs text-orange-400 flex items-center gap-1">
                          <Flame className="h-3 w-3" />{h.streak}d
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, color, bgColor }) {
  return (
    <div className="glass-panel p-3 sm:p-5 border border-white/[0.02] flex items-center justify-between gap-2 sm:gap-3">
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest font-semibold truncate">{label}</span>
        <span className="text-lg sm:text-2xl font-black text-white mt-0.5 sm:mt-1">{value}</span>
      </div>
      <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-lg ${bgColor} flex items-center justify-center ${color} shrink-0`}>
        {icon}
      </div>
    </div>
  );
}
