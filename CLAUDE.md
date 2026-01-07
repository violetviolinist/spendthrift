# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**[View full technical architecture →](./ARCHITECTURE.md)**

## Project Overview

Spendthrift is an expense tracking application built with Next.js 16, React 19, and TypeScript. The project uses the Next.js App Router architecture.

## Common Commands

### Development
```bash
npm run dev        # Start development server (localhost:3000) - auto-runs migrations
npm run build      # Build production bundle
npm start          # Start production server
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
```

### Database
```bash
npm run db:generate # Generate new migration from schema changes
npm run db:migrate  # Apply pending migrations
npm run db:push     # Push schema directly (development only)
npm run db:studio   # Open Drizzle Studio for database GUI
npm run db:seed     # Seed database with sample data
```

**Database Setup**: The project uses SQLite with Drizzle ORM. Migrations run automatically with `npm run dev`. For fresh setups, ensure migrations are applied before starting.

## Architecture

### Next.js App Router Structure
- **App Directory**: All routes and pages live in `src/app/`
- **Root Layout**: `src/app/layout.tsx` - defines metadata and global HTML structure
- **Home Page**: `src/app/page.tsx` - main landing page
- **Global Styles**: `src/app/globals.css`

### Path Aliases
- `@/*` maps to `./src/*` - use this for all imports from the src directory

### TypeScript Configuration
- Target: ES2017
- Strict mode enabled
- JSX: react-jsx (modern transform, no React import needed in components)

### Code Style
Prettier is integrated with ESLint:
- Double quotes for strings
- Semicolons required
- 2-space indentation
- 80 character line width
- ES5 trailing commas
- Arrow function parentheses always included

ESLint warnings (not errors) on Prettier violations - run `npm run format` to auto-fix.

---

## Backend Architecture

### Database Schema (`src/db/schema.ts`)
SQLite database with Drizzle ORM. Three main tables:

**Users Table**
- `id`: CUID2 primary key (auto-generated)
- `email`: Unique, required
- `name`: Optional
- `password`: Hashed with bcrypt (12 rounds)
- `createdAt`, `updatedAt`: Timestamps

**Categories Table**
- `id`: CUID2 primary key
- `name`: Required (max 50 chars)
- `color`: Optional hex color string
- `icon`: Optional emoji string
- `userId`: Optional (null = default/system category, non-null = user-specific)
- `createdAt`: Timestamp

**Expenses Table**
- `id`: CUID2 primary key
- `userId`: Required, foreign key to users (cascade delete)
- `categoryId`: Optional, foreign key to categories (set null on delete)
- `amount`: Real number, required
- `description`: Required (max 200 chars)
- `date`: Timestamp, required
- `createdAt`, `updatedAt`: Timestamps

### Database Queries (`src/db/queries/`)
Centralized query functions for each entity:

- **`users.ts`**: `getUserByEmail`, `getUserById`, `createUser`, `updateUser`
- **`categories.ts`**: `getCategoriesByUserId`, `getDefaultCategories`, `getAllCategoriesForUser`, `getCategoryById`, `createCategory`, `updateCategory`, `deleteCategory`
- **`expenses.ts`**: `getExpensesByUserId`, `getExpenseById`, `createExpense`, `updateExpense`, `deleteExpense`, `getExpensesByDateRange`, `getExpensesByCategoryId`, `getExpensesPaginated`

### Authentication (`src/lib/auth.ts`)
NextAuth v5 (beta) with credentials provider:
- JWT session strategy
- Custom login page at `/login`
- Session includes `id`, `email`, `name`
- Dynamic imports in authorize() to avoid edge runtime issues

### Middleware (`src/middleware.ts`)
Route protection:
- Authenticated users on `/login` or `/register` → redirect to `/dashboard`
- Unauthenticated users on `/dashboard/*` → redirect to `/login?from=...`
- Matcher: `/dashboard`, `/dashboard/:path*`, `/login`, `/register`

### API Routes (`src/app/api/`)

**Authentication**
- `POST /api/auth/register` - User registration (validates with Zod, hashes password, creates user)
- `GET/POST /api/auth/[...nextauth]` - NextAuth handlers

**Expenses**
- `GET /api/expenses` - List expenses (paginated, filterable by category, date range, sortable)
- `POST /api/expenses` - Create expense (validates category access)
- `GET /api/expenses/[id]` - Get single expense
- `PATCH /api/expenses/[id]` - Update expense
- `DELETE /api/expenses/[id]` - Delete expense

