"use client";

import { useState }       from "react";
import Link              from "next/link";
import { Pencil, Trash2, Layers, Bell, Search, ExternalLink } from "lucide-react";
import { Badge }          from "@/components/ui/Badge";
import { Button }         from "@/components/ui/Button";
import { EmptyState }     from "@/components/ui/EmptyState";
import { Input }          from "@/components/ui/Input";
import { Select }         from "@/components/ui/Select";
import {
  formatDate,
  formatTime,
  EVENT_STATUS_LABELS,
  EVENT_STATUS_COLORS,
} from "@/lib/utils";
import type { Event, Guest, Reminder, EventStatus } from "@/types";

interface EventsTableProps {
  events:    Event[];
  guests:    Guest[];
  reminders: Reminder[];
  onEdit:    (event: Event) => void;
  onDelete:  (event: Event) => void;
  onCard:    (event: Event) => void;
  onRemind:  (event: Event) => void;
}

const STATUS_FILTER_OPTIONS = [
  { value: "",           label: "All Statuses" },
  { value: "upcoming",   label: "Upcoming" },
  { value: "ongoing",    label: "Ongoing" },
  { value: "completed",  label: "Completed" },
  { value: "cancelled",  label: "Cancelled" },
];

export function EventsTable({
  events,
  guests,
  reminders,
  onEdit,
  onDelete,
  onCard,
  onRemind,
}: EventsTableProps) {
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatus] = useState<EventStatus | "">("");

  const filtered = events
    .filter((e) => {
      const matchSearch =
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.venue.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "" || e.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => b.id - a.id);   // newest first

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">

      {/* ── toolbar ── */}
      <div className="flex flex-col sm:flex-row gap-3 px-5 py-4 border-b border-gray-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search events or venues…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200
                       bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#e94560]/30
                       focus:border-[#e94560] focus:bg-white placeholder:text-gray-400"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatus(e.target.value as EventStatus | "")}
          className="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50
                     focus:outline-none focus:ring-2 focus:ring-[#e94560]/30
                     focus:border-[#e94560] cursor-pointer"
        >
          {STATUS_FILTER_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* ── table ── */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="w-6 h-6" />}
          title={search || statusFilter ? "No matching events" : "No events yet"}
          description={
            search || statusFilter
              ? "Try adjusting your search or filter"
              : "Create your first event using the button above"
          }
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {["Event", "Date & Time", "Venue", "Guests", "Reminders", "Status", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-medium text-gray-500
                                 uppercase tracking-wide px-5 py-3 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((event) => {
                const guestCount    = guests.filter((g) => g.eventId === event.id).length;
                const reminderCount = reminders.filter((r) => r.eventId === event.id).length;
                return (
                  <tr
                    key={event.id}
                    className="border-b border-gray-50 last:border-0
                               hover:bg-gray-50/70 transition-colors group"
                  >
                    {/* Name */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ background: event.color }}
                        />
                        <Link
                          href={`/events/${event.id}`}
                          className="font-medium text-gray-800 max-w-[200px] truncate hover:text-indigo-600 hover:underline transition-colors flex items-center gap-1"
                        >
                          {event.name}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-50" />
                        </Link>
                      </div>
                      {event.description && (
                        <p className="text-xs text-gray-400 mt-0.5 ml-5.5 truncate max-w-[200px]">
                          {event.description}
                        </p>
                      )}
                    </td>

                    {/* Date + Time */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="text-gray-700">{formatDate(event.date)}</span>
                      <span className="text-gray-400 ml-1 text-xs">{formatTime(event.time)}</span>
                    </td>

                    {/* Venue */}
                    <td className="px-5 py-4 text-gray-500 max-w-[180px] truncate">
                      {event.venue}
                    </td>

                    {/* Guests */}
                    <td className="px-5 py-4">
                      <Badge variant="info">{guestCount} guest{guestCount !== 1 ? "s" : ""}</Badge>
                    </td>

                    {/* Reminders */}
                    <td className="px-5 py-4">
                      <Badge variant={reminderCount > 0 ? "success" : "muted"}>
                        {reminderCount} set
                      </Badge>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full
                                    text-xs font-medium ${EVENT_STATUS_COLORS[event.status]}`}
                      >
                        {EVENT_STATUS_LABELS[event.status]}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onEdit(event)}
                          title="Edit event"
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400
                                     hover:text-gray-700 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onCard(event)}
                          title="Generate card"
                          className="p-1.5 rounded-lg hover:bg-purple-50 text-gray-400
                                     hover:text-purple-600 transition-colors"
                        >
                          <Layers className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onRemind(event)}
                          title="Add reminder"
                          className="p-1.5 rounded-lg hover:bg-amber-50 text-gray-400
                                     hover:text-amber-600 transition-colors"
                        >
                          <Bell className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(event)}
                          title="Delete event"
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400
                                     hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── footer count ── */}
      {filtered.length > 0 && (
        <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/40">
          <p className="text-xs text-gray-400">
            Showing {filtered.length} of {events.length} event{events.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
}
