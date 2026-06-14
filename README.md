# HabTrackIt

**HabTrackIt** is a comprehensive habit tracking platform designed to empower users in cultivating positive habits and breaking undesirable ones. The application has been fully revamped from a legacy MERN stack app to a modern Next.js 16 application with Supabase, AI-powered coaching, and a production-ready architecture.

## Why the Revamp?

The original HabTrackIt was built two years ago as a capstone project using the MERN stack (MongoDB, Express, React, Node.js). While functional, the technology landscape has shifted significantly. The revamp was driven by:

1. **Learning Scope**: Two years of technology evolution brought new patterns — App Router, Server Components, streaming responses, and edge-ready architectures. The revamp is a hands-on exploration of where web development has moved.

2. **AI Integration**: The original app had no AI capabilities. The revamp introduces **HabAIt**, an AI habit mentor powered by Google Gemini with streaming responses, chat sessions, user personality profiling, and strict scope guardrails — demonstrating how to integrate LLMs responsibly into a product.

3. **Infrastructure Modernization**: Moving from a separate frontend (Vite/React) + backend (Express/MongoDB) to a single Next.js app with Supabase eliminates the need for a custom backend server. Supabase provides PostgreSQL, authentication, row-level security, and real-time capabilities out of the box.

4. **Production Readiness**: The original app had basic auth and no security policies. The revamp adds row-level security on every table, role-based access control (user/premium/admin), admin-protected server actions, and proper environment separation.

5. **UX Quality**: The original UI was functional but basic. The revamp introduces a polished dark theme with glassmorphism, responsive design across all devices, optimistic UI patterns with server reconciliation, and streaming AI responses for a modern chat experience.

## Application URLs

| | URL |
|---|---|
| **New App** | [habtrackit.vercel.app](https://habtrackit.vercel.app) |
| **Legacy App** | [habtrackit.vercel.app/old](https://habtrackit.vercel.app/old) |

The new application is served at the base URL. The legacy application is accessible under the `/old` path for reference.

## What Changed

| Aspect | Legacy (MERN) | Revamp (Next.js) |
|---|---|---|
| Frontend | React (Vite) | Next.js 16 (App Router) |
| Backend | Express.js | Server Actions + API Routes |
| Database | MongoDB (Mongoose) | PostgreSQL (Supabase) |
| Auth | Custom JWT | Supabase Auth (Email + Google OAuth) |
| AI | None | Gemini API (streaming, 5-model fallback) |
| Security | Basic | RLS + RBAC on every table |
| Hosting | Vercel (FE) + Render (BE) | Vercel only |
| Mobile | Basic responsive | Full responsive with touch targets |

## Legacy Application

The original application is preserved under the `/old` path and in the `client/` directory. It used:
- **React.js** with Vite
- **Chakra UI** for components
- **MongoDB** with Mongoose for data
- **Express.js** for the backend API
- **Firebase** for push notifications

## New Application

The revamped application lives in the `new/` directory and uses:
- **Next.js 16** with App Router and Turbopack
- **Supabase** for PostgreSQL, auth, and row-level security
- **Gemini AI** for the HabAIt mentor with streaming responses
- **Tailwind CSS v4** with custom dark theme
- **Framer Motion** for animations
- **Recharts** for data visualization

### Key Features
- Two-button habit tracking (Done / Skip) with debounce+batch pattern
- Score and streak system with optimistic UI
- HabAIt AI mentor with chat sessions and user profiling
- Admin dashboard with user management
- Responsive dark-theme UI

### Project Structure
```
├── new/                  # Next.js 16 application (active)
│   ├── src/app/          # Pages and API routes
│   ├── src/utils/        # Utilities, Supabase, Gemini
│   └── supabase/         # SQL migrations
├── client/               # Legacy React app (archived)
└── server/               # Legacy Express backend (archived)
```

## Setup

See [`new/README.md`](new/README.md) for detailed setup instructions.

```bash
cd new
npm install
cp .env.example .env.local  # Fill in your keys
npm run dev
```

## Contact

- Email: [mukundmadhav054@gmail.com](mailto:mukundmadhav054@gmail.com?subject=HabTrackIt)
- GitHub: [mukundmadhav054](https://github.com/mukundmadhav054)
