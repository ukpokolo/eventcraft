"use client";

import { useState, useMemo } from "react";
import { Users } from "lucide-react";
import { useGuests } from "@/hooks/useGuests";
import { useCreateGuest } from "@/hooks/useGuests";
import { useEvents } from "@/hooks/useEvents";
import { GuestForm } from "@/components/guests/GuestForm";
import { GuestTable } from "@/components/guests/GuestTable";
import { Spinner } from "@/components/ui/Spinner";

type RsvpFilter = "all" | "confirmed" | "pending" | "declined";

export default function GuestsPage() {
  const { data: guests = [], isLoading: guestsLoading } = useGuests();
  const { data: events = [], isLoading: eventsLoading } = useEvents();
  const { mutate: createGuest, isPending } = useCreateGuest();

  const [search, setSearch] = useState("");
  const [rsvpFilter, setRsvpFilter] = useState<RsvpFilter>("all");
  const [eventFilter, setEventFilter] = useState<string>("all");

  const eventNameMap = useMemo(() => {
    return Object.fromEntries(events.map((e) => [e.id, e.name]));
  }, [events]);

  const filtered = useMemo(() => {
    return guests.filter((g) => {
      const matchSearch =
        !search ||
        (g.firstName + " " + g.lastName).toLowerCase().includes(search.toLowerCase()) ||
        g.email.toLowerCase().includes(search.toLowerCase());
      const matchRsvp = rsvpFilter === "all" || g.rsvp === rsvpFilter;
      const matchEvent = eventFilter === "all" || String(g.eventId) === eventFilter;
      return matchSearch && matchRsvp && matchEvent;
    });
  }, [guests, search, rsvpFilter, eventFilter]);

  // Stats
  const confirmed = guests.filter((g) => g.rsvp === "confirmed").length;
  const pending = guests.filter((g) => g.rsvp === "pending").length;
  const declined = guests.filter((g) => g.rsvp === "declined").length;

  const isLoading = guestsLoading || eventsLoading;

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1
          className="text-xl sm:text-2xl font-bold text-gray-900"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Guests
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage attendees and track their RSVP status.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {[
          { label: "Total", value: guests.length, color: "text-gray-700", bg: "bg-gray-50" },
          { label: "Confirmed", value: confirmed, color: "text-emerald-700", bg: "bg-emerald-50" },
          { label: "Pending",   value: pending,   color: "text-amber-700",  bg: "bg-amber-50"  },
          { label: "Declined",  value: declined,  color: "text-red-600",    bg: "bg-red-50"    },
        ].map((s) => (
          <div key={s.label} className={"rounded-xl p-3 sm:p-4 " + s.bg}>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{s.label}</p>
            <p className={"text-2xl font-bold mt-1 " + s.color}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Add guest form */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-indigo-500" />
            <h2 className="text-sm font-semibold text-gray-700">Add Guest</h2>
          </div>
          <GuestForm
            onSubmit={(data) => createGuest(data)}
            isLoading={isPending}
          />
        </div>

        {/* Guest list */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-4 sm:p-5 min-w-0">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search guests..."
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <select
              value={rsvpFilter}
              onChange={(e) => setRsvpFilter(e.target.value as RsvpFilter)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-700"
            >
              <option value="all">All RSVPs</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="declined">Declined</option>
            </select>
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-700"
            >
              <option value="all">All Events</option>
              {events.map((ev) => (
                <option key={ev.id} value={String(ev.id)}>{ev.name}</option>
              ))}
            </select>
          </div>

          <GuestTable
            guests={filtered}
            eventName={(id) => eventNameMap[id] ?? "Unknown"}
          />

          {filtered.length > 0 && (
            <p className="text-xs text-gray-400 mt-3 text-right">
              Showing {filtered.length} of {guests.length} guests
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
