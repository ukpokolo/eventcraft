import { clsx, type ClassValue } from "clsx";
import type { EventStatus, RsvpStatus, ReminderStatus, TriggerBefore } from "@/types";

// ─── Tailwind class merger ────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// ─── Date / time formatting ───────────────────────────────────────────────────

export function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(timeStr: string): string {
  if (!timeStr) return "—";
  const [h, m] = timeStr.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

export function formatDateTime(dateStr: string, timeStr: string): string {
  return `${formatDate(dateStr)} · ${formatTime(timeStr)}`;
}

// ─── Initials ─────────────────────────────────────────────────────────────────

export function initials(first: string, last: string): string {
  return `${(first?.[0] ?? "").toUpperCase()}${(last?.[0] ?? "").toUpperCase()}`;
}

// ─── Avatar colour pool ───────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "#e94560", "#3b82f6", "#22c55e", "#f59e0b",
  "#8b5cf6", "#ef4444", "#06b6d4", "#f97316",
];

export function avatarColor(index: number): string {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

// ─── Label maps ───────────────────────────────────────────────────────────────

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  upcoming:  "Upcoming",
  ongoing:   "Ongoing",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const RSVP_LABELS: Record<RsvpStatus, string> = {
  pending:   "Pending",
  confirmed: "Confirmed",
  declined:  "Declined",
};

export const REMINDER_STATUS_LABELS: Record<ReminderStatus, string> = {
  scheduled: "Scheduled",
  sent:      "Sent",
  failed:    "Failed",
};

export const TRIGGER_LABELS: Record<TriggerBefore, string> = {
  "15m": "15 minutes before",
  "1h":  "1 hour before",
  "3h":  "3 hours before",
  "24h": "24 hours before",
  "48h": "48 hours before",
  "1w":  "1 week before",
};

// ─── Badge colour maps ────────────────────────────────────────────────────────

export const EVENT_STATUS_COLORS: Record<EventStatus, string> = {
  upcoming:  "bg-blue-100 text-blue-700",
  ongoing:   "bg-green-100 text-green-700",
  completed: "bg-gray-100 text-gray-600",
  cancelled: "bg-red-100 text-red-600",
};

export const RSVP_COLORS: Record<RsvpStatus, string> = {
  pending:   "bg-amber-100 text-amber-700",
  confirmed: "bg-green-100 text-green-700",
  declined:  "bg-red-100 text-red-600",
};

export const REMINDER_STATUS_COLORS: Record<ReminderStatus, string> = {
  scheduled: "bg-blue-100 text-blue-700",
  sent:      "bg-green-100 text-green-700",
  failed:    "bg-red-100 text-red-600",
};
