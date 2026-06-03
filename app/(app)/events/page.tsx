"use client";

import { useState }             from "react";
import { useRouter }            from "next/navigation";
import { Plus, CalendarDays }   from "lucide-react";
import { Topbar }               from "@/components/layout/Topbar";
import { Button }               from "@/components/ui/Button";
import { PageLoader }           from "@/components/ui/Spinner";
import { EmptyState }           from "@/components/ui/EmptyState";
import { EventsTable }          from "@/components/events/EventsTable";
import { CreateEventModal }     from "@/components/events/CreateEventModal";
import { EditEventModal }       from "@/components/events/EditEventModal";
import { DeleteEventDialog }    from "@/components/events/DeleteEventDialog";
import { useEvents }            from "@/hooks/useEvents";
import { useGuests }            from "@/hooks/useGuests";
import { useReminders }         from "@/hooks/useReminders";
import type { Event }           from "@/types";

export default function EventsPage() {
  const router = useRouter();

  // ── data ──────────────────────────────────────────────────────────────────
  const { data: events    = [], isLoading: evLoad } = useEvents();
  const { data: guests    = [], isLoading: guLoad } = useGuests();
  const { data: reminders = [], isLoading: reLoad } = useReminders();
  const loading = evLoad || guLoad || reLoad;

  // ── modal state ───────────────────────────────────────────────────────────
  const [createOpen, setCreateOpen]   = useState(false);
  const [editTarget,  setEditTarget]  = useState<Event | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null);

  // ── action handlers ───────────────────────────────────────────────────────
  function handleCard(event: Event) {
    router.push(`/cards?eventId=${event.id}`);
  }

  function handleRemind(event: Event) {
    router.push(`/reminders?eventId=${event.id}`);
  }

  return (
    <>
      <Topbar
        title="My Events"
        actions={
          <Button
            variant="primary"
            size="md"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setCreateOpen(true)}
          >
            New Event
          </Button>
        }
      />

      <main className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <PageLoader />
        ) : events.length === 0 ? (
          <EmptyState
            icon={<CalendarDays className="w-7 h-7" />}
            title="No events yet"
            description="Create your first event and start generating invitation cards and reminders."
            action={
              <Button
                variant="primary"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => setCreateOpen(true)}
              >
                Create First Event
              </Button>
            }
          />
        ) : (
          <EventsTable
            events={events}
            guests={guests}
            reminders={reminders}
            onEdit={setEditTarget}
            onDelete={setDeleteTarget}
            onCard={handleCard}
            onRemind={handleRemind}
          />
        )}
      </main>

      {/* ── Modals ── */}
      <CreateEventModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
      <EditEventModal
        event={editTarget}
        onClose={() => setEditTarget(null)}
      />
      <DeleteEventDialog
        event={deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  );
}
