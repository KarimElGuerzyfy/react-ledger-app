# Ledger v2 — Full-Stack Expense Tracker

A full-stack, multi-user expense tracking application built with React, TypeScript, and Supabase. This is the second iteration of Ledger, rebuilt from the ground up after the original vanilla JavaScript version. The goal was to take everything learned from v1 and rebuild it properly — with real authentication, a real database, a structured data model, and TypeScript throughout.

The core idea is simple: **the day is the atomic unit.** You engage with the app daily, logging expenses as they happen. The weekly, monthly, and yearly totals are just summaries built from those closed days.

---

## Live Demo

_Coming soon_

---

## Screenshots

_Coming soon — design in progress_

---

## Features

**At launch:**
- Email and password authentication via Supabase
- Multi-user — every user's data is fully isolated via Row Level Security
- Add and delete expenses with description, amount, and category
- Daily spending limit with warning (approaching and exceeded states)
- Monthly spending limit with warning — set alongside the daily limit in Profile settings
- Period filter on Dashboard (Day / Week / Month / Year) — switches the total display instantly
- History page with expandable sections for all closed days, weeks, months, and years
- Currency setting (MAD, EUR, USD, GBP, AED) — applies across the entire app
- Automatic period closing at exactly 00:00 via Supabase cron Edge Functions
- Configurable auto-logout after inactivity (5, 15, or 30 minutes — or never)
- Onboarding screen on first login
- Embedded tutorial video on the login page
- Fully responsive

**Planned updates:**
- Stats page — charts showing spending by category, week over week comparison, biggest spending days
- CSV export — download your full expense history

---

## Technologies Used

- **React 19** + **Vite 8** — frontend framework and build tool
- **TypeScript** — type safety throughout the entire codebase
- **Tailwind CSS v4** — utility-first styling
- **React Router DOM** — client-side routing with nested layouts
- **Supabase** — authentication, PostgreSQL database, and Edge Functions for scheduled cron jobs
- **Lucide React** — icon library

---

## Architecture Decisions

### Why React + Vite over Next.js

This app does not need server-side rendering or SEO. It is a personal finance tool behind a login wall — no public pages, no need for search indexing. Next.js would add a layer of complexity (server components, server actions, file-based routing) that has nothing to do with what this app needs. The backend work is handled entirely by Supabase. React + Vite keeps the focus on the product and TypeScript.

### Why Supabase

Supabase provides three things in one place: authentication, a PostgreSQL database with Row Level Security, and Edge Functions for scheduled jobs. Every user's data is isolated at the database level — not just in application logic. The period-closing logic runs on the server at 00:00 every day, regardless of whether any user has the app open. A browser tab cannot run code when it is closed. Supabase can.

### Why TypeScript

The data model for this app is complex: expenses belong to days, days roll up into weeks and months independently, and both roll up into years. In vanilla JavaScript, keeping track of all of that is error-prone. TypeScript makes the model explicit and lets the editor enforce it. Every type is defined once in `src/types/index.ts` and used everywhere. If a type changes, TypeScript shows every place in the codebase that needs to be updated.

### Period Closing Logic

Days close at 00:00. Weeks close at Sunday 00:00 and are labeled Week 1–52. Months close at the last second of the month. **Weeks and months are independent** — a month may close mid-week, and the week keeps accumulating until its own Sunday closing. Both draw their totals from closed days — they never store expenses directly.

All of this runs via Supabase cron Edge Functions — server-side scheduled jobs. Client-side closing (checking on page load whether a period has expired) is unreliable and inconsistent. Server-side closing ensures every user's data is treated the same way.

### Layout Architecture

The app uses two layouts:

- **AuthLayout** — Login and Register. Clean page with just the logo, no navigation.
- **AppLayout** — Dashboard, History, and Profile. Full navbar with navigation links.

Implemented using React Router's nested routes and the `<Outlet />` pattern. The layout renders once and page content is injected into the outlet slot. The navbar never remounts between navigations — it stays fixed while only the content below it changes.

### Auth Context and Profile in Global State

Authentication state and user profile settings (currency, daily limit, monthly limit, inactivity timeout) are stored in a React Context that wraps the entire app. This means any component can access the current user and their settings without prop drilling. The context listens to Supabase's `onAuthStateChange` — any login or logout anywhere in the app instantly updates the global state.

When the user updates their settings in the Profile page, `refreshProfile()` is called on the context, which re-fetches the profile from Supabase and updates the global state. This means the Dashboard immediately reflects the new currency and limits without requiring a page refresh.

### Inactivity Logout

Supabase's inactivity timeout is a Pro plan feature. Rather than upgrading, inactivity logout was implemented in code using a custom `useInactivityLogout` hook. The hook listens for user activity events (mouse movement, clicks, keystrokes, scrolling, touch) and resets a timer on each event. If the configured timeout passes with no activity, the user is automatically signed out and redirected to the login page. The hook is called once in `AppLayout` so it applies to all protected pages without repeating the logic.

