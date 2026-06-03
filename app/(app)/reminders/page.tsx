"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Bell } from "lucide-react";
import { useReminders, useCreateReminder } from "@/hooks/useReminders";
import { useEvents } from "@/hooks/useEvents";
import { ReminderForm } from "@/components/reminders/ReminderForm";
import { ReminderList } from "@/components/reminders/ReminderList";
import { Spinner } from "@/components/ui/Spinner";
import type { ReminderStatus } from "@/types";

type StatusFilter = "all" | ReminderStatus;

export default function RemindersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <RemindersPageContent />
    </Suspense>
  );
}

function RemindersPageContent() {
  const searchParams = useSearchParams();
  const preselectedEventId = searchParams.get("eventId")
    ? Number(searchParams.get("eventId"))
    : undefined;

  const { data: reminders = [], isLoading: remindersLoading } = useReminders();
  const { data: events = [], isLoading: eventsLoading } = useEvents();
  const { mutate: createReminder, isPending } = useCreateReminder();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [eventFilter, setEventFilter] = useState<string>(
    preselectedEventId ? String(preselectedEventId) : "all"
  );

  const eventNameMap = useMemo(
    () => Object.fromEntries(events.map((e) => [e.id, e.name])),
    [events]
  );

  const filtered = useMemo(
    () =>
      reminders.filter((r) => {
        const matchStatus = statusFilter === "all" || r.status === statusFilter;
        const matchEvent = eventFilter === "all" || String(r.eventId) === eventFilter;
        return matchStatus && matchEvent;
      }),
    [reminders, statusFilter, eventFilter]
  );

  const scheduled = reminders.filter((r) => r.status === "scheduled").length;
  const sent = reminders.filter((r) => r.status === "sent").length;
  const failed = reminders.filter((r) => r.status === "failed").length;

  const isLoading = remindersLoading || eventsLoading;

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
      <div className="mb-6">
        <h1
          className="text-xl sm:text-2xl font-bold text-gray-900"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Reminders
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Schedule automated notifications for your events.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {[
          { label: "Total",     value: reminders.length, color: "text-gray-700",   bg: "bg-gray-50"    },
          { label: "Scheduled", value: scheduled,         color: "text-blue-700",   bg: "bg-blue-50"    },
          { label: "Sent",      value: sent,              color: "text-emerald-700", bg: "bg-emerald-50" },
          { label: "Failed",    value: failed,            color: "text-red-600",    bg: "bg-red-50"     },
        ].map((s) => (
          <div key={s.label} className={"rounded-xl p-3 sm:p-4 " + s.bg}>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{s.label}</p>
            <p className={"text-2xl font-bold mt-1 " + s.color}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Schedule form */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-indigo-500" />
            <h2 className="text-sm font-semibold text-gray-700">New Reminder</h2>
          </div>
          <ReminderForm
            defaultEventId={preselectedEventId}
            onSubmit={(data) => createReminder(data)}
            isLoading={isPending}
          />
        </div>

        {/* Reminder list */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-4 sm:p-5 min-w-0">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-700"
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="sent">Sent</option>
              <option value="failed">Failed</option>
            </select>
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-700"
            >
              <option value="all">All Events</option>
              {events.map((ev) => (
                <option key={ev.id} value={String(ev.id)}>{ev.name}</option>
              ))}
            </select>
          </div>

          <ReminderList
            reminders={filtered}
            eventName={(id) => eventNameMap[id] ?? "Unknown"}
          />

          {filtered.length > 0 && (
            <p className="text-xs text-gray-400 mt-4 text-right">
              Showing {filtered.length} of {reminders.length} reminders
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
