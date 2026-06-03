"use client";

import { AlertTriangle }  from "lucide-react";
import { Modal }          from "@/components/ui/Modal";
import { Button }         from "@/components/ui/Button";
import { useDeleteEvent } from "@/hooks/useEvents";
import type { Event }     from "@/types";

interface DeleteEventDialogProps {
  event:   Event | null;
  onClose: () => void;
}

export function DeleteEventDialog({ event, onClose }: DeleteEventDialogProps) {
  const { mutate, isPending } = useDeleteEvent();

  function handleDelete() {
    if (!event) return;
    mutate(event.id, { onSuccess: () => onClose() });
  }

  return (
    <Modal
      open={!!event}
      onClose={onClose}
      title="Delete Event"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} loading={isPending}>
            Delete Event
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center text-center gap-3 py-2">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">
            Are you sure you want to delete{" "}
            <span className="font-semibold">&ldquo;{event?.name}&rdquo;</span>?
          </p>
          <p className="text-xs text-gray-400 mt-1">
            All guests and reminders linked to this event will also be removed.
            This action cannot be undone.
          </p>
        </div>
      </div>
    </Modal>
  );
}
