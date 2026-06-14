// Supabase PostgreSQL query utilities — replaces all MongoDB model operations

/** ─── HABITS ─── */

export async function getHabits(supabase, userId) {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export async function getHabitById(supabase, habitId, userId) {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('id', habitId)
    .eq('user_id', userId)
    .single()

  if (error) throw new Error(error.message || 'Habit not found')
  return data
}

export async function createHabit(supabase, userId, title, type) {
  // Check for duplicate title
  const { data: existing } = await supabase
    .from('habits')
    .select('id')
    .eq('user_id', userId)
    .ilike('title', title)
    .maybeSingle()

  if (existing) throw new Error('A habit with this title already exists.')

  const { data, error } = await supabase
    .from('habits')
    .insert({ user_id: userId, title, type, streak: 0 })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateHabitStreak(supabase, habitId, newStreak) {
  const { error } = await supabase
    .from('habits')
    .update({ streak: Math.max(0, newStreak) })
    .eq('id', habitId)

  if (error) throw new Error(error.message)
}

export async function deleteHabit(supabase, habitId, userId) {
  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', habitId)
    .eq('user_id', userId)

  if (error) throw new Error(error.message)
}

/** ─── HABIT LOGS ─── */

export async function getHabitLogs(supabase, userId, options = {}) {
  let query = supabase
    .from('habit_logs')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })

  if (options.habitIds) {
    query = query.in('habit_id', options.habitIds)
  }
  if (options.limit) {
    query = query.limit(options.limit)
  }
  if (options.startDate) {
    query = query.gte('date', options.startDate)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data || []
}

export async function upsertHabitLog(supabase, habitId, userId, date, status = 'completed') {
  // UPSERT: insert or update if unique constraint (habit_id, date) conflicts
  const { data, error } = await supabase
    .from('habit_logs')
    .upsert(
      { habit_id: habitId, user_id: userId, date, status },
      { onConflict: 'habit_id, date', ignoreDuplicates: false }
    )
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deleteHabitLog(supabase, habitId, userId, date) {
  const { error } = await supabase
    .from('habit_logs')
    .delete()
    .eq('habit_id', habitId)
    .eq('user_id', userId)
    .eq('date', date)

  if (error) throw new Error(error.message)
}

export async function deleteAllHabitLogs(supabase, habitId, userId) {
  const { error } = await supabase
    .from('habit_logs')
    .delete()
    .eq('habit_id', habitId)
    .eq('user_id', userId)

  if (error) throw new Error(error.message)
}

/** ─── PROFILES ─── */

export async function getProfile(supabase, userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(error.message)
  }
  return data
}

export async function updateProfile(supabase, userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateUserScore(supabase, userId, delta) {
  // Fetch current score, then update
  const profile = await getProfile(supabase, userId)
  const currentScore = profile?.user_score || 0
  const newScore = Math.max(0, currentScore + delta)

  const { error } = await supabase
    .from('profiles')
    .update({ user_score: newScore })
    .eq('id', userId)

  if (error) throw new Error(error.message)
  return newScore
}

/** ─── AI CHATS ─── */

export async function getAiChat(supabase, userId) {
  const { data, error } = await supabase
    .from('ai_chats')
    .select('messages')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data?.messages || []
}

export async function upsertAiChat(supabase, userId, messages) {
  // Upsert: insert if not exists, update if exists
  const { data, error } = await supabase
    .from('ai_chats')
    .upsert(
      { user_id: userId, messages },
      { onConflict: 'user_id', ignoreDuplicates: false }
    )
    .select('messages')
    .single()

  if (error) throw new Error(error.message)
  return data.messages
}

/** ─── CHAT SESSIONS ─── */

export async function getChatSessions(supabase, userId) {
  const { data, error } = await supabase
    .from('ai_chat_sessions')
    .select('id, title, created_at, updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export async function createChatSession(supabase, userId, title = 'New Chat') {
  const { data, error } = await supabase
    .from('ai_chat_sessions')
    .insert({ user_id: userId, title })
    .select('id, title, created_at, updated_at')
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deleteChatSession(supabase, sessionId) {
  const { error } = await supabase
    .from('ai_chat_sessions')
    .delete()
    .eq('id', sessionId)

  if (error) throw new Error(error.message)
}

export async function getChatMessages(supabase, sessionId) {
  const { data, error } = await supabase
    .from('ai_chat_messages')
    .select('role, content, created_at')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)
  return data || []
}

export async function addChatMessage(supabase, sessionId, role, content) {
  const { data, error } = await supabase
    .from('ai_chat_messages')
    .insert({ session_id: sessionId, role, content })
    .select('role, content, created_at')
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateSessionTitle(supabase, sessionId, title) {
  const { error } = await supabase
    .from('ai_chat_sessions')
    .update({ title })
    .eq('id', sessionId)

  if (error) throw new Error(error.message)
}

export async function getSessionMessageCount(supabase, sessionId) {
  const { count, error } = await supabase
    .from('ai_chat_messages')
    .select('id', { count: 'exact', head: true })
    .eq('session_id', sessionId)

  if (error) throw new Error(error.message)
  return count || 0
}

/** ─── AI USER PROFILE ─── */

export async function getAiUserProfile(supabase, userId) {
  const { data, error } = await supabase
    .from('ai_user_profiles')
    .select('summary')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data?.summary || ''
}

export async function upsertAiUserProfile(supabase, userId, summary) {
  const { error } = await supabase
    .from('ai_user_profiles')
    .upsert(
      { user_id: userId, summary },
      { onConflict: 'user_id', ignoreDuplicates: false }
    )

  if (error) throw new Error(error.message)
}

/** ─── ADMIN ANALYTICS ─── */

export async function getAdminStats(supabase) {
  const { count: totalUsers, error: e1 } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })

  const { count: premiumUsers, error: e2 } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('is_premium', true)

  const { count: totalHabits, error: e3 } = await supabase
    .from('habits')
    .select('id', { count: 'exact', head: true })

  const { count: totalLogs, error: e4 } = await supabase
    .from('habit_logs')
    .select('id', { count: 'exact', head: true })

  const { count: todayLogs, error: e5 } = await supabase
    .from('habit_logs')
    .select('id', { count: 'exact', head: true })
    .gte('date', new Date().toISOString().split('T')[0])

  const { data: habitsByType, error: e6 } = await supabase
    .from('habits')
    .select('type')

  if (e1 || e2 || e3 || e4 || e5 || e6) {
    throw new Error('Failed to fetch admin stats')
  }

  const goodHabits = (habitsByType || []).filter(h => h.type === 'good').length
  const badHabits = (habitsByType || []).filter(h => h.type === 'bad').length

  return {
    totalUsers: totalUsers || 0,
    premiumUsers: premiumUsers || 0,
    freeUsers: (totalUsers || 0) - (premiumUsers || 0),
    totalHabits: totalHabits || 0,
    totalLogs: totalLogs || 0,
    todayLogs: todayLogs || 0,
    goodHabits,
    badHabits,
  }
}

export async function getAdminUsers(supabase, options = {}) {
  let query = supabase
    .from('profiles')
    .select('id, username, display_name, role, is_premium, user_score, created_at')
    .order('created_at', { ascending: false })

  if (options.limit) query = query.limit(options.limit)

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data || []
}

export async function getAdminUserDetail(supabase, userId) {
  const supabaseAdmin = await _getAdminClient()

  // Fetch profile + habit stats
  const [profile, habits, logs] = await Promise.all([
    getProfile(supabase, userId),
    getHabits(supabase, userId),
    getHabitLogs(supabase, userId),
  ])

  if (!profile) throw new Error('User not found')

  return {
    profile,
    habits,
    logs,
    habitCount: habits.length,
    logCount: logs.length,
  }
}

/** ─── SUBSCRIPTIONS ─── */

export async function getSubscription(supabase, userId) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data || null
}

export async function upsertSubscription(supabaseAdmin, userId, subData) {
  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .upsert(
      { user_id: userId, ...subData },
      { onConflict: 'user_id', ignoreDuplicates: false }
    )
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

// Internal helper (avoids circular imports)
async function _getAdminClient() {
  const { createAdminClient } = await import('./admin')
  return createAdminClient()
}
