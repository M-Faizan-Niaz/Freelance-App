# Vite+ Monorepo

A modern monorepo powered by Vite+, pnpm, Next.js, React, Hono, and Drizzle ORM.

## Structure

```
├── apps/
│   ├── web/          Next.js 16.2 Todo App (Tailwind + shadcn/ui)
│   └── admin/        React Admin Panel (TanStack Router + React Query + Zustand)
└── packages/
    └── api/          Hono.js Backend (Drizzle ORM + PostgreSQL)
```

## Prerequisites

- Node.js 22+
- pnpm 10+
- PostgreSQL (for backend)

## Getting Started

### Install dependencies

```bash
pnpm install
```

### Development

Run all apps in development mode:

```bash
pnpm dev
# or
vp run -r dev
```

Run individual apps:

```bash
# Next.js web app
vp run --filter web dev

# Admin panel
vp run --filter admin dev

# API server
vp run --filter api dev
```

### Build

```bash
pnpm build
# or
vp run -r build
```

### Code Quality

```bash
# Lint all packages
pnpm lint

# Format all packages
pnpm fmt

# Run full check (format + lint + type-check)
pnpm check
```

### Database

```bash
cd packages/api

# Generate migrations
pnpm db:generate

# Push schema to database
pnpm db:push

# Open Drizzle Studio
pnpm db:studio
```

## Tech Stack

### Frontend (apps/web)

- Next.js 16.2
- React 19
- Tailwind CSS 4
- shadcn/ui components

### Admin Panel (apps/admin)

- React 19
- Vite 6
- TanStack Router
- TanStack React Query
- Zustand
- Tailwind CSS 4
- shadcn/ui components

### Backend (packages/api)

- Hono.js
- Drizzle ORM 0.45
- PostgreSQL (postgres driver)
- Zod validation
- TypeScript

### Tooling

- Vite+ (linting, formatting, testing, commit hooks)
- pnpm workspaces
- TypeScript 5.8

## Environment Setup

### API (packages/api)

Copy `.env.example` to `.env` in `packages/api`:

```bash
cp packages/api/.env.example packages/api/.env
```

Update `DATABASE_URL` with your PostgreSQL connection string.

### Frontend Apps

Ports are configurable via environment variables:

- **Admin**: Create `apps/admin/.env` with `VITE_PORT=3002` (default: 3002)
- **Web**: Create `apps/web/.env` with `PORT=3000` (default: 3000)
- **API**: Set `PORT=9999` in `packages/api/.env` (default: 3001)

## Ports

| App   | Default Port | Env Variable |
| ----- | ------------ | ------------ |
| Web   | 3000         | `PORT`       |
| Admin | 3002         | `VITE_PORT`  |
| API   | 9999         | `PORT`       |

## Commands

### Development

```bash
# Start all apps (API, Web, Admin)
pnpm dev

# Or run individually
pnpm dev:api    # API server on PORT (default: 9999)
pnpm dev:web    # Next.js app on PORT (default: 3000)
pnpm dev:admin  # Admin panel on VITE_PORT (default: 3002)
```

### Build

```bash
pnpm build
```

### Code Quality

```bash
pnpm lint    # Lint all packages
pnpm fmt     # Format all packages
pnpm check   # Full check (format + lint + type-check)
```

### Database

```bash
pnpm db:generate  # Generate migrations
pnpm db:migrate   # Run migrations
pnpm db:push      # Push schema to database
pnpm db:studio    # Open Drizzle Studio
```
