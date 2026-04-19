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
- Configurable auto-logout after inactivity (5, 15, or 30 minutes — or never)— timeout set per user in Profile settings
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

Timezone caveat: The cron job runs at 00:00 UTC. Since Supabase Edge Functions have no concept of per-user timezones, every user's day closes at the same UTC midnight regardless of where they are. For a user in Morocco (UTC+1 in summer), the day closes at 01:00 local time. For a user in Paris (UTC+2), it closes at 02:00. For a user in New York (UTC-4), it closes at 20:00 the previous evening. The data is always accurate — only the closing time drifts from local midnight. A proper fix would store each user's timezone in their profile and adjust the closing logic per user, but this is a post-launch improvement and not a blocker for a personal finance app at this stage.

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

The timeout duration is configurable per user — stored in the `profiles` table as `auto_logout` (5, 15, or 30 minutes, or never) and passed into the hook at runtime from the auth context. The hook is throttled to fire at most once every 3 seconds using `clearTimeout/setTimeout`, and all event listeners are registered as passive to avoid blocking scroll and touch performance.

### Profile Page and Settings Architecture

The Profile page serves as both the user profile and the app settings. It is a single `/profile` route divided into three sections: Profile (display name, email, member since, change password), Settings (currency, spending limits, auto-logout timer), and Danger Zone (delete account).

Two navbar entry points lead to the same page. Clicking the avatar navigates to `/profile` and scrolls to the top. Clicking Settings in the dropdown navigates to `/profile#settings` and triggers a `useEffect` that calls `scrollIntoView` on the settings section ref. No separate `/settings` route is needed — the hash is the only differentiator.

### Account Deletion

Account deletion is handled by a Supabase Edge Function (`delete-account`) rather than client-side code. `supabase.auth.admin.deleteUser()` requires service role privileges and cannot be called from the browser. The function receives the user's JWT via the `Authorization` header, verifies it using a user-scoped client to get the caller's id, then uses the service role client to delete all data in order — expenses, days, weeks, months, years, profile — before finally deleting the auth user.

The function has **Verify JWT disabled** in Supabase settings. This is intentional: JWT verification is handled manually inside the function using the user-scoped client, which gives full control over the auth check and prevents any mismatch between Supabase's built-in verification and the manual flow. The function still rejects unauthenticated requests — it just does so explicitly in code rather than at the gateway level.

After the Edge Function returns successfully, the client attempts `supabase.auth.signOut()` inside a try/catch. If it throws a 403 — which happens when the session is already invalidated by the time signOut runs — the error is silently caught and the user is redirected regardless. The `finally` block always navigates to `/`, ensuring the user lands on the login page whether signOut succeeded or not.

The Danger Zone UI requires the user to type `DELETE` (all caps) before the button activates. This is a standard pattern for destructive actions (used by GitHub, Vercel, Linear) that prevents accidental deletion while keeping the flow entirely in-page without a modal.

### Component vs Page Separation

Pages are route-level components — they map to a URL and are rendered by React Router. Components are reusable pieces that pages are composed from. If it has a route, it is a page. If it gets used inside something else, it is a component.

### Dashboard UX

The Dashboard shows the current active period only. A row of filter buttons (Day / Week / Month / Year) switches the total display — the same pill pattern used in Ledger v1 for category filtering. The expense form is always visible — no modal, no extra click. The goal is minimum friction for a daily-use app. History is a separate page that shows all closed periods. The Dashboard is "right now." History is "everything that already happened."

### Dashboard Period Totals

The Day/Week/Month/Year filter on the Dashboard shows real calculated totals, not hardcoded values. Each period total is computed from two sources: the sum of all closed days in that period from the days table, plus today's live expenses from the expenses table. A single Supabase query fetches all closed days from January 1st to yesterday, then filters in JavaScript for week, month, and year — one round trip instead of three.
The current week is defined as Monday 00:00 to Sunday 23:59. The start of the week is calculated client-side by finding the most recent Monday relative to today's date. If today is Sunday, it goes back 6 days; otherwise it goes back day - 1 days.
When an expense is added or deleted, all three period totals update optimistically in state without a refetch, so switching between Day/Week/Month/Year instantly reflects the change.
If no days are closed and no expenses have been added today, all periods show 0.

### Spending Limits

Users can set a daily and monthly spending limit from the Profile settings. The daily limit is the primary guardrail — it is actionable in the moment and shows a live progress bar on the Dashboard. The monthly limit provides a broader view of whether spending is on track across the full month. Both limits trigger warning states as the user approaches and exceeds them.
The monthly warning is intentionally hidden when the user is under 80% of their limit — it only appears when it is actionable. Below that threshold it adds visual noise without useful information.

### Row Level Security

All database tables have RLS enabled with explicit policies. Users can only read, insert, update, or delete their own rows — enforced at the database level, not just application logic. Even if someone bypassed the frontend entirely and called the Supabase API directly, they would only ever be able to access their own data.

### ExpenseInput vs Expense Type

The `ExpenseForm` component accepts an `ExpenseInput` type rather than a full `Expense`. This is intentional — the form only knows three things: description, amount, and category. The `id` and `createdAt` fields are generated by Supabase on insert and returned in the response. Passing a full `Expense` with a fake `id` and local `createdAt` to the form would create a misleading contract where the caller constructs fields that are immediately discarded. `ExpenseInput` makes the boundary explicit.

### Error Handling

Each form validates input client-side before hitting Supabase. Login and Register validate email format and password length, and map raw Supabase error messages to readable ones — "Invalid login credentials" becomes "Incorrect email or password", "User already registered" becomes "An account with this email already exists." Password minimum is 8 characters consistently across Register, Login, and ChangePasswordForm.
The Dashboard handles Supabase fetch failures with a fetchError state — if either the expenses or days query fails on load, the user sees a "Something went wrong, please refresh" message instead of a blank screen.
All inputs clear their error state as soon as the user starts typing, so errors never linger after the user has already corrected them.

###  History Pagination

The History page uses real Supabase pagination rather than a client-side slice with a hard cap. Each section (Days, Weeks, Months) fetches an initial batch from the database and loads more on demand. The limit + 1 trick is used to determine if more records exist — each query requests one more item than needed, and if that extra item comes back, hasMore is set to true and the "Show more" button appears. No separate count query needed. Years are always fetched in full since there will never be more than a handful. This ensures no historical data is ever silently hidden from the user regardless of how long they use the app.

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

The `profiles` table extends the Supabase auth user with app-specific fields: `display_name`, `currency`, `daily_limit`, `monthly_limit`, and `auto_logout`. These are fetched once on login and stored in the auth context, making them available to any component in the app without additional database calls.

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

```
supabase/
└── functions/
    ├── close-periods/   # Cron job — closes days, weeks, months, years at 00:00
    └── delete-account/  # Deletes all user data and auth user server-side
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
