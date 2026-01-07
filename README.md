# Spendthrift

An expense tracking application built with Next.js 16, React 19, and TypeScript.

## Prerequisites

- Node.js 18+ and npm
- OpenSSL (for generating auth secrets)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Generate a secure secret for NextAuth:

```bash
openssl rand -base64 32
```

Update `.env.local` with your generated secret:

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret-here
```

### 3. Initialize the database

The database migrations will run automatically when you start the dev server. Alternatively, you can run them manually:

```bash
npm run db:migrate
```

### 4. Start the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## Available Scripts

### Development

- `npm run dev` - Start development server with auto-migration
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Database

- `npm run db:generate` - Generate new migration from schema changes
- `npm run db:migrate` - Apply pending migrations
- `npm run db:push` - Push schema directly to database (development)
- `npm run db:studio` - Open Drizzle Studio (database GUI)
- `npm run db:seed` - Seed database with sample data

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Drizzle ORM
- **Authentication**: NextAuth.js v5
- **UI Components**: Radix UI
- **Form Handling**: React Hook Form with Zod validation

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
├── db/              # Database schema and migrations
├── lib/             # Utility functions and helpers
└── types/           # TypeScript type definitions
```
