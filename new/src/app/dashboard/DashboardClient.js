'use client';

import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { 
  LogOut, Plus, Trash2, Check, Flame, Trophy, 
  Send, Sparkles, BarChart3, AlertTriangle, X, ShieldCheck,
  Menu, Brain, MessageSquare
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { addHabit, deleteHabitAction, sendMentorMessage, batchToggleHabits, fetchChatSessions, createNewChatSession, deleteChatSessionAction, fetchSessionMessages } from './actions';

export default function DashboardClient({
  initialProfile,
  initialHabits,
  initialLogs,
  initialChartData,
  initialChatHistory
}) {
  const [profile, setProfile] = useState(initialProfile);
  const [habits, setHabits] = useState(initialHabits);
  const [logs, setLogs] = useState(initialLogs);
  const [chartData, setChartData] = useState(initialChartData);
  const [chatHistory, setChatHistory] = useState(initialChatHistory);
  
  const [messageInput, setMessageInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitType, setNewHabitType] = useState('good');
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Chat session state
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const chatInputRef = useRef(null);
  const chatEndRef = useRef(null);
  const userSentMsg = useRef(false);
  const supabase = createClient();
  const pendingChanges = useRef(new Map());
  const flushTimer = useRef(null);
  const baseScore = useRef(profile?.userScore || 0);
  const pendingDeltas = useRef(new Map());

  useEffect(() => { setMounted(true); }, []);

  // Sync baseScore from server response only
  const applyServerScore = (score) => {
    baseScore.current = score;
    pendingDeltas.current.clear();
  };

  // Flush pending changes to server after 500ms of inactivity
  const flushChanges = async () => {
    if (pendingChanges.current.size === 0) return;
    const changes = Object.fromEntries(pendingChanges.current);
    pendingChanges.current.clear();
    try {
      const res = await batchToggleHabits(todayStr, changes);
      if (res.success) {
        applyServerScore(res.newScore);
        setProfile(prev => ({ ...prev, userScore: res.newScore }));
        setHabits(prev => prev.map(h => res.streaks[h.id] !== undefined ? { ...h, streak: res.streaks[h.id] } : h));
        updateAnalyticsChart();
      }
    } catch (err) {
      setError(err.message || 'Failed to sync habits.');
    }
  };

  // Schedule flush — resets on every new change
  const scheduleFlush = () => {
    if (flushTimer.current) clearTimeout(flushTimer.current);
    flushTimer.current = setTimeout(flushChanges, 500);
  };

  // Flush on unmount
  useEffect(() => {
    return () => {
      if (flushTimer.current) clearTimeout(flushTimer.current);
      if (pendingChanges.current.size > 0) flushChanges();
    };
  }, []);

  const getTodayStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = getTodayStr();


  // Load chat sessions on mount
  useEffect(() => {
    (async () => {
      try {
        const s = await fetchChatSessions();
        setSessions(s);
        if (s.length > 0) {
          setActiveSessionId(s[0].id);
        }
      } catch {
        // Sessions table may not exist yet
      }
    })();
  }, []);

  // Scroll chat to bottom only after user sends a message
  useEffect(() => {
    if (userSentMsg.current) {
      userSentMsg.current = false;
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [chatHistory, aiLoading]);

  // Load messages when session changes
  useEffect(() => {
    if (!activeSessionId) { setChatHistory([]); return; }
    (async () => {
      try {
        const msgs = await fetchSessionMessages(activeSessionId);
        setChatHistory(msgs);
      } catch {}
    })();
  }, [activeSessionId]);

  const handleNewSession = async () => {
    try {
      const s = await createNewChatSession();
      setSessions(prev => [s, ...prev]);
      setActiveSessionId(s.id);
      setChatHistory([]);
      setSidebarOpen(false);
      // Gently scroll to show the chat input
      setTimeout(() => {
        chatInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        chatInputRef.current?.focus();
      }, 100);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      await deleteChatSessionAction(sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      if (activeSessionId === sessionId) {
        const remaining = sessions.filter(s => s.id !== sessionId);
        setActiveSessionId(remaining[0]?.id || null);
        setChatHistory([]);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const getTodayStatus = (habitId) => {
    const log = logs.find(l => l.habit_id === habitId && l.date === todayStr);
    return log?.status || null;
  };

  const handleHabitAction = (habitId, action) => {
    const currentStatus = getTodayStatus(habitId);
    const newStatus = action === 'done' ? 'completed' : 'skipped';

    // If already acted, any click = undo. Otherwise apply new action.
    const finalStatus = currentStatus ? null : newStatus;

    // Optimistic UI update
    setLogs(prev => {
      const filtered = prev.filter(l => !(l.habit_id === habitId && l.date === todayStr));
      if (finalStatus) {
        filtered.push({ habit_id: habitId, date: todayStr, status: finalStatus });
      }
      return filtered;
    });

    // Update streak optimistically
    const habit = habits.find(h => h.id === habitId);
    if (habit) {
      const isGood = habit.type === 'good';
      const positive = (isGood && finalStatus === 'completed') || (!isGood && finalStatus === 'skipped');
      const newStreak = finalStatus === null
        ? Math.max(0, (habit.streak || 0) - 1)
        : positive ? (habit.streak || 0) + 1 : 0;
      setHabits(prev => prev.map(h => h.id === habitId ? { ...h, streak: newStreak } : h));
    }

    // Score: stable base + sum of all pending deltas
    if (finalStatus === null) {
      pendingDeltas.current.delete(habitId);
    } else {
      const isGood = habit?.type === 'good';
      const positive = (isGood && finalStatus === 'completed') || (!isGood && finalStatus === 'skipped');
      pendingDeltas.current.set(habitId, positive ? 10 : -10);
    }
    const totalDelta = [...pendingDeltas.current.values()].reduce((a, b) => a + b, 0);
    setProfile(prev => ({ ...prev, userScore: Math.max(0, baseScore.current + totalDelta) }));

    // Buffer change for batch send
    pendingChanges.current.set(habitId, finalStatus);
    scheduleFlush();
  };

  const updateAnalyticsChart = () => {
    const chart = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLogs = logs.filter(l => l.date === dateStr);
      chart.push({
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        date: dateStr,
        Completed: dayLogs.filter(l => l.status === 'completed').length,
        Total: habits.length
      });
    }
    setChartData(chart);
  };

  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;
    setActionLoading(true);
    setError('');
    try {
      const res = await addHabit(newHabitTitle.trim(), newHabitType);
      setHabits(prev => [...prev, res]);
      setNewHabitTitle('');
      setModalOpen(false);
      updateAnalyticsChart();
    } catch (err) {
      setError(err.message || 'Failed to add habit.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteHabit = async (habitId) => {
    if (!confirm('Are you sure you want to delete this habit and all its logs?')) return;
    try {
      const res = await deleteHabitAction(habitId);
      if (res.success) {
        setHabits(prev => prev.filter(h => h.id !== habitId));
        setLogs(prev => prev.filter(l => l.habit_id !== habitId));
        updateAnalyticsChart();
      }
    } catch (err) {
      setError('Failed to delete habit.');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || aiLoading) return;
    const userMsg = messageInput.trim();
    setMessageInput('');

    // Auto-create session if none active
    let sessionId = activeSessionId;
    if (!sessionId) {
      try {
        const s = await createNewChatSession();
        setSessions(prev => [s, ...prev]);
        sessionId = s.id;
        setActiveSessionId(s.id);
      } catch (err) {
        setError(err.message);
        return;
      }
    }

    // Optimistic UI — show user message immediately
    userSentMsg.current = true;
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setAiLoading(true);

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: userMsg }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to get response');
      }

      // Stream the response chunk by chunk
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botText = '';

      // Add empty bot message placeholder
      setChatHistory(prev => [...prev, { role: 'model', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        botText += chunk;
        // Update only the last message (the bot's) with accumulated text
        setChatHistory(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'model', content: botText };
          return updated;
        });
      }

      // Refresh sessions list to update titles
      fetchChatSessions().then(s => setSessions(s)).catch(() => {});
    } catch (err) {
      setError(err.message || 'Failed to connect to HabAIt.');
    } finally {
      setAiLoading(false);
    }
  };

  const totalStreaks = habits.reduce((acc, h) => acc + (h.streak || 0), 0);
  const goodHabits = habits.filter(h => h.type === 'good');
  const badHabits = habits.filter(h => h.type === 'bad');

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#07080e]">
      {/* Header */}
      <header className="h-14 sm:h-20 border-b border-white/[0.04] bg-[#07080e]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto h-full px-3 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="/dashboard" className="flex items-center gap-2">
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center font-black text-[#07080e] text-sm sm:text-lg">
                H
              </div>
              <span className="font-extrabold text-base sm:text-xl tracking-tight text-white">HabTrackIt</span>
            </a>
          </div>

          <div className="hidden sm:flex items-center gap-4 sm:gap-6">
            {profile.role === 'admin' && (
              <a href="/admin" className="text-amber-400 hover:text-amber-300 transition flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/[0.03] text-sm">
                <ShieldCheck className="h-4 w-4" />
                <span>Admin</span>
              </a>
            )}
            <span className="text-sm text-slate-400">
              <span className="hidden md:inline">Welcome back, </span>
              <span className="text-white font-semibold">{profile.username}</span>
            </span>
            <button onClick={handleSignOut} className="text-slate-400 hover:text-white transition flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/[0.03] text-sm cursor-pointer">
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="sm:hidden text-slate-400 p-2.5 -mr-1 rounded-lg hover:bg-white/[0.05] cursor-pointer">
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-white/[0.04] bg-[#0c0e17] px-3 py-4 flex flex-col gap-3 animate-fadeIn">
            {profile.role === 'admin' && (
              <a href="/admin" className="text-amber-400 flex items-center gap-2 text-sm py-2" onClick={() => setMobileMenuOpen(false)}>
                <ShieldCheck className="h-4 w-4" /> Admin Panel
              </a>
            )}
            <span className="text-sm text-slate-400">
              Logged in as <span className="text-white font-semibold">{profile.username}</span>
            </span>
            <button onClick={handleSignOut} className="text-slate-400 hover:text-white flex items-center gap-2 text-sm py-2 cursor-pointer">
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 w-full flex flex-col gap-4 sm:gap-6">
        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="bg-red-950/40 border border-red-500/20 text-red-300 text-xs px-3 sm:px-4 py-3 rounded-lg flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                <span className="truncate">{error}</span>
              </span>
              <button onClick={() => setError('')} className="text-red-400 hover:text-red-300 shrink-0 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-panel p-4 sm:p-6 flex items-center justify-between border border-white/[0.02] relative overflow-hidden group hover:border-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/5 transition-all">
            <div className="absolute top-0 right-0 h-24 w-24 bg-cyan-400/5 rounded-full blur-xl group-hover:bg-cyan-400/10 transition-all pointer-events-none"></div>
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest font-semibold">Habit Score</span>
              <span className="text-2xl sm:text-3xl font-black text-white mt-1 sm:mt-2 flex items-center gap-2">
                {profile.userScore}
                <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-400" />
              </span>
            </div>
            <span className="text-[10px] sm:text-xs text-cyan-400 bg-cyan-950/40 border border-cyan-800/30 px-2 sm:px-2.5 py-1 rounded whitespace-nowrap">Rank</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-4 sm:p-6 flex items-center justify-between border border-white/[0.02] relative overflow-hidden group hover:border-orange-500/20 hover:shadow-lg hover:shadow-orange-500/5 transition-all">
            <div className="absolute top-0 right-0 h-24 w-24 bg-orange-400/5 rounded-full blur-xl group-hover:bg-orange-400/10 transition-all pointer-events-none"></div>
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest font-semibold">Streaks</span>
              <span className="text-2xl sm:text-3xl font-black text-white mt-1 sm:mt-2 flex items-center gap-2">
                {totalStreaks}
                <Flame className="h-5 w-5 sm:h-6 sm:w-6 text-orange-400" />
              </span>
            </div>
            <span className="text-[10px] sm:text-xs text-orange-400 bg-orange-950/40 border border-orange-800/30 px-2 sm:px-2.5 py-1 rounded whitespace-nowrap">Days</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-panel p-4 sm:p-6 flex items-center justify-between border border-white/[0.02] relative overflow-hidden group hover:border-purple-500/20 hover:shadow-lg hover:shadow-purple-500/5 transition-all">
            <div className="absolute top-0 right-0 h-24 w-24 bg-purple-400/5 rounded-full blur-xl group-hover:bg-purple-400/10 transition-all pointer-events-none"></div>
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest font-semibold">Habits</span>
              <span className="text-2xl sm:text-3xl font-black text-white mt-1 sm:mt-2">{habits.length}</span>
            </div>
            <button onClick={() => setModalOpen(true)} className="text-[10px] sm:text-xs inline-flex items-center justify-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2.5 sm:px-3 py-1.5 rounded-lg font-semibold cursor-pointer whitespace-nowrap hover:shadow-lg hover:shadow-indigo-500/30 transition-all">
              <Plus className="h-3 sm:h-3.5 w-3 sm:w-3.5" /> Add
            </button>
          </motion.div>
        </section>

        {/* Main Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
          {/* Left: Habits */}
          <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-6">
            {/* Good Habits */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-4 sm:p-6 border border-white/[0.02] flex flex-col gap-3 sm:gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/30"></span>
                  Good Habits
                </h2>
                <span className="text-[10px] sm:text-xs text-emerald-400 font-semibold bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-800/30">{goodHabits.length}</span>
              </div>

              <div className="flex flex-col gap-2 sm:gap-3 min-h-[80px] sm:min-h-[120px]">
                {goodHabits.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs sm:text-sm border border-dashed border-white/[0.03] rounded-xl p-4 sm:p-6 text-center">
                    <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-slate-600 mb-2" />
                    No good habits yet. Tap <span className="text-indigo-400 font-semibold">+ Add</span> to begin.
                  </div>
                ) : (
                  goodHabits.map((h, i) => {
                    const status = getTodayStatus(h.id);
                    const acted = status !== null;
                    return (
                      <motion.div key={h.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }} className={`flex items-center justify-between p-3 sm:p-4 rounded-xl border transition-all ${
                        status === 'completed' ? 'bg-emerald-950/20 border-emerald-500/15 opacity-70' :
                        status === 'skipped' ? 'bg-red-950/15 border-red-500/10 opacity-50' :
                        'bg-white/[0.01] border-white/[0.04] hover:bg-white/[0.02] hover:border-white/[0.08]'
                      }`}>
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleHabitAction(h.id, 'done')} className={`h-8 w-8 sm:h-7 sm:w-7 rounded-lg border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                              status === 'completed' ? 'bg-emerald-500 border-emerald-500 text-[#07080e] shadow-lg shadow-emerald-500/30' : 'border-white/20 hover:border-emerald-400/40 hover:bg-emerald-500/10'
                            }`}>
                              <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </button>
                            <button onClick={() => handleHabitAction(h.id, 'skip')} className={`h-8 w-8 sm:h-7 sm:w-7 rounded-lg border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                              status === 'skipped' ? 'bg-red-500 border-red-500 text-[#07080e] shadow-lg shadow-red-500/30' : 'border-white/20 hover:border-red-400/40 hover:bg-red-500/10'
                            }`}>
                              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </button>
                          </div>
                          <span className={`font-semibold text-xs sm:text-sm truncate transition-all ${
                            acted ? 'line-through text-slate-500' : 'text-white'
                          }`}>
                            {h.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                          <span className="text-[10px] sm:text-xs flex items-center gap-1 text-orange-400 bg-orange-950/40 px-1.5 sm:px-2 py-0.5 rounded border border-orange-900/30 whitespace-nowrap">
                            <Flame className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-orange-400" />
                            {h.streak}d
                          </span>
                          <button onClick={() => handleDeleteHabit(h.id)} className="text-slate-500 hover:text-red-400 p-2 hover:bg-red-950/30 hover:border-red-900/30 rounded-lg transition cursor-pointer">
                            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>

             {/* Bad Habits */}
             <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-panel p-4 sm:p-6 border border-white/[0.02] flex flex-col gap-3 sm:gap-4">
               <div className="flex items-center justify-between">
                 <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                   <span className="h-2 w-2 rounded-full bg-red-400 shadow-lg shadow-red-400/30"></span>
                   Bad Habits
                 </h2>
                 <span className="text-[10px] sm:text-xs text-red-400 font-semibold bg-red-950/40 px-2 py-0.5 rounded-full border border-red-800/30">{badHabits.length}</span>
               </div>

              <div className="flex flex-col gap-2 sm:gap-3 min-h-[80px] sm:min-h-[120px]">
                {badHabits.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs sm:text-sm border border-dashed border-white/[0.03] rounded-xl p-4 sm:p-6 text-center">
                    <Check className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-500/50 mb-2" />
                    No bad habits tracked. Nice job!
                  </div>
                ) : (
                  badHabits.map((h, i) => {
                    const status = getTodayStatus(h.id);
                    const acted = status !== null;
                    return (
                      <motion.div key={h.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }} className={`flex items-center justify-between p-3 sm:p-4 rounded-xl border transition-all ${
                        status === 'completed' ? 'bg-red-950/20 border-red-500/15 opacity-70' :
                        status === 'skipped' ? 'bg-emerald-950/15 border-emerald-500/10 opacity-50' :
                        'bg-white/[0.01] border-white/[0.04] hover:bg-white/[0.02] hover:border-white/[0.08]'
                      }`}>
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleHabitAction(h.id, 'done')} className={`h-8 w-8 sm:h-7 sm:w-7 rounded-lg border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                              status === 'completed' ? 'bg-red-500 border-red-500 text-[#07080e] shadow-lg shadow-red-500/30' : 'border-white/20 hover:border-red-400/40 hover:bg-red-500/10'
                            }`}>
                              <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </button>
                            <button onClick={() => handleHabitAction(h.id, 'skip')} className={`h-8 w-8 sm:h-7 sm:w-7 rounded-lg border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                              status === 'skipped' ? 'bg-emerald-500 border-emerald-500 text-[#07080e] shadow-lg shadow-emerald-500/30' : 'border-white/20 hover:border-emerald-400/40 hover:bg-emerald-500/10'
                            }`}>
                              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </button>
                          </div>
                          <span className={`font-semibold text-xs sm:text-sm truncate transition-all ${
                            acted ? 'line-through text-slate-500' : 'text-white'
                          }`}>
                            {h.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                          <span className="text-[10px] sm:text-xs flex items-center gap-1 text-orange-400 bg-orange-950/40 px-1.5 sm:px-2 py-0.5 rounded border border-orange-900/30 whitespace-nowrap">
                            <Flame className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-orange-400" />
                            {h.streak}d
                          </span>
                          <button onClick={() => handleDeleteHabit(h.id)} className="text-slate-500 hover:text-red-400 p-2 hover:bg-red-950/30 hover:border-red-900/30 rounded-lg transition cursor-pointer">
                            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>

          {/* Right: AI Mentor */}
          <div className="lg:col-span-5">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel border border-white/[0.02] flex flex-col h-[400px] sm:h-[520px]">
              <div className="p-3 sm:p-4 border-b border-white/[0.04] flex items-center justify-between bg-gradient-to-r from-indigo-950/20 to-transparent">
                <div className="flex items-center gap-2">
                  <button onClick={() => setSidebarOpen(!sidebarOpen)} className="sm:hidden text-slate-400 hover:text-white p-1 rounded cursor-pointer">
                    <MessageSquare className="h-4 w-4" />
                  </button>
                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <span className="font-bold text-white text-xs sm:text-sm">HabAIt Mentor</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleNewSession} className="text-[10px] bg-cyan-950/40 border border-cyan-800/30 text-cyan-400 px-2 py-0.5 rounded font-mono flex items-center gap-1 hover:bg-cyan-900/40 transition cursor-pointer">
                    <Plus className="h-3 w-3" /> New
                  </button>
                  <span className="text-[10px] bg-cyan-950/40 border border-cyan-800/30 text-cyan-400 px-2 py-0.5 rounded font-mono flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live
                  </span>
                </div>
              </div>

              <div className="flex flex-1 min-h-0">
                {/* Sidebar — desktop always visible when sessions exist, mobile toggle */}
                {sessions.length > 0 && (
                  <>
                    {/* Desktop sidebar */}
                    <div className="hidden sm:flex flex-col w-[180px] border-r border-white/[0.04] flex-shrink-0">
                      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1 chat-scroll">
                        {sessions.map(s => (
                          <button
                            key={s.id}
                            onClick={() => setActiveSessionId(s.id)}
                            className={`text-left text-[10px] px-2 py-1.5 rounded-lg flex items-center justify-between gap-1 group cursor-pointer transition ${
                              activeSessionId === s.id
                                ? 'bg-indigo-950/40 border border-indigo-800/20 text-indigo-200'
                                : 'text-slate-400 hover:bg-white/[0.03] hover:text-slate-300'
                            }`}
                          >
                            <span className="truncate flex-1">{s.title}</span>
                            <span
                              onClick={(e) => { e.stopPropagation(); handleDeleteSession(s.id); }}
                              className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition cursor-pointer p-0.5"
                            >
                              <Trash2 className="h-3 w-3" />
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Mobile sidebar overlay */}
                    {sidebarOpen && (
                      <div className="sm:hidden fixed inset-0 z-50 flex">
                        <div className="w-64 bg-[#0c0e17] border-r border-white/[0.04] flex flex-col p-3">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-white">Chat History</span>
                            <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="h-4 w-4" /></button>
                          </div>
                          <button onClick={handleNewSession} className="text-[10px] bg-cyan-950/40 border border-cyan-800/30 text-cyan-400 px-2 py-1.5 rounded-lg flex items-center gap-1 justify-center mb-2 hover:bg-cyan-900/40 transition cursor-pointer">
                            <Plus className="h-3 w-3" /> New Chat
                          </button>
                          <div className="flex-1 overflow-y-auto flex flex-col gap-1 chat-scroll">
                            {sessions.map(s => (
                              <button
                                key={s.id}
                                onClick={() => { setActiveSessionId(s.id); setSidebarOpen(false); }}
                                className={`text-left text-[10px] px-2 py-1.5 rounded-lg flex items-center justify-between gap-1 group cursor-pointer transition ${
                                  activeSessionId === s.id
                                    ? 'bg-indigo-950/40 border border-indigo-800/20 text-indigo-200'
                                    : 'text-slate-400 hover:bg-white/[0.03]'
                                }`}
                              >
                                <span className="truncate flex-1">{s.title}</span>
                                <span
                                  onClick={(e) => { e.stopPropagation(); handleDeleteSession(s.id); }}
                                  className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition cursor-pointer p-0.5"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex-1 bg-black/60" onClick={() => setSidebarOpen(false)} />
                      </div>
                    )}
                  </>
                )}

                {/* Chat messages */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 flex flex-col gap-2 sm:gap-3 chat-scroll">
                {chatHistory.length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 text-slate-500 text-[10px] sm:text-xs leading-relaxed gap-2">
                    <Brain className="h-8 w-8 sm:h-10 sm:w-10 text-slate-600" />
                    <span className="font-semibold text-slate-400">Your AI Coach is Ready</span>
                    <span>Ask HabAIt for feedback on your streaks, routine optimizations, or tips to stay consistent.</span>
                  </div>
                )}

                {chatHistory.map((m, index) => (
                  <motion.div key={index} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`text-[10px] sm:text-xs p-2.5 sm:p-3 rounded-xl max-w-[85%] leading-relaxed break-words whitespace-pre-line ${
                    m.role === 'user'
                      ? 'bg-indigo-950/40 border border-indigo-800/20 text-indigo-200 self-end rounded-tr-none'
                      : 'bg-[#0c0e17]/60 border border-white/[0.03] text-slate-300 self-start rounded-tl-none'
                  }`}>
                    {m.role === 'model' && (
                      <span className="font-semibold text-[10px] text-cyan-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                        <Sparkles className="h-2.5 w-2.5" /> HabAIt
                      </span>
                    )}
                    {m.content}
                  </motion.div>
                ))}

                {aiLoading && (
                  <div className="bg-[#0c0e17]/60 border border-white/[0.03] text-slate-500 text-[10px] sm:text-xs p-2.5 sm:p-3 rounded-xl max-w-[80%] self-start rounded-tl-none">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                      <span>HabAIt is thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} className="h-0" />
                </div>
              </div>

              <form onSubmit={handleSendMessage} className="p-2 sm:p-3 border-t border-white/[0.04] flex gap-2 bg-white/[0.01]">
                <input ref={chatInputRef} type="text" required disabled={aiLoading} value={messageInput} onChange={(e) => setMessageInput(e.target.value)} placeholder="Ask HabAIt anything..." className="form-input text-[10px] sm:text-xs py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg flex-1" />
                <button type="submit" disabled={aiLoading} className="btn-accent px-3 sm:px-4 py-1.5 sm:py-2 flex items-center justify-center rounded-lg cursor-pointer disabled:opacity-50 hover:shadow-lg hover:shadow-cyan-500/30 transition-all">
                  <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </form>
            </motion.div>
          </div>
        </section>

        {/* Analytics */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-panel p-4 sm:p-6 border border-white/[0.02] flex flex-col gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-indigo-950/50 border border-indigo-800/30 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-400" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white">Weekly Diagnostics</h2>
          </div>
          
          <div className="h-48 sm:h-64 w-full">
            {mounted && chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#111422', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '11px', color: '#f8fafc' }} itemStyle={{ color: '#00f2fe' }} />
                  <Area type="monotone" dataKey="Completed" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorCompleted)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">Start tracking habits to see your weekly progress.</div>
            )}
          </div>
        </motion.section>
      </main>

      {/* Habit Creation Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div key="habit-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-sm glass-panel p-5 sm:p-6 border border-white/[0.05] relative mx-4" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setModalOpen(false)} className="absolute right-3 sm:right-4 top-3 sm:top-4 text-slate-500 hover:text-white transition cursor-pointer">
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>

              <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">+</div>
                <h3 className="text-base sm:text-lg font-bold text-white">Create New Habit</h3>
              </div>

              <form onSubmit={handleAddHabit} className="flex flex-col gap-3 sm:gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] sm:text-xs text-slate-400 font-semibold tracking-wider uppercase">Title</label>
                  <input type="text" required disabled={actionLoading} value={newHabitTitle} onChange={(e) => setNewHabitTitle(e.target.value)} placeholder="e.g. Read 10 pages" className="form-input text-xs sm:text-sm" autoFocus />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] sm:text-xs text-slate-400 font-semibold tracking-wider uppercase">Type</label>
                  <select value={newHabitType} onChange={(e) => setNewHabitType(e.target.value)} className="form-input text-xs sm:text-sm">
                    <option value="good">Good Habit — Build Streak</option>
                    <option value="bad">Bad Habit — Break Routine</option>
                  </select>
                </div>
                <div className="flex gap-2 mt-1 sm:mt-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1 py-2.5 sm:py-3 text-xs sm:text-sm cursor-pointer">Cancel</button>
                  <button type="submit" disabled={actionLoading} className="btn-accent flex-1 py-2.5 sm:py-3 text-xs sm:text-sm font-bold flex items-center justify-center cursor-pointer disabled:opacity-50">
                    {actionLoading ? 'Creating...' : 'Create Habit'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
