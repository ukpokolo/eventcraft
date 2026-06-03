// Centralised query key factory.
// Every hook imports from here — no magic strings scattered around.

export const queryKeys = {
  events: {
    all:    () => ["events"] as const,
    byId:   (id: number) => ["events", id] as const,
  },
  guests: {
    all:         () => ["guests"] as const,
    byEvent:     (eventId: number) => ["guests", "byEvent", eventId] as const,
  },
  reminders: {
    all:         () => ["reminders"] as const,
    byEvent:     (eventId: number) => ["reminders", "byEvent", eventId] as const,
  },
  templates: {
    all: () => ["templates"] as const,
  },
} as const;
