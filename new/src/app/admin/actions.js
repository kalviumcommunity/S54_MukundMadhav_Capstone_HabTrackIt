'use server';

import { requireAdmin } from '@/utils/rbac';
import { getAdminStats, getAdminUsers, getAdminUserDetail, getHabits, getHabitLogs } from '@/utils/supabase/queries';

export async function fetchAdminStats() {
  const { supabase } = await requireAdmin();
  return await getAdminStats(supabase);
}

export async function fetchAdminUsers(options = {}) {
  const { supabase } = await requireAdmin();
  return await getAdminUsers(supabase, options);
}

export async function fetchAdminUserDetail(userId) {
  const { supabase } = await requireAdmin();

  const [profile, habits, logs] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single().then(r => r.data),
    getHabits(supabase, userId),
    getHabitLogs(supabase, userId),
  ]);

  if (!profile) throw new Error('User not found');

  return {
    profile,
    habits,
    logs,
    habitCount: habits.length,
    logCount: logs.length,
    completedThisWeek: logs.filter(l => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return l.status === 'completed' && new Date(l.date) >= weekAgo;
    }).length,
  };
}

export async function updateUserRole(userId, newRole) {
  const { supabase, user } = await requireAdmin();

  if (userId === user.id) {
    throw new Error('Admins cannot change their own role');
  }

  if (!['user', 'premium', 'admin'].includes(newRole)) {
    throw new Error('Invalid role');
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      role: newRole,
      is_premium: newRole === 'premium' || newRole === 'admin',
    })
    .eq('id', userId);

  if (error) throw new Error(error.message);
  return { success: true };
}

export async function fetchWeeklyActivity() {
  const { supabase } = await requireAdmin();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6);
  const startDateStr = startDate.toISOString().split('T')[0];

  const { data: logs, error } = await supabase
    .from('habit_logs')
    .select('date')
    .eq('status', 'completed')
    .gte('date', startDateStr);

  if (error) throw new Error(error.message);

  const countsByDate = {};
  logs?.forEach(log => {
    countsByDate[log.date] = (countsByDate[log.date] || 0) + 1;
  });

  const chartData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    chartData.push({
      name: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: dateStr,
      completions: countsByDate[dateStr] || 0,
    });
  }

  return chartData;
}