**Categories**
- `GET /api/categories` - List all categories (user's + default)
- `POST /api/categories` - Create category
- `PATCH /api/categories/[id]` - Update category (user-owned only)
- `DELETE /api/categories/[id]` - Delete category (user-owned only)

**User**
- `GET /api/user` - Get current user profile
- `PATCH /api/user` - Update user profile
- `PATCH /api/user/password` - Change password

### API Helpers (`src/lib/api-helpers.ts`)
- `withAuth(handler)`: HOC that wraps routes with authentication
- `handleApiError(error)`: Standardized error responses (Zod validation, generic errors)
- `validateRequest(schema, data)`: Zod schema validation
- `getUser(req)`: Extract authenticated user from request

### Validation Schemas (`src/lib/validations/`)
Zod schemas for request validation:
- **auth.ts**: `loginSchema`, `registerSchema`
- **expense.ts**: `createExpenseSchema`, `updateExpenseSchema`
- **category.ts**: `createCategorySchema`, `updateCategorySchema`

---

## Frontend Architecture

### Route Structure

```
src/app/
├── layout.tsx              # Root layout (SessionProvider, Toaster)
├── page.tsx                # Landing page (redirects to dashboard if logged in)
├── globals.css             # Tailwind v4 theme + custom animations
├── (auth)/
│   ├── login/page.tsx      # Login page
│   └── register/page.tsx   # Registration page
├── dashboard/
│   ├── layout.tsx          # Dashboard layout (Navbar, auth check)
│   ├── page.tsx            # Dashboard home (stats cards, recent expenses)
│   ├── expenses/
│   │   ├── page.tsx        # Expenses list (CRUD operations)
│   │   └── [id]/edit/page.tsx  # Edit expense page
│   └── categories/
│       └── page.tsx        # Categories management
└── api/                    # API routes (see Backend section)
```

### Component Organization

**Layout Components (`src/components/layout/`)**
- `navbar.tsx`: Sticky header with logo, nav links (Dashboard, Expenses, Categories), mobile sheet menu, user menu
- `user-menu.tsx`: Avatar dropdown with Profile, Settings, Sign out options

**Auth Components (`src/components/auth/`)**
- `login-form.tsx`: Login form with react-hook-form + Zod validation, success message after registration
- `register-form.tsx`: Registration form with name, email, password fields

**Expense Components (`src/components/expenses/`)**
- `expense-form.tsx`: Create/edit expense form with amount, description, category select, date picker
- `expense-list.tsx`: Renders list of expenses with loading skeleton and empty state
- `expense-list-item.tsx`: Individual expense card with date, category badge, description, amount, edit/delete buttons

**Category Components (`src/components/categories/`)**
- `category-form.tsx`: Create/edit category with name, icon (emoji), color picker
- `category-list.tsx`: Grid of categories with edit/delete (user-owned only)
- `category-badge.tsx`: Styled badge with icon and color

**UI Components (`src/components/ui/`)**
shadcn/ui pattern with Radix UI primitives:
- `button.tsx`, `input.tsx`, `textarea.tsx`, `label.tsx`
- `card.tsx`, `badge.tsx`, `avatar.tsx`, `skeleton.tsx`
- `dialog.tsx`, `alert-dialog.tsx`, `delete-confirmation-dialog.tsx`
- `dropdown-menu.tsx`, `select.tsx`, `popover.tsx`, `sheet.tsx`
- `calendar.tsx` (react-day-picker), `form.tsx`, `separator.tsx`
- `sonner.tsx` (toast notifications), `table.tsx`

**Providers (`src/components/providers/`)**
- `session-provider.tsx`: NextAuth SessionProvider wrapper

### Styling

**Tailwind CSS v4** with CSS-first configuration in `globals.css`:
- Custom theme variables: `--color-primary: #16a34a` (green), etc.
- Border radius: `--radius: 0.75rem`
- Custom `animate-slide-in` animation for page transitions

**Design Patterns**
- Cards with `border-2`, `hover:shadow-lg` transitions
- Consistent spacing with `space-y-*` utilities
- Responsive: mobile-first with `sm:`, `md:`, `lg:` breakpoints
- Loading states: pulse animations, skeletons
- Empty states: centered with icon, message, CTA button

### State Management
- **Server Components**: Dashboard pages fetch data directly from database queries
- **Client Components**: Use `useState` + `useEffect` + `fetch()` for CRUD pages
- **Forms**: react-hook-form with zodResolver for validation
- **Toast**: sonner for success/error notifications

### Key Libraries
- **UI**: Radix UI primitives, class-variance-authority, tailwind-merge, clsx
- **Forms**: react-hook-form, @hookform/resolvers, zod
- **Date**: date-fns, react-day-picker
- **Icons**: lucide-react
- **Auth**: next-auth (client hooks: useSession, signIn, signOut)

### Utility Functions (`src/lib/`)
- `utils.ts`: `cn()` - merges Tailwind classes with clsx + tailwind-merge
- `format.ts`: `formatCurrency()`, `formatDate()`, `formatDateTime()` helpers
- `auth-helpers.ts`: `hashPassword()`, `verifyPassword()`, `getSession()`, `getCurrentUser()`

### Type Definitions (`src/types/`)
- `next-auth.d.ts`: Extends NextAuth Session/User/JWT types with `id`, `email`, `name`

---

## Key Patterns & Conventions

1. **Data Fetching**
   - Server components: Direct database queries via `src/db/queries/*`
   - Client components: `fetch('/api/...')` with loading/error states

2. **Form Handling**
   - Always use react-hook-form + zodResolver
   - Validation schemas in `src/lib/validations/`
   - Display errors with `errors.fieldName.message`

3. **API Routes**
   - Wrap protected routes with `withAuth()` HOC
   - Validate input with `validateRequest(schema, body)`
   - Return consistent JSON: `{ data }` or `{ error: string }`

4. **Components**
   - UI primitives in `components/ui/` (shadcn pattern)
   - Feature components in `components/<feature>/`
   - All client components marked with `"use client"`

5. **Styling**
   - Use `cn()` for conditional classes
   - Prefer utility classes over custom CSS
   - Consistent use of design tokens (colors, spacing, radius)
