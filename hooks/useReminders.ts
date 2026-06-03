"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { remindersApi } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { CreateReminderInput } from "@/types";

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useReminders() {
  return useQuery({
    queryKey: queryKeys.reminders.all(),
    queryFn: remindersApi.getAll,
  });
}

export function useRemindersByEvent(eventId: number) {
  return useQuery({
    queryKey: queryKeys.reminders.byEvent(eventId),
    queryFn: () => remindersApi.getByEvent(eventId),
    enabled: !!eventId,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReminderInput) => remindersApi.create(data),
    onSuccess: (_reminder, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.reminders.all() });
      qc.invalidateQueries({
        queryKey: queryKeys.reminders.byEvent(variables.eventId),
      });
    },
  });
}

export function useDeleteReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => remindersApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.reminders.all() });
    },
  });
}
