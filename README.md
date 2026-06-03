# EventCraft - Automated Invitation Card Generation & Event Reminder Management

> Research project - NOUN Faculty of Education, Department of Educational Technology

Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, **TanStack Query v5**, **react-hook-form**, and **Next.js API routes**.

## Quick Start

```bash
npm install
npm run dev
```

The app runs at `http://localhost:3000`.

Without Supabase environment variables, the API uses the seed data in `data/db.json` as an in-memory local fallback. This is useful for demos and development, but changes reset when the dev server restarts.

**Demo login:** `john@eventcraft.com` / `password123`

## Deploy On Vercel With Supabase

1. Create a Supabase project.
2. Open the Supabase SQL editor and run `supabase/schema.sql`.
3. In Supabase project settings, copy your Project URL and service role key.
4. In Vercel, add:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Deploy the project on Vercel.

The frontend and backend deploy as one Vercel project. The browser calls `/api/...`; those Next.js route handlers read and write Supabase.

For local Supabase testing, create `.env.local` from `.env.example` and restart `npm run dev`. If no Supabase env variables are present, the API uses in-memory seed data from `data/db.json`.

Do not use `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` for this API backend. Supabase row-level security blocks inserts with the publishable key, and that key is meant for browser-safe client usage. Use `SUPABASE_SERVICE_ROLE_KEY` only in `.env.local` and Vercel environment variables.

## API

The app exposes json-server-compatible endpoints through Next.js API routes:

```text
GET    /api/events
GET    /api/events/:id
POST   /api/events
PATCH  /api/events/:id
DELETE /api/events/:id

GET    /api/guests
GET    /api/guests?eventId=N
POST   /api/guests
PATCH  /api/guests/:id
DELETE /api/guests/:id

GET    /api/reminders
GET    /api/reminders?eventId=N
POST   /api/reminders
PATCH  /api/reminders/:id
DELETE /api/reminders/:id

GET    /api/templates

GET    /api/users
GET    /api/users?email=user@example.com
POST   /api/users
```

## Full Feature Set

| Module | Route | Features |
|---|---|---|
| Auth | `/login` `/register` | Session via localStorage, AuthGuard, register new users |
| Dashboard | `/dashboard` | Live stats, recent events, scheduled reminders, quick actions |
| Events | `/events` | Full CRUD, search and filter, event detail page |
| Event Detail | `/events/[id]` | Hero card, guest list, reminders, danger zone |
| Card Generator | `/cards` | 6 templates, live preview, custom message, HTML download |
| Reminders | `/reminders` | Schedule by event, filter by status/event, delete |
| Guests | `/guests` | Add guests, RSVP cycling, search, filter, delete |
| Notification Log | `/notifications` | Full history, search, filter by type and status |
| Settings | `/settings` | Profile, notification toggles, appearance, data export |

## Project Structure

```text
app/
  api/                 API route handlers
  (auth)/login         Login page
  (auth)/register      Register page
  (app)/dashboard      Dashboard
  (app)/events         Events list and CRUD
  (app)/events/[id]    Event detail page
  (app)/cards          Card generator
  (app)/reminders      Reminder management
  (app)/guests         Guest management
  (app)/notifications  Notification log
  (app)/settings       App settings

components/
  auth/AuthGuard
  cards/
  dashboard/
  events/
  guests/
  reminders/
  layout/
  ui/

context/
  AuthContext

hooks/
  useEvents, useGuests, useReminders, useTemplates

lib/
  api.ts               Browser API client
  serverData.ts        Supabase/local data adapter
  queryKeys.ts
  utils.ts

data/db.json           Local development seed data
supabase/schema.sql    Hosted database schema and seed data
types/index.ts         Shared TypeScript interfaces
```
