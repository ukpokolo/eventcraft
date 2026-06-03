import seed from "@/data/db.json";
import type { CardTemplate, Event, Guest, Reminder, User } from "@/types";

export type CollectionName = "events" | "guests" | "reminders" | "templates" | "users";

type Entity = Event | Guest | Reminder | CardTemplate | User;

type Database = {
  events: Event[];
  guests: Guest[];
  reminders: Reminder[];
  templates: CardTemplate[];
  users: User[];
};

const collections = new Set<CollectionName>([
  "events",
  "guests",
  "reminders",
  "templates",
  "users",
]);

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const hasSupabase = Boolean(supabaseUrl && supabaseKey);

const memoryDb: Database = structuredClone(seed) as Database;

export function isCollectionName(value: string): value is CollectionName {
  return collections.has(value as CollectionName);
}

export function isWritableCollection(collection: CollectionName) {
  return collection !== "templates";
}

export async function listItems(collection: CollectionName, filters: URLSearchParams) {
  if (hasSupabase) {
    return supabaseList(collection, filters);
  }

  let rows = [...memoryDb[collection]];
  const eventId = filters.get("eventId");
  const email = filters.get("email");

  if (eventId) {
    rows = rows.filter((item) => "eventId" in item && item.eventId === Number(eventId));
  }

  if (email) {
    rows = rows.filter((item) => "email" in item && item.email === email);
  }

  return rows;
}

export async function getItem(collection: CollectionName, id: number) {
  if (hasSupabase) {
    const rows = await supabaseRequest<Entity[]>(collection, { id: `eq.${id}`, select: "*" });
    return rows[0] ?? null;
  }

  return memoryDb[collection].find((item) => item.id === id) ?? null;
}

export async function createItem(collection: CollectionName, data: Partial<Entity>) {
  if (hasSupabase) {
    const rows = await supabaseRequest<Entity[]>(collection, {}, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return rows[0];
  }

  const rows = memoryDb[collection] as Entity[];
  const nextId = rows.reduce((max, item) => Math.max(max, item.id), 0) + 1;
  const created = { ...data, id: nextId } as Entity;
  rows.push(created);
  return created;
}

export async function updateItem(collection: CollectionName, id: number, data: Partial<Entity>) {
  if (hasSupabase) {
    const rows = await supabaseRequest<Entity[]>(collection, { id: `eq.${id}` }, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return rows[0] ?? null;
  }

  const rows = memoryDb[collection] as Entity[];
  const index = rows.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }

  rows[index] = { ...rows[index], ...data } as Entity;
  return rows[index];
}

export async function deleteItem(collection: CollectionName, id: number) {
  if (hasSupabase) {
    const rows = await supabaseRequest<Entity[]>(collection, { id: `eq.${id}` }, {
      method: "DELETE",
    });
    return rows[0] ?? null;
  }

  const rows = memoryDb[collection] as Entity[];
  const index = rows.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }

  const [deleted] = rows.splice(index, 1);

  if (collection === "events") {
    memoryDb.guests = memoryDb.guests.filter((guest) => guest.eventId !== id);
    memoryDb.reminders = memoryDb.reminders.filter((reminder) => reminder.eventId !== id);
  }

  return deleted;
}

async function supabaseList(collection: CollectionName, filters: URLSearchParams) {
  const query: Record<string, string> = { select: "*", order: "id.asc" };
  const eventId = filters.get("eventId");
  const email = filters.get("email");

  if (eventId) {
    query.eventId = `eq.${eventId}`;
  }

  if (email) {
    query.email = `eq.${email}`;
  }

  return supabaseRequest<Entity[]>(collection, query);
}

async function supabaseRequest<T>(
  collection: CollectionName,
  query: Record<string, string>,
  init?: RequestInit
) {
  const params = new URLSearchParams(query);
  const response = await fetch(`${supabaseUrl}/rest/v1/${collection}?${params}`, {
    ...init,
    headers: {
      apikey: supabaseKey!,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Supabase request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}
