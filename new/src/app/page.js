import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { Sparkles, ArrowRight, Trophy, BarChart3, MessageSquare, ShieldCheck, Terminal, Brain, Zap, Target, Flame } from 'lucide-react';

export default async function Home() {
  let isLoggedIn = false;
  let hasCredentials = true;
  let userRole = 'user';

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    hasCredentials = false;
  } else {
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      isLoggedIn = !!user;
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        userRole = profile?.role || 'user';
      }
    } catch (e) { isLoggedIn = false; }
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {!hasCredentials && (
        <div className="bg-amber-950/40 border-b border-amber-500/20 px-4 py-3 text-center">
          <div className="max-w-4xl mx-auto flex items-center justify-center gap-3 text-sm text-amber-300">
            <Terminal className="h-4 w-4 text-amber-400 shrink-0" />
            <span>Set up your <code className="bg-black/40 px-2 py-0.5 rounded font-mono text-amber-400">.env.local</code> to get started</span>
          </div>
        </div>
      )}

      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[120px] animate-gradientOrb"></div>
        <div className="absolute top-1/3 -right-40 h-[400px] w-[400px] rounded-full bg-cyan-500/[0.08] blur-[100px] animate-gradientOrb" style={{ animationDelay: '-4s' }}></div>
        <div className="absolute -bottom-40 left-1/3 h-[450px] w-[450px] rounded-full bg-purple-500/[0.08] blur-[110px] animate-gradientOrb" style={{ animationDelay: '-8s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 h-16 sm:h-20 border-b border-white/[0.04] bg-[#07080e]/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-600 flex items-center justify-center font-black text-[#07080e] text-lg group-hover:scale-105 transition-transform">
              H
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">HabTrackIt</span>
          </Link>

          <nav className="flex items-center gap-4 sm:gap-8">
            <a href="#features" className="text-sm text-slate-400 hover:text-white transition hidden sm:block">Features</a>
            {isLoggedIn && userRole === 'admin' && (
              <Link href="/admin" className="text-amber-400 hover:text-amber-300 transition flex items-center gap-1.5 text-sm">
                <ShieldCheck className="h-4 w-4" /> Admin
              </Link>
            )}
            <Link
              href={isLoggedIn ? "/dashboard" : "/login"}
              className="text-sm bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold px-5 py-2 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-600/25 whitespace-nowrap"
            >
              {isLoggedIn ? "Dashboard" : "Sign In"}
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16 lg:py-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="flex flex-col gap-6 sm:gap-8">
              <div className="inline-flex items-center gap-2 bg-indigo-950/50 border border-indigo-800/30 text-indigo-300 px-4 py-1.5 rounded-full text-xs font-semibold w-fit">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                The Intelligent Habit Tracker
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.05] text-white">
                Build Habits That{' '}
                <span className="gradient-text">Stick.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl">
                Track your daily routines, earn streak rewards, and get personalized coaching from <strong className="text-white">HabAIt</strong> — your AI habit mentor that adapts to your progress.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  href={hasCredentials ? (isLoggedIn ? "/dashboard" : "/login") : "#"}
                  className={`flex items-center justify-center gap-2 text-base font-bold py-3.5 px-7 rounded-xl transition-all hover:-translate-y-0.5 text-center ${
                    hasCredentials
                      ? "bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-[#07080e] shadow-lg shadow-cyan-500/25"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50"
                  }`}
                >
                  {isLoggedIn ? "Go to Dashboard" : "Start Your Journey"}
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <a href="#features" className="flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.06] text-white font-semibold py-3.5 px-7 rounded-xl transition-all text-center">
                  Explore Features
                </a>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-6 sm:gap-10 pt-2 border-t border-white/[0.04]">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Zap className="h-4 w-4 text-cyan-400" />
                  <span>AI-powered</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Flame className="h-4 w-4 text-orange-400" />
                  <span>Streak tracking</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Target className="h-4 w-4 text-emerald-400" />
                  <span>Free to start</span>
                </div>
              </div>
            </div>

            {/* Hero right - preview card */}
            <div className="hidden lg:flex justify-center items-center relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-transparent to-cyan-500/20 rounded-full blur-3xl"></div>
              <div className="w-full max-w-md bg-[#0c0e17]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 sm:p-8 shadow-2xl relative animate-float">
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/30"></div>
                    <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase">HabAIt Mentor</span>
                  </div>
                  <span className="text-[10px] bg-cyan-950/50 text-cyan-400 px-2.5 py-1 rounded-full font-mono border border-cyan-800/30 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
                    Active
                  </span>
                </div>

                <div className="py-5 space-y-3">
                  <div className="bg-[#07080e]/60 border border-white/[0.03] text-slate-300 text-xs py-3 px-4 rounded-2xl max-w-[80%] rounded-bl-none leading-relaxed">
                    &ldquo;I keep skipping my morning meditation. Any advice?&rdquo;
                  </div>
                  <div className="bg-indigo-950/40 border border-indigo-800/20 text-indigo-200 text-xs py-3 px-4 rounded-2xl max-w-[85%] ml-auto rounded-br-none leading-relaxed">
                    <span className="font-semibold text-[10px] text-cyan-400 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                      <Sparkles className="h-3 w-3" /> HabAIt
                    </span>
                    Start with just 2 minutes. Anchor it to your existing morning coffee routine. Stacking habits makes them automatic.
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">Weekly Progress</span>
                    <div className="text-lg font-bold text-white mt-0.5">+85%</div>
                  </div>
                  <div className="flex gap-1 items-end h-8">
                    <div className="w-2.5 bg-slate-800 rounded-sm h-[30%]"></div>
                    <div className="w-2.5 bg-indigo-600 rounded-sm h-[45%]"></div>
                    <div className="w-2.5 bg-indigo-500 rounded-sm h-[55%]"></div>
                    <div className="w-2.5 bg-indigo-400 rounded-sm h-[70%]"></div>
                    <div className="w-2.5 bg-cyan-400 rounded-sm h-[85%]"></div>
                    <div className="w-2.5 bg-cyan-300 rounded-sm h-[100%]"></div>
                    <div className="w-2.5 bg-emerald-400 rounded-sm h-[90%] shadow-lg shadow-emerald-400/30"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 bg-black/30 border-t border-white/[0.04] py-20 sm:py-28 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-14">
            <span className="text-xs text-indigo-400 font-semibold tracking-widest uppercase bg-indigo-950/40 px-3 py-1.5 rounded-full border border-indigo-800/30">Everything you need</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-3">Engineered for Consistency</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Tools designed to help you build positive routines, break unwanted habits, and stay motivated every day.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <div key={i} className="group glass-panel p-6 sm:p-7 hover:-translate-y-1">
                <div className={`h-10 w-10 rounded-xl ${f.bg} border ${f.border} flex items-center justify-center ${f.color} mb-5 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative z-10 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-20">
          <div className="glass-panel-accent rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 bg-cyan-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 h-40 w-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
            <div className="relative">
              <Brain className="h-10 w-10 text-cyan-400 mx-auto mb-4" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">Ready to Transform Your Habits?</h2>
              <p className="text-slate-400 max-w-lg mx-auto mb-8">Join HabTrackIt and let HabAIt guide you toward a more consistent, productive routine.</p>
              <Link
                href={isLoggedIn ? "/dashboard" : "/login"}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-[#07080e] font-bold py-3.5 px-8 rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all hover:-translate-y-0.5"
              >
                Get Started Free <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.04] bg-[#07080e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between text-xs text-slate-500">
          <span>&copy; 2026 HabTrackIt. All rights reserved.</span>
          <a href="https://github.com/mukundmadhav054" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">GitHub</a>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: <MessageSquare className="h-5 w-5" />,
    title: "HabAIt Mentor",
    desc: "AI coach that analyzes your habits and delivers personalized suggestions to optimize your daily routine.",
    color: "text-cyan-400",
    bg: "bg-cyan-950/50",
    border: "border-cyan-800/30",
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: "Smart Dashboard",
    desc: "Visual progress tracking with weekly diagnostics, completion rates, and heatmaps to see your growth.",
    color: "text-indigo-400",
    bg: "bg-indigo-950/50",
    border: "border-indigo-800/30",
  },
  {
    icon: <Trophy className="h-5 w-5" />,
    title: "Streaks & Scores",
    desc: "Build streaks for good habits, break bad ones. Your score reflects your daily commitment and progress.",
    color: "text-emerald-400",
    bg: "bg-emerald-950/50",
    border: "border-emerald-800/30",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Private & Secure",
    desc: "Your data is isolated with PostgreSQL Row-Level Security. Enterprise-grade protection out of the box.",
    color: "text-purple-400",
    bg: "bg-purple-950/50",
    border: "border-purple-800/30",
  },
];
