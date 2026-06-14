-- ============================================================
-- CHAT SESSIONS + USER PROFILE MIGRATION
-- Run this in Supabase SQL Editor
-- Safe to re-run (idempotent)
-- ============================================================

-- 1. AI CHAT SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.ai_chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New Chat',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_user_id ON public.ai_chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_updated_at ON public.ai_chat_sessions(user_id, updated_at DESC);

ALTER TABLE public.ai_chat_sessions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users manage own sessions' AND tablename = 'ai_chat_sessions') THEN
    CREATE POLICY "Users manage own sessions"
      ON public.ai_chat_sessions FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- 2. AI CHAT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.ai_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.ai_chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'model')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_session_id ON public.ai_chat_messages(session_id, created_at ASC);

ALTER TABLE public.ai_chat_messages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users manage own messages' AND tablename = 'ai_chat_messages') THEN
    CREATE POLICY "Users manage own messages"
      ON public.ai_chat_messages FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.ai_chat_sessions
          WHERE id = session_id AND user_id = auth.uid()
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.ai_chat_sessions
          WHERE id = session_id AND user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- 3. AI USER PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.ai_user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  summary TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_ai_user_profiles_user_id ON public.ai_user_profiles(user_id);

ALTER TABLE public.ai_user_profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users manage own AI profile' AND tablename = 'ai_user_profiles') THEN
    CREATE POLICY "Users manage own AI profile"
      ON public.ai_user_profiles FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- 4. UPDATED_AT TRIGGERS (drop first to avoid duplicates)
DROP TRIGGER IF EXISTS update_ai_chat_sessions_updated_at ON public.ai_chat_sessions;
CREATE TRIGGER update_ai_chat_sessions_updated_at
  BEFORE UPDATE ON public.ai_chat_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_ai_user_profiles_updated_at ON public.ai_user_profiles;
CREATE TRIGGER update_ai_user_profiles_updated_at
  BEFORE UPDATE ON public.ai_user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
