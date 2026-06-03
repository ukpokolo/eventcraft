"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventsApi } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { CreateEventInput, UpdateEventInput } from "@/types";

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useEvents() {
  return useQuery({
    queryKey: queryKeys.events.all(),
    queryFn: eventsApi.getAll,
  });
}

export function useEvent(id: number) {
  return useQuery({
    queryKey: queryKeys.events.byId(id),
    queryFn: () => eventsApi.getById(id),
    enabled: !!id,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEventInput) => eventsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.events.all() });
    },
  });
}

export function useUpdateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEventInput }) =>
      eventsApi.update(id, data),
    onSuccess: (_updated, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.events.all() });
      qc.invalidateQueries({ queryKey: queryKeys.events.byId(id) });
    },
  });
}

export function useDeleteEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => eventsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.events.all() });
      // Also invalidate guests/reminders — deleting an event makes them stale
      qc.invalidateQueries({ queryKey: queryKeys.guests.all() });
      qc.invalidateQueries({ queryKey: queryKeys.reminders.all() });
    },
  });
}
