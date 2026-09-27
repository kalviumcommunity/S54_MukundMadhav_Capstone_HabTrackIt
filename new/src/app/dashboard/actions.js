'use server';

import { createClient } from '@/utils/supabase/server';
import {
  getHabits,
  getHabitLogs,
  getProfile,
  getAiChat,
  createHabit,
  updateHabitStreak,
  deleteHabit,
  deleteAllHabitLogs,
  upsertHabitLog,
  updateUserScore,
  getChatSessions,
  createChatSession,
  deleteChatSession,
  getChatMessages,
} from '@/utils/supabase/queries';

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Unauthorized access. Please log in.');
  return user;
}

/**
 * 1. Fetch dashboard data (habits, logs, profile, analytics)
 */
export async function getDashboardData() {
  const supabase = await createClient();
  const user = await getAuthenticatedUser();

  const [habits, logs, profile, chatHistory] = await Promise.all([
    getHabits(supabase, user.id),
    getHabitLogs(supabase, user.id),
    getProfile(supabase, user.id),
    getAiChat(supabase, user.id),
  ]);

  const chartData = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLogs = logs.filter(l => l.date === dateStr);
    chartData.push({
      name: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: dateStr,
      Completed: dayLogs.filter(l => l.status === 'completed').length,
      Total: habits.length,
    });
  }

  return {
    profile: {
      username: profile?.username || user.email.split('@')[0],
      userScore: profile?.user_score || 0,
      isPremium: profile?.is_premium || false,
      role: profile?.role || 'user',
      notificationsEnabled: profile?.notifications_enabled || false,
    },
    habits,
    logs,
    chartData,
    chatHistory,
  };
}

/**
 * 2. Batch toggle habits — client is source of truth, server applies final state.
 *    Changes is a map: { habitId: 'completed' | 'skipped' | null }
 *    null = undo (delete log)
 */
export async function batchToggleHabits(dateStr, changes) {
  const supabase = await createClient();
  const user = await getAuthenticatedUser();

  const habitIds = Object.keys(changes);
  if (habitIds.length === 0) return { success: true, newScore: 0, streaks: {} };

  // Fetch all relevant habits in one query
  const { data: habits, error } = await supabase
    .from('habits')
    .select('id, type, streak')
    .eq('user_id', user.id)
    .in('id', habitIds);

  if (error) throw new Error(error.message);

  const habitMap = {};
  habits.forEach(h => { habitMap[h.id] = h; });

  let totalScoreChange = 0;
  const streaks = {};

  for (const habitId of habitIds) {
    const status = changes[habitId];
    const habit = habitMap[habitId];
    if (!habit) continue;

    const isGood = habit.type === 'good';

    if (status === null) {
      // Undo: check existing log to reverse correct score, then delete
      const { data: existingLog } = await supabase
        .from('habit_logs')
        .select('status')
        .eq('habit_id', habitId)
        .eq('date', dateStr)
        .maybeSingle();

      await supabase.from('habit_logs').delete().eq('habit_id', habitId).eq('date', dateStr);

      const oldStreak = habit.streak || 0;
      const newStreak = Math.max(0, oldStreak - 1);
      await updateHabitStreak(supabase, habitId, newStreak);
      streaks[habitId] = newStreak;

      if (existingLog) {
        const wasPositive = (isGood && existingLog.status === 'completed') || (!isGood && existingLog.status === 'skipped');
        totalScoreChange += wasPositive ? -10 : 10;
      }
    } else {
      // Apply: upsert log, calculate score
      await upsertHabitLog(supabase, habitId, user.id, dateStr, status);
      const positive = (isGood && status === 'completed') || (!isGood && status === 'skipped');
      const newStreak = positive ? (habit.streak || 0) + 1 : 0;
      await updateHabitStreak(supabase, habitId, newStreak);
      streaks[habitId] = newStreak;
      totalScoreChange += positive ? 10 : -10;
    }
  }

  const newScore = await updateUserScore(supabase, user.id, totalScoreChange);

  return { success: true, newScore, streaks };
}

/**
 * 3. Add a new habit
 */
export async function addHabit(title, type) {
  const supabase = await createClient();
  const user = await getAuthenticatedUser();
  return await createHabit(supabase, user.id, title, type);
}

/**
 * 4. Delete a habit
 */
export async function deleteHabitAction(habitId) {
  const supabase = await createClient();
  const user = await getAuthenticatedUser();
  await deleteAllHabitLogs(supabase, habitId, user.id);
  await deleteHabit(supabase, habitId, user.id);
  return { success: true };
}

/**
 * 5. Chat Session Management
 */
export async function fetchChatSessions() {
  const supabase = await createClient();
  const user = await getAuthenticatedUser();
  return await getChatSessions(supabase, user.id);
}

export async function fetchSessionMessages(sessionId) {
  const supabase = await createClient();
  const user = await getAuthenticatedUser();
  // Verify ownership
  const { data: session } = await supabase
    .from('ai_chat_sessions')
    .select('user_id')
    .eq('id', sessionId)
    .single();
  if (!session || session.user_id !== user.id) throw new Error('Unauthorized');
  return await getChatMessages(supabase, sessionId);
}

export async function createNewChatSession() {
  const supabase = await createClient();
  const user = await getAuthenticatedUser();
  return await createChatSession(supabase, user.id, 'New Chat');
}

export async function deleteChatSessionAction(sessionId) {
  const supabase = await createClient();
  const user = await getAuthenticatedUser();
  // Verify ownership before delete
  const { data: session } = await supabase
    .from('ai_chat_sessions')
    .select('user_id')
    .eq('id', sessionId)
    .single();
  if (!session || session.user_id !== user.id) throw new Error('Unauthorized');
  await deleteChatSession(supabase, sessionId);
  return { success: true };
}



/* Payment gateway temporarily disabled — coming soon */
