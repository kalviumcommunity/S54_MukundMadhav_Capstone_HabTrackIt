# HabTrackIt — Next.js Revamp

A full-stack habit tracking application built with Next.js 16, Supabase, and Gemini AI. Track habits, build streaks, and get AI-powered coaching with HabAIt.

## Live

- **New App**: [habtrackit.vercel.app](https://habtrackit.vercel.app)
- **Legacy App**: [habtrackit.vercel.app/old](https://habtrackit.vercel.app/old)

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Database | Supabase PostgreSQL (with RLS) |
| Auth | Supabase Auth (Email + Google OAuth) |
| AI | Google Gemini API (streaming, 5-model fallback) |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Charts | Recharts |
| Deploy | Vercel (Hobby tier) |

## Features

### Habit Tracking
- Add good and bad habits with two-button tracking (Done / Skip)
- Debounce + batch pattern: rapid clicks buffer locally, flush to server after 500ms of inactivity
- Streak calculation with optimistic UI and server authority
- Score system: +10 for positive actions, -10 for negative, undo reverses correctly

### HabAIt AI Mentor
- Streaming responses (word-by-word like ChatGPT)
- Chat sessions with full history
- User profile summaries generated every 10 messages for cross-session context
- Strict scope guardrails: only answers habit-related questions
- Fallback chain: gemini-3.5-flash → 3.1-flash-lite → 2.5-flash-lite → 3-flash → gemma-4-26b

### Admin Dashboard
- Platform stats: users, habits, logs, streaks
- 7-day activity chart and habit distribution pie chart
- User management with role assignment (user / premium / admin)
- Admins cannot change their own role

### UI/UX
- Responsive design (mobile, tablet, desktop)
- Dark theme with glassmorphism and animated gradient orbs
- Thin themed scrollbar
- Mobile-friendly navigation with slide-out menus

## Project Structure

```
new/
├── src/
│   ├── app/
│   │   ├── admin/          # Admin dashboard
│   │   ├── api/chat/stream # Streaming AI endpoint
│   │   ├── auth/callback   # OAuth callback handler
│   │   ├── dashboard/      # Main dashboard + chat
│   │   ├── login/          # Login page
│   │   └── signup/         # Signup page
│   ├── utils/
│   │   ├── gemini.js       # Gemini API with model fallback chain
│   │   ├── rbac.js         # Role-based access control
│   │   └── supabase/       # Supabase client, server, queries
│   └── proxy.js            # Next.js 16 proxy (was middleware)
├── public/
│   ├── favicon.svg
│   └── old/                # Legacy app static assets
└── supabase/
    ├── migration.sql           # Core schema
    └── migration_chat_sessions.sql  # Chat sessions + user profiles
```

## Setup

### Prerequisites
- Node.js 18+
- Supabase project (free tier)
- Google AI Studio API key (free tier)

### Local Development

```bash
cd new
npm install
cp .env.example .env.local
# Fill in your keys (see .env.example for required variables)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `GEMINI_API_KEY` | Google AI Studio API key |
| `NEXT_PUBLIC_APP_URL` | App base URL (`http://localhost:3000` for dev) |

### Database Setup

Run both migration files in Supabase SQL Editor:
1. `supabase/migration.sql` — core tables (profiles, habits, habit_logs, etc.)
2. `supabase/migration_chat_sessions.sql` — chat sessions + user profiles

After first signup, make yourself an admin:
```sql
UPDATE public.profiles SET role = 'admin' WHERE id = '<your-user-uuid>';
```

### Production (Vercel)

1. Push to `main` — auto-deploys on Vercel
2. Add environment variables in Vercel Dashboard → Settings → Environment Variables
3. Update Supabase Auth redirect URLs to include your production domain

## License

This project was developed as a capstone project.
