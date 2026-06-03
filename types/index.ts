// ─── Event ────────────────────────────────────────────────────────────────────

export type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

export interface Event {
  id: number;
  name: string;
  date: string;       // ISO date "YYYY-MM-DD"
  time: string;       // "HH:MM"
  venue: string;
  description: string;
  status: EventStatus;
  color: string;      // hex, used on invitation cards
}

export type CreateEventInput = Omit<Event, "id">;
export type UpdateEventInput = Partial<CreateEventInput>;

// ─── Guest ────────────────────────────────────────────────────────────────────

export type RsvpStatus = "pending" | "confirmed" | "declined";

export interface Guest {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  eventId: number;
  rsvp: RsvpStatus;
}

export type CreateGuestInput = Omit<Guest, "id">;
export type UpdateGuestInput = Partial<CreateGuestInput>;

// ─── Reminder ────────────────────────────────────────────────────────────────

export type ReminderType = "email" | "sms" | "push";
export type ReminderStatus = "scheduled" | "sent" | "failed";
export type TriggerBefore = "15m" | "1h" | "3h" | "24h" | "48h" | "1w";

export interface Reminder {
  id: number;
  eventId: number;
  type: ReminderType;
  triggerBefore: TriggerBefore;
  message: string;
  status: ReminderStatus;
  createdAt: string;  // ISO date
}

export type CreateReminderInput = Omit<Reminder, "id" | "createdAt" | "status">;
export type UpdateReminderInput = Partial<CreateReminderInput>;

// ─── Template ────────────────────────────────────────────────────────────────

export interface CardTemplate {
  id: number;
  name: string;
  bg: string;         // CSS background (hex or gradient)
  textColor: string;
}

// ─── API generic response ─────────────────────────────────────────────────────

export interface ApiError {
  message: string;
  status?: number;
}

// User / Auth

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
}

export type RegisterInput = Omit<User, "id" | "createdAt">;
export type LoginInput = Pick<User, "email" | "password">;

export interface AuthSession {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}
