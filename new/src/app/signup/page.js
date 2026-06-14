'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { User, Mail, Lock, Eye, EyeOff, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const supabase = createClient();

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);

    if (password.length < 8) { setError('Password must be at least 8 characters.'); setLoading(false); return; }

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email, password,
        options: { data: { username }, emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (authError) { setError(authError.message); }
      else if (data.session === null) { setSuccess('Account created! Check your email to confirm.'); }
      else { setSuccess('Sign up successful!'); window.location.href = '/dashboard'; }
    } catch { setError('An unexpected error occurred.'); } finally { setLoading(false); }
  };

  const handleGoogleSignup = async () => {
    setError(''); setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (authError) { setError(authError.message); setLoading(false); }
    } catch { setError('Failed to initialize Google Sign up.'); setLoading(false); }
  };

  return (
    <div className="flex-1 min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-[#07080e]">
      <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] bg-cyan-600/10 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-600 flex items-center justify-center font-black text-[#07080e] text-lg group-hover:scale-105 transition-transform">
              H
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">HabTrackIt</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Get Started</h1>
          <p className="text-slate-400 text-sm mt-1.5">Create an account to start tracking with HabAIt</p>
        </div>

        <div className="bg-[#0c0e17]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 sm:p-8 shadow-2xl">
          {error && (
            <div className="bg-red-950/40 border border-red-500/20 text-red-300 text-xs px-4 py-3 rounded-xl flex items-center gap-2.5 mb-5">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 text-xs px-4 py-3 rounded-xl flex items-center gap-2.5 mb-5">
              <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <button onClick={handleGoogleSignup} disabled={loading} className="w-full bg-white hover:bg-slate-100 text-slate-900 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition cursor-pointer disabled:opacity-50">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.04c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 1.74 14.96 1 12 1 7.35 1 3.39 3.65 1.5 7.5l3.86 3C6.27 7.62 8.91 5.04 12 5.04z"/>
              <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.76 2.92c2.2-2.03 3.67-5.01 3.67-8.65z"/>
              <path fill="#FBBC05" d="M5.36 14.88c-.24-.72-.38-1.49-.38-2.28 0-.79.14-1.56.38-2.28L1.5 7.32C.54 9.22 0 11.35 0 12.6c0 1.25.54 3.38 1.5 5.28l3.86-3z"/>
              <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.76-2.92c-1.04.7-2.38 1.11-4.2 1.11-3.09 0-5.73-2.58-6.66-5.46L1.48 15.8C3.37 19.65 7.33 23 12 23z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-white/[0.06]"></div>
            <span className="px-4 text-xs text-slate-500 uppercase tracking-widest font-medium">or</span>
            <div className="flex-1 border-t border-white/[0.06]"></div>
          </div>

          <form onSubmit={handleEmailSignup} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input type="text" required disabled={loading} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="habittracker" autoComplete="username" className="form-input pl-10 text-sm" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input type="email" required disabled={loading} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" className="form-input pl-10 text-sm" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input type={showPassword ? 'text' : 'password'} required disabled={loading} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters" autoComplete="new-password" className="form-input pl-10 pr-10 text-sm" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold py-3 mt-1 rounded-xl flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-600/25 cursor-pointer disabled:opacity-50">
              {loading ? 'Creating account...' : 'Create Account'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-400 mt-8">
          Already have an account?{' '}
          <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline transition">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
