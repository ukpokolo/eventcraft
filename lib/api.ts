import axios from "axios";
import type {
  Event, CreateEventInput, UpdateEventInput,
  Guest, CreateGuestInput, UpdateGuestInput,
  Reminder, CreateReminderInput,
  CardTemplate,
  User, RegisterInput,
} from "@/types";

// ─── Axios instance ───────────────────────────────────────────────────────────
// json-server runs on port 3001. Next.js dev server on 3000.

const api = axios.create({
  baseURL: "http://localhost:3001",
  headers: { "Content-Type": "application/json" },
});

// ─── Events ───────────────────────────────────────────────────────────────────

export const eventsApi = {
  getAll: () =>
    api.get<Event[]>("/events").then((r) => r.data),

  getById: (id: number) =>
    api.get<Event>(`/events/${id}`).then((r) => r.data),

  create: (data: CreateEventInput) =>
    api.post<Event>("/events", data).then((r) => r.data),

  update: (id: number, data: UpdateEventInput) =>
    api.patch<Event>(`/events/${id}`, data).then((r) => r.data),

  remove: (id: number) =>
    api.delete(`/events/${id}`).then((r) => r.data),
};

// ─── Guests ───────────────────────────────────────────────────────────────────

export const guestsApi = {
  getAll: () =>
    api.get<Guest[]>("/guests").then((r) => r.data),

  getByEvent: (eventId: number) =>
    api.get<Guest[]>(`/guests?eventId=${eventId}`).then((r) => r.data),

  create: (data: CreateGuestInput) =>
    api.post<Guest>("/guests", data).then((r) => r.data),

  update: (id: number, data: UpdateGuestInput) =>
    api.patch<Guest>(`/guests/${id}`, data).then((r) => r.data),

  remove: (id: number) =>
    api.delete(`/guests/${id}`).then((r) => r.data),
};

// ─── Reminders ────────────────────────────────────────────────────────────────

export const remindersApi = {
  getAll: () =>
    api.get<Reminder[]>("/reminders").then((r) => r.data),

  getByEvent: (eventId: number) =>
    api.get<Reminder[]>(`/reminders?eventId=${eventId}`).then((r) => r.data),

  create: (data: CreateReminderInput) =>
    api.post<Reminder>("/reminders", {
      ...data,
      status: "scheduled",
      createdAt: new Date().toISOString().slice(0, 10),
    }).then((r) => r.data),

  update: (id: number, data: Partial<Reminder>) =>
    api.patch<Reminder>(`/reminders/${id}`, data).then((r) => r.data),

  remove: (id: number) =>
    api.delete(`/reminders/${id}`).then((r) => r.data),
};

// ─── Templates ────────────────────────────────────────────────────────────────

export const templatesApi = {
  getAll: () =>
    api.get<CardTemplate[]>("/templates").then((r) => r.data),
};

// Users / Auth

export const usersApi = {
  getAll: () =>
    api.get<User[]>("/users").then((r) => r.data),

  getByEmail: (email: string) =>
    api.get<User[]>(`/users?email=${email}`).then((r) => r.data),

  create: (data: RegisterInput) =>
    api.post<User>("/users", {
      ...data,
      createdAt: new Date().toISOString().slice(0, 10),
    }).then((r) => r.data),
};
