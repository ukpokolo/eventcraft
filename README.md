# EventCraft — Automated Invitation Card Generation & Event Reminder Management

> Research project — NOUN Faculty of Education, Department of Educational Technology

Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, **TanStack Query v5**, **react-hook-form**, and **json-server**.

---

## Quick Start

```bash
npm install
npm run dev:all       # Starts json-server (:3001) + Next.js (:3000)
```

Or in separate terminals:
```bash
npm run dev:db        # Terminal 1 — json-server API on :3001
npm run dev           # Terminal 2 — Next.js app on :3000
```

**Demo login:** `john@eventcraft.com` / `password123`

---

## Full Feature Set

| Module | Route | Features |
|---|---|---|
| Auth | `/login` `/register` | Session via localStorage, AuthGuard, register new users |
| Dashboard | `/dashboard` | Live stats, recent events, scheduled reminders, quick actions |
| Events | `/events` | Full CRUD, search & filter, event detail page |
| Event Detail | `/events/[id]` | Hero card, guest list, reminders, danger zone |
| Card Generator | `/cards` | 6 templates, live preview, custom message, HTML download |
| Reminders | `/reminders` | Schedule by event, filter by status/event, delete |
| Guests | `/guests` | Add guests, RSVP cycling, search, filter, delete |
| Notification Log | `/notifications` | Full history, search, filter by type & status |
| Settings | `/settings` | Profile, notification toggles, appearance, data export |

---

## Project Structure

```
app/
  (auth)/login         ← Login page
  (auth)/register      ← Register page
  (app)/dashboard      ← Dashboard
  (app)/events         ← Events list + CRUD
  (app)/events/[id]    ← Event detail page
  (app)/cards          ← Card generator
  (app)/reminders      ← Reminder management
  (app)/guests         ← Guest management
  (app)/notifications  ← Notification log
  (app)/settings       ← App settings

components/
  auth/AuthGuard       ← Redirects unauthenticated users
  cards/               ← TemplatePicker, CardPreview
  dashboard/           ← StatsCards, RecentEventsTable, UpcomingReminders, QuickActions
  events/              ← EventForm, EventsTable, Create/Edit/Delete modals
  guests/              ← GuestForm, GuestTable
  reminders/           ← ReminderForm, ReminderList
  layout/              ← Sidebar (with auth user), Topbar
  ui/                  ← Badge, Button, Card, Input, Modal, Select, Textarea, Spinner, EmptyState

context/
  AuthContext          ← login, register, logout, session persistence

hooks/
  useEvents, useGuests, useReminders, useTemplates   ← TanStack Query

lib/
  api.ts               ← All axios service functions incl. usersApi
  queryKeys.ts         ← Cache key factory
  utils.ts             ← formatDate, cn, initials, label/colour maps

data/db.json           ← Mock database (events, guests, reminders, templates, users)
types/index.ts         ← All TypeScript interfaces incl. User/Auth types
```

---

## API (json-server on :3001)

`/events` `/guests?eventId=N` `/reminders?eventId=N` `/templates` `/users?email=X`

All standard REST: GET, POST, PATCH, DELETE