The timeout duration is configurable per user — stored in the `profiles` table as `inactivity_timeout` (5, 15, or 30 minutes, or never) and passed into the hook at runtime from the auth context. The hook is throttled to fire at most once every 3 seconds using `clearTimeout/setTimeout`, and all event listeners are registered as passive to avoid blocking scroll and touch performance.

### Profile Page and Settings Architecture

The Profile page serves as both the user profile and the app settings. It is a single `/profile` route divided into three sections: Profile (display name, email, member since, change password), Settings (currency, spending limits, auto-logout timer), and Danger Zone (delete account).

Two navbar entry points lead to the same page. Clicking the avatar navigates to `/profile` and scrolls to the top. Clicking Settings in the dropdown navigates to `/profile#settings` and triggers a `useEffect` that calls `scrollIntoView` on the settings section ref. No separate `/settings` route is needed — the hash is the only differentiator.

### Component vs Page Separation

Pages are route-level components — they map to a URL and are rendered by React Router. Components are reusable pieces that pages are composed from. If it has a route, it is a page. If it gets used inside something else, it is a component.

### Dashboard UX

The Dashboard shows the current active period only. A row of filter buttons (Day / Week / Month / Year) switches the total display — the same pill pattern used in Ledger v1 for category filtering. The expense form is always visible — no modal, no extra click. The goal is minimum friction for a daily-use app. History is a separate page that shows all closed periods. The Dashboard is "right now." History is "everything that already happened."

### Spending Limits

Users can set a daily and monthly spending limit from the Profile settings. The daily limit is the primary guardrail — it is actionable in the moment and shows a live progress bar on the Dashboard. The monthly limit provides a broader view of whether spending is on track across the full month. Both limits trigger warning states as the user approaches and exceeds them.

### Row Level Security

All database tables have RLS enabled with explicit policies. Users can only read, insert, update, or delete their own rows — enforced at the database level, not just application logic. Even if someone bypassed the frontend entirely and called the Supabase API directly, they would only ever be able to access their own data.

---

## Data Model

All types are defined in `src/types/index.ts`.

```ts
type Category = 'Food' | 'Transport' | 'Entertainment' | 'Shopping' | 'Health' | 'Bills' | 'Other'

type Expense = {
  id: string         // UUID from Supabase
  description: string
  amount: number
  category: Category
  createdAt: string  // ISO 8601 date string
}

type Day = {
  id: string
  date: string       // e.g. "2026-04-07"
  totalSpent: number
  expenses: Expense[]
  isClosed: boolean
}

type Week = {
  id: string
  weekNumber: number // 1–52
  year: number
  totalSpent: number
  days: Day[]
  isClosed: boolean
}

type Month = {
  id: string
  monthNumber: number // 1–12
  year: number
  totalSpent: number
  days: Day[]
  isClosed: boolean
}

type Year = {
  id: string
  year: number
  totalSpent: number
  isClosed: boolean
}

type User = {
  id: string
  email: string
  createdAt: string
}
```

The `profiles` table extends the Supabase auth user with app-specific fields: `display_name`, `currency`, `daily_limit`, `monthly_limit`, and `inactivity_timeout`. These are fetched once on login and stored in the auth context, making them available to any component in the app without additional database calls.

---

## Project Structure

```
src/
├── components/       # Reusable UI components
├── context/          # Auth context and profile state
├── hooks/            # Custom hooks (useAuth, useInactivityLogout)
├── layouts/          # AuthLayout and AppLayout
├── lib/              # Supabase client setup
├── pages/            # Route-level page components
├── types/            # TypeScript type definitions
├── App.tsx           # Router and route definitions
├── index.css         # Tailwind import
└── main.tsx          # App entry point
```

---

## Pages

| Route | Layout | Description |
|---|---|---|
| `/` | AuthLayout | Login page with embedded tutorial video |
| `/register` | AuthLayout | Register page |
| `/dashboard` | AppLayout | Main app — add expenses, view current period totals |
| `/history` | AppLayout | Browse all closed days, weeks, months, and years |
| `/profile` | AppLayout | Change password, set currency, spending limits, auto-logout timer, delete account. Doubles as the settings page via `#settings` anchor scroll |

---

## Build Approach

This project was built UI-first with fake data, then wired to the real backend. The frontend was fully built and tested with hardcoded placeholder data before Supabase was connected. This kept frontend progress decoupled from backend readiness and made it easier to reason about component structure and data flow independently.

The workflow: **types → routing skeleton → page UI → logic → Supabase wiring.**

---

## Author

Karim El Guerzyfy — Frontend Developer focused on React and modern UI development. Currently building projects and expanding skills in full-stack development, TypeScript, and database integration.

GitHub: [KarimElGuerzyfy](https://github.com/KarimElGuerzyfy)
