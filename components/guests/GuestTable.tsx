"use client";

import { useState } from "react";
import { Trash2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useUpdateGuest, useDeleteGuest } from "@/hooks/useGuests";
import { initials } from "@/lib/utils";
import type { Guest, RsvpStatus } from "@/types";

interface GuestTableProps {
  guests: Guest[];
  eventName?: (id: number) => string;
}

const rsvpConfig: Record<RsvpStatus, { label: string; icon: React.ElementType; color: string }> = {
  confirmed: { label: "Confirmed", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
  declined:  { label: "Declined",  icon: XCircle,      color: "text-red-500 bg-red-50" },
  pending:   { label: "Pending",   icon: Clock,         color: "text-amber-600 bg-amber-50" },
};

const nextRsvp: Record<RsvpStatus, RsvpStatus> = {
  pending: "confirmed",
  confirmed: "declined",
  declined: "pending",
};

export function GuestTable({ guests, eventName }: GuestTableProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const { mutate: updateGuest } = useUpdateGuest();
  const { mutate: deleteGuest } = useDeleteGuest();

  if (guests.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-sm">No guests yet. Add your first guest above.</p>
      </div>
    );
  }

  return (
    <>
    <div className="sm:hidden space-y-3">
      {guests.map((g) => {
        const rsvp = rsvpConfig[g.rsvp];
        const Icon = rsvp.icon;
        return (
          <div key={g.id} className="rounded-xl border border-gray-100 p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {initials(g.firstName, g.lastName)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-800 truncate">{g.firstName} {g.lastName}</p>
                <p className="text-xs text-gray-500 break-all">{g.email}</p>
                {g.phone && <p className="text-xs text-gray-400 mt-0.5">{g.phone}</p>}
                {eventName && (
                  <p className="text-xs text-gray-500 mt-2 truncate">{eventName(g.eventId)}</p>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                onClick={() => updateGuest({ id: g.id, data: { rsvp: nextRsvp[g.rsvp] } })}
                className={"inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-opacity hover:opacity-80 " + rsvp.color}
                title="Click to cycle RSVP status"
              >
                <Icon className="w-3 h-3" />
                {rsvp.label}
              </button>

              {confirmDeleteId === g.id ? (
                <span className="flex items-center gap-3">
                  <button
                    onClick={() => { deleteGuest(g.id); setConfirmDeleteId(null); }}
                    className="text-xs text-red-600 font-medium hover:underline"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    Cancel
                  </button>
                </span>
              ) : (
                <button
                  onClick={() => setConfirmDeleteId(g.id)}
                  className="w-9 h-9 rounded-lg bg-red-50 text-red-500 flex items-center justify-center"
                  title="Remove guest"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
    <div className="hidden sm:block overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 pl-2">Guest</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">Contact</th>
            {eventName && (
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">Event</th>
            )}
            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">RSVP</th>
            <th className="pb-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {guests.map((g) => {
            const rsvp = rsvpConfig[g.rsvp];
            const Icon = rsvp.icon;
            return (
              <tr key={g.id} className="hover:bg-gray-50 transition-colors group">
                <td className="py-3 pl-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {initials(g.firstName, g.lastName)}
                    </div>
                    <span className="font-medium text-gray-800">{g.firstName} {g.lastName}</span>
                  </div>
                </td>
                <td className="py-3">
                  <div className="text-gray-600">{g.email}</div>
                  {g.phone && <div className="text-gray-400 text-xs">{g.phone}</div>}
                </td>
                {eventName && (
                  <td className="py-3 text-gray-600">{eventName(g.eventId)}</td>
                )}
                <td className="py-3">
                  <button
                    onClick={() => updateGuest({ id: g.id, data: { rsvp: nextRsvp[g.rsvp] } })}
                    className={"inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-opacity hover:opacity-80 " + rsvp.color}
                    title="Click to cycle RSVP status"
                  >
                    <Icon className="w-3 h-3" />
                    {rsvp.label}
                  </button>
                </td>
                <td className="py-3 pr-2 text-right">
                  {confirmDeleteId === g.id ? (
                    <span className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => { deleteGuest(g.id); setConfirmDeleteId(null); }}
                        className="text-xs text-red-600 font-medium hover:underline"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        Cancel
                      </button>
                    </span>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(g.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                      title="Remove guest"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    </>
  );
}
