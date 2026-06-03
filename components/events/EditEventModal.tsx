"use client";

import { Modal }         from "@/components/ui/Modal";
import { Button }        from "@/components/ui/Button";
import { EventForm }     from "./EventForm";
import { useUpdateEvent } from "@/hooks/useEvents";
import type { Event }    from "@/types";
import type { EventFormValues } from "./EventForm";

interface EditEventModalProps {
  event:   Event | null;
  onClose: () => void;
}

export function EditEventModal({ event, onClose }: EditEventModalProps) {
  const { mutate, isPending } = useUpdateEvent();

  function handleSubmit(values: EventFormValues) {
    if (!event) return;
    mutate(
      { id: event.id, data: values },
      { onSuccess: () => onClose() }
    );
  }

  return (
    <Modal
      open={!!event}
      onClose={onClose}
      title="Edit Event"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            form="edit-event-form"
            loading={isPending}
          >
            Save Changes
          </Button>
        </>
      }
    >
      <EventForm
        defaultValues={event ?? undefined}
        onSubmit={handleSubmit}
        formId="edit-event-form"
      />
    </Modal>
  );
}
