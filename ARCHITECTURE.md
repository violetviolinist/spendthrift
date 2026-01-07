# Spendthrift - Technical Architecture Overview

For someone new to Next.js, here's how the codebase is organized.

## Project Structure Overview

```
src/
├── app/          # Pages & API routes (Next.js App Router)
├── components/   # Reusable React components
├── db/           # Database layer (Drizzle ORM + SQLite)
├── lib/          # Utility functions, auth config, validation
└── types/        # TypeScript type definitions
```

---

## Key Concepts

### 1. **App Router (src/app/)**

Unlike traditional React where you manually set up routing, Next.js uses **file-based routing**. The folder structure *is* your URL structure:

| File Path | URL |
|-----------|-----|
| `src/app/page.tsx` | `/` (home) |
| `src/app/dashboard/page.tsx` | `/dashboard` |
| `src/app/dashboard/expenses/page.tsx` | `/dashboard/expenses` |
| `src/app/dashboard/expenses/[id]/edit/page.tsx` | `/dashboard/expenses/abc123/edit` |

**Special files:**
- `page.tsx` = the actual page content
- `layout.tsx` = wrapper that persists across child pages (like a template)
- `route.ts` = API endpoint (not a page)

### 2. **Route Groups: `(auth)`**

The parentheses in `(auth)` create a "route group" - it organizes files without affecting the URL:
- `src/app/(auth)/login/page.tsx` → URL is just `/login` (not `/auth/login`)

### 3. **Dynamic Routes: `[id]`**

Square brackets create dynamic segments:
- `src/app/dashboard/expenses/[id]/edit/page.tsx`
- The `[id]` part matches any value: `/dashboard/expenses/abc123/edit`

### 4. **Server vs Client Components**

Next.js has two types of React components:

| Server Components (default) | Client Components |
|-----------------------------|-------------------|
| Run on the server only | Run in the browser |
| Can directly query the database | Use `fetch()` to call APIs |
| Can't use React hooks (`useState`, etc.) | Must start with `"use client"` |

Example flow:
- `src/app/dashboard/page.tsx` (server) → directly calls `getExpensesByUserId()` from database
- `src/components/expenses/expense-form.tsx` (client) → uses `useState`, `fetch()`, form hooks

### 5. **Layouts**

Layouts wrap pages and persist across navigation:

```
layout.tsx (root) ← SessionProvider, global styles
  └── dashboard/layout.tsx ← Navbar, auth check
        └── expenses/page.tsx ← actual content
```

When you navigate between `/dashboard` and `/dashboard/expenses`, the Navbar doesn't re-render.

---

## Database Layer (src/db/)

Uses **Drizzle ORM** with SQLite:

```
src/db/
├── index.ts       # Database connection
├── schema.ts      # Table definitions (users, categories, expenses)
└── queries/       # Reusable query functions
    ├── users.ts
    ├── categories.ts
    └── expenses.ts
```

The schema defines tables in TypeScript (not raw SQL). Drizzle generates SQL migrations from schema changes.

---

## API Routes (src/app/api/)

Next.js lets you build backend APIs alongside your frontend. Files named `route.ts` become HTTP endpoints:

| File | HTTP Methods |
|------|--------------|
| `src/app/api/expenses/route.ts` | GET `/api/expenses`, POST `/api/expenses` |
| `src/app/api/expenses/[id]/route.ts` | GET/PATCH/DELETE `/api/expenses/abc123` |

These are just functions that receive a Request and return a Response.

---

## Authentication (NextAuth v5)

- **Config**: `src/lib/auth.ts` - uses "Credentials" provider (email/password)
- **Middleware**: `src/middleware.ts` - protects `/dashboard/*` routes
- **Session**: Available via `useSession()` hook in client components, `auth()` function in server code

---

## Component Organization

```
src/components/
├── ui/          # Generic building blocks (Button, Card, Input, Dialog)
├── layout/      # App structure (Navbar, UserMenu)
├── auth/        # Login/Register forms
├── expenses/    # Expense-specific components
└── categories/  # Category-specific components
```

The `ui/` folder follows the **shadcn/ui** pattern - pre-built components using Radix UI primitives that you copy into your project (not a npm package).

---

## Key Libraries

| Library | Purpose |
|---------|---------|
| `next-auth` | Authentication (sessions, login, logout) |
| `drizzle-orm` | Database ORM (type-safe queries) |
| `zod` | Schema validation (API input, forms) |
| `react-hook-form` | Form state management |
| `tailwindcss` | Utility-first CSS |
| `radix-ui` | Accessible UI primitives |
| `sonner` | Toast notifications |
