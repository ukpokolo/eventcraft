"use client";

import { Modal }       from "@/components/ui/Modal";
import { Button }      from "@/components/ui/Button";
import { EventForm }   from "./EventForm";
import { useCreateEvent } from "@/hooks/useEvents";
import type { EventFormValues } from "./EventForm";

interface CreateEventModalProps {
  open:    boolean;
  onClose: () => void;
}

export function CreateEventModal({ open, onClose }: CreateEventModalProps) {
  const { mutate, isPending } = useCreateEvent();

  function handleSubmit(values: EventFormValues) {
    mutate(values, {
      onSuccess: () => onClose(),
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create New Event"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            form="event-form"
            loading={isPending}
          >
            Create Event
          </Button>
        </>
      }
    >
      <EventForm onSubmit={handleSubmit} formId="event-form" />
    </Modal>
  );
}
