# BahmanSabz Frontend Challenge

A task-based Next.js application with three independent sections:

- Task 1: DummyJSON login + protected dashboard + users/products management
- Task 2: RAWG games list + advanced filters + game detail page
- Task 3: Reusable advanced multi-select component (search, groups, multi-select, virtualization)

The app is RTL-first (Persian UI), uses Vazirmatn font, Chakra UI (Task 1), and Tailwind utility styles (Task 2/3).

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- React 19
- Chakra UI 3
- Tailwind CSS 3
- Headless UI

## Project Structure

```text
src/
  app/
    page.tsx                  # Landing page (task navigation)
    task-1/                   # Auth + dashboard/users/products
    task-2/                   # RAWG list + detail
    task-3/                   # Advanced select demo
    api/rawg/                 # Internal RAWG proxy routes
  components/
    task1/
    task3/
    ui/
  lib/
    api/                      # DummyJSON + RAWG data layer
    auth/                     # Local storage session helpers
    theme/                    # Chakra system tokens
    utils/                    # Persian formatting helpers
```

## Prerequisites

- Node.js 20+
- npm 10+

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Create `.env.local` (optional but recommended for real RAWG data):

```bash
RAWG_API_KEY=your_rawg_api_key
```

Notes:

- If `RAWG_API_KEY` is missing (or RAWG request fails), Task 2 automatically falls back to local sample data.
- `NEXT_PUBLIC_RAWG_API_KEY` is also supported as fallback in code.

## Available Scripts

- `npm run dev`: start development server
- `npm run build`: production build
- `npm run start`: run production server
- `npm run lint`: run ESLint checks

## Testing Guide

There is no unit/integration test suite yet. Current verification uses:

1. Static checks

```bash
npm run lint
npm run build
```

2. Manual smoke tests

- Home page
  - Open `/` and verify navigation cards for Task 1, Task 2, Task 3.
- Task 1
  - Open `/task-1/login`.
  - Login with DummyJSON test user:
    - username: `emilys`
    - password: `emilyspass`
  - Verify redirect to `/task-1/dashboard`.
  - Verify route guard redirects unauthenticated access back to login.
  - Verify users/products pages support search, filtering, loading states, empty states, and pagination.
- Task 2
  - Open `/task-2`.
  - Verify source alert shows RAWG or fallback mode.
  - Verify search/filter/order controls and pagination.
  - Open a game detail page and verify key info (image, release date, rating, genres, platforms).
- Task 3
  - Open `/task-3`.
  - Verify search, grouped options, multi-select behavior, select-all-filtered, clear actions, and virtualized scrolling.

## Deployment

### Option A: Vercel (Recommended)

1. Push repository to GitHub/GitLab/Bitbucket.
2. Import project into Vercel.
3. Set environment variables in Vercel Project Settings:
   - `RAWG_API_KEY` (recommended)
4. Build/Output settings:
   - Framework: Next.js
   - Install command: `npm install`
   - Build command: `npm run build`
5. Deploy.

### Option B: Self-hosted Node server

```bash
npm install
npm run build
npm run start
```

Default runtime port is `3000` (or use `PORT` env var).

## Notes for Reviewers

- App is intentionally organized by task routes to keep each requirement isolated.
- Task 2 includes resilient fallback behavior for environments without RAWG credentials.
- External image hosts are configured in `next.config.ts`.
