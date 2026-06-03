"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { guestsApi } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { CreateGuestInput, UpdateGuestInput } from "@/types";

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useGuests() {
  return useQuery({
    queryKey: queryKeys.guests.all(),
    queryFn: guestsApi.getAll,
  });
}

export function useGuestsByEvent(eventId: number) {
  return useQuery({
    queryKey: queryKeys.guests.byEvent(eventId),
    queryFn: () => guestsApi.getByEvent(eventId),
    enabled: !!eventId,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateGuest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateGuestInput) => guestsApi.create(data),
    onSuccess: (_guest, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.guests.all() });
      qc.invalidateQueries({
        queryKey: queryKeys.guests.byEvent(variables.eventId),
      });
    },
  });
}

export function useUpdateGuest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateGuestInput }) =>
      guestsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.guests.all() });
    },
  });
}

export function useDeleteGuest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => guestsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.guests.all() });
    },
  });
}
