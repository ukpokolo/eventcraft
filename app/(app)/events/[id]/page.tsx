"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Calendar, Clock, MapPin, Users,
  Bell, CreditCard, Pencil, Trash2,
} from "lucide-react";
import { useEvent, useDeleteEvent } from "@/hooks/useEvents";
import { useGuestsByEvent } from "@/hooks/useGuests";
import { useRemindersByEvent } from "@/hooks/useReminders";
import { PageLoader } from "@/components/ui/Spinner";
import {
  formatDate, formatTime, initials, avatarColor,
  EVENT_STATUS_COLORS, RSVP_COLORS, TRIGGER_LABELS, REMINDER_STATUS_COLORS,
} from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

interface Props { params: Promise<{ id: string }> }

export default function EventDetailPage({ params }: Props) {
  const { id } = use(params);
  const eventId = Number(id);
  const router = useRouter();

  const { data: event,     isLoading: evLoad  } = useEvent(eventId);
  const { data: guests    = [], isLoading: guLoad  } = useGuestsByEvent(eventId);
  const { data: reminders = [], isLoading: reLoad  } = useRemindersByEvent(eventId);
  const { mutate: deleteEvent, isPending: deleting } = useDeleteEvent();

  const [confirmDelete, setConfirmDelete] = useState(false);

  const isLoading = evLoad || guLoad || reLoad;
  if (isLoading) return <PageLoader />;
  if (!event) return (
    <div className="flex-1 flex items-center justify-center text-gray-400">
      <p>Event not found.</p>
    </div>
  );

  const confirmedGuests = guests.filter((g) => g.rsvp === "confirmed").length;
  const scheduledReminders = reminders.filter((r) => r.status === "scheduled").length;

  const handleDelete = () => {
    deleteEvent(eventId, {
      onSuccess: () => router.push("/events"),
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
      {/* Back nav */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Events
      </button>

      {/* Hero card */}
      <div
        className="rounded-2xl p-5 sm:p-7 text-white mb-6 relative overflow-hidden"
        style={{ background: event.color }}
      >
        {/* Decorative circle */}
        <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full opacity-10 bg-white" />
        <div className="absolute -right-4 -bottom-10 w-32 h-32 rounded-full opacity-10 bg-white" />

        <div className="relative">
          <span className={"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mb-3 " + EVENT_STATUS_COLORS[event.status]}>
            {event.status}
          </span>
          <h1
            className="text-2xl sm:text-3xl font-bold leading-tight mb-2 pr-0 lg:pr-64"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {event.name}
          </h1>
          {event.description && (
            <p className="text-white/70 text-sm max-w-xl">{event.description}</p>
          )}

          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-5 mt-5">
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Calendar className="w-4 h-4 opacity-60" />
              {formatDate(event.date)}
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Clock className="w-4 h-4 opacity-60" />
              {formatTime(event.time)}
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <MapPin className="w-4 h-4 opacity-60" />
              {event.venue}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="relative sm:absolute sm:top-5 sm:right-5 flex flex-wrap gap-2 mt-5 sm:mt-0">
          <Link
            href={`/cards?eventId=${event.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-medium rounded-lg transition-colors backdrop-blur-sm"
          >
            <CreditCard className="w-3.5 h-3.5" /> Card
          </Link>
          <Link
            href={`/reminders?eventId=${event.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-medium rounded-lg transition-colors backdrop-blur-sm"
          >
            <Bell className="w-3.5 h-3.5" /> Remind
          </Link>
          <Link
            href={`/events?edit=${event.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-medium rounded-lg transition-colors backdrop-blur-sm"
          >
            <Pencil className="w-3.5 h-3.5" /> Edit
          </Link>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        {[
          { label: "Total Guests",   value: guests.length,      icon: Users, color: "text-indigo-600 bg-indigo-50" },
          { label: "Confirmed",      value: confirmedGuests,    icon: Users, color: "text-emerald-600 bg-emerald-50" },
          { label: "Reminders Set",  value: scheduledReminders, icon: Bell,  color: "text-blue-600 bg-blue-50" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className={"w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 " + color}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Guests */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" /> Guests ({guests.length})
            </h2>
            <Link
              href={`/guests`}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Manage all →
            </Link>
          </div>

          {guests.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No guests added yet.</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {guests.map((g, i) => (
                <div key={g.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: avatarColor(i) }}
                  >
                    {initials(g.firstName, g.lastName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {g.firstName} {g.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{g.email}</p>
                  </div>
                  <span className={"text-xs px-2 py-0.5 rounded-full font-medium " + RSVP_COLORS[g.rsvp]}>
                    {g.rsvp}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reminders */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-400" /> Reminders ({reminders.length})
            </h2>
            <Link
              href={`/reminders?eventId=${event.id}`}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Add reminder →
            </Link>
          </div>

          {reminders.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No reminders scheduled yet.</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {reminders.map((r) => (
                <div key={r.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={"text-xs px-2 py-0.5 rounded-full font-medium capitalize " + REMINDER_STATUS_COLORS[r.status]}>
                        {r.status}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">{r.type}</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-0.5">
                      {TRIGGER_LABELS[r.triggerBefore]}
                    </p>
                    {r.message && (
                      <p className="text-xs text-gray-400 italic truncate">"{r.message}"</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Danger zone */}
      <div className="mt-6 bg-white rounded-xl border border-red-100 p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-red-600 mb-2">Danger Zone</h2>
        <p className="text-xs text-gray-500 mb-3">
          Permanently delete this event and all its associated guests and reminders. This cannot be undone.
        </p>
        {confirmDelete ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-sm text-gray-700">Are you sure?</span>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Yes, delete"}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-4 py-1.5 border border-gray-200 text-gray-600 text-xs rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex items-center gap-2 px-4 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete Event
          </button>
        )}
      </div>
    </div>
  );
}
