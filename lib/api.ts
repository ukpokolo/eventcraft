import type {
  Event, CreateEventInput, UpdateEventInput,
  Guest, CreateGuestInput, UpdateGuestInput,
  Reminder, CreateReminderInput,
  CardTemplate,
  User, RegisterInput,
} from "@/types";

const API_BASE = "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? `Request failed with ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

const jsonBody = (data: unknown) => JSON.stringify(data);

export const eventsApi = {
  getAll: () =>
    request<Event[]>("/events"),

  getById: (id: number) =>
    request<Event>(`/events/${id}`),

  create: (data: CreateEventInput) =>
    request<Event>("/events", { method: "POST", body: jsonBody(data) }),

  update: (id: number, data: UpdateEventInput) =>
    request<Event>(`/events/${id}`, { method: "PATCH", body: jsonBody(data) }),

  remove: (id: number) =>
    request<void>(`/events/${id}`, { method: "DELETE" }),
};

export const guestsApi = {
  getAll: () =>
    request<Guest[]>("/guests"),

  getByEvent: (eventId: number) =>
    request<Guest[]>(`/guests?eventId=${eventId}`),

  create: (data: CreateGuestInput) =>
    request<Guest>("/guests", { method: "POST", body: jsonBody(data) }),

  update: (id: number, data: UpdateGuestInput) =>
    request<Guest>(`/guests/${id}`, { method: "PATCH", body: jsonBody(data) }),

  remove: (id: number) =>
    request<void>(`/guests/${id}`, { method: "DELETE" }),
};

export const remindersApi = {
  getAll: () =>
    request<Reminder[]>("/reminders"),

  getByEvent: (eventId: number) =>
    request<Reminder[]>(`/reminders?eventId=${eventId}`),

  create: (data: CreateReminderInput) =>
    request<Reminder>("/reminders", {
      method: "POST",
      body: jsonBody({
        ...data,
        status: "scheduled",
        createdAt: new Date().toISOString().slice(0, 10),
      }),
    }),

  update: (id: number, data: Partial<Reminder>) =>
    request<Reminder>(`/reminders/${id}`, { method: "PATCH", body: jsonBody(data) }),

  remove: (id: number) =>
    request<void>(`/reminders/${id}`, { method: "DELETE" }),
};

export const templatesApi = {
  getAll: () =>
    request<CardTemplate[]>("/templates"),
};

export const usersApi = {
  getAll: () =>
    request<User[]>("/users"),

  getByEmail: (email: string) =>
    request<User[]>(`/users?email=${encodeURIComponent(email)}`),

  create: (data: RegisterInput) =>
    request<User>("/users", {
      method: "POST",
      body: jsonBody({
        ...data,
        createdAt: new Date().toISOString().slice(0, 10),
      }),
    }),
};
