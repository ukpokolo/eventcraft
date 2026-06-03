"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  formatDate,
  formatTime,
  EVENT_STATUS_LABELS,
  EVENT_STATUS_COLORS,
} from "@/lib/utils";
import type { Event, Guest } from "@/types";

interface RecentEventsTableProps {
  events: Event[];
  guests: Guest[];
}

export function RecentEventsTable({ events, guests }: RecentEventsTableProps) {
  // Show the 5 most recently added (highest id first)
  const recent = [...events]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Events</CardTitle>
        <Link
          href="/events"
          className="flex items-center gap-1 text-xs text-[#e94560] hover:underline font-medium"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </CardHeader>

      {recent.length === 0 ? (
        <EmptyState
          icon={<CalendarDays className="w-6 h-6" />}
          title="No events yet"
          description="Create your first event to get started"
          action={
            <Link
              href="/events"
              className="text-xs text-[#e94560] hover:underline font-medium"
            >
              Go to Events →
            </Link>
          }
        />
      ) : (
        <>
        <div className="sm:hidden divide-y divide-gray-100">
          {recent.map((event) => {
            const guestCount = guests.filter((g) => g.eventId === event.id).length;
            return (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="block px-4 py-4 hover:bg-gray-50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: event.color }}
                      />
                      <p className="font-medium text-gray-800 truncate">{event.name}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 truncate">{event.venue}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(event.date)} {formatTime(event.time)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <Badge variant="info">{guestCount}</Badge>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${EVENT_STATUS_COLORS[event.status]}`}
                    >
                      {EVENT_STATUS_LABELS[event.status]}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3">
                  Event
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3">
                  Date & Time
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3">
                  Venue
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3">
                  Guests
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recent.map((event) => {
                const guestCount = guests.filter(
                  (g) => g.eventId === event.id
                ).length;
                return (
                  <tr
                    key={event.id}
                    className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        {/* colour dot from event.color */}
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ background: event.color }}
                        />
                        <span className="font-medium text-gray-800 truncate max-w-[180px]">
                          {event.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
                      {formatDate(event.date)}
                      <span className="text-gray-400 ml-1">
                        {formatTime(event.time)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 truncate max-w-[160px]">
                      {event.venue}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant="info">{guestCount}</Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${EVENT_STATUS_COLORS[event.status]}`}
                      >
                        {EVENT_STATUS_LABELS[event.status]}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        </>
      )}
    </Card>
  );
}
