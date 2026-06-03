"use client";

import { useState } from "react";
import { Trash2, Mail, MessageSquare, Bell, Clock } from "lucide-react";
import { useDeleteReminder } from "@/hooks/useReminders";
import { formatDate } from "@/lib/utils";
import type { Reminder, ReminderStatus } from "@/types";

interface ReminderListProps {
  reminders: Reminder[];
  eventName?: (id: number) => string;
}

const typeIcon: Record<string, React.ElementType> = {
  email: Mail,
  sms: MessageSquare,
  push: Bell,
};

const statusStyle: Record<ReminderStatus, string> = {
  scheduled: "bg-blue-50 text-blue-700",
  sent: "bg-emerald-50 text-emerald-700",
  failed: "bg-red-50 text-red-600",
};

const triggerLabel: Record<string, string> = {
  "15m": "15 min before",
  "1h": "1 hr before",
  "3h": "3 hrs before",
  "24h": "24 hrs before",
  "48h": "48 hrs before",
  "1w": "1 week before",
};

export function ReminderList({ reminders, eventName }: ReminderListProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const { mutate: deleteReminder } = useDeleteReminder();

  if (reminders.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
        <p className="text-sm">No reminders yet. Schedule one on the left.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reminders.map((r) => {
        const Icon = typeIcon[r.type] ?? Bell;

        return (
          <div
            key={r.id}
            className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors group"
          >
            <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={"text-xs font-semibold px-2 py-0.5 rounded-full capitalize " + (statusStyle[r.status] ?? "bg-gray-100 text-gray-600")}>
                  {r.status}
                </span>
                <span className="text-xs text-gray-500 capitalize">{r.type}</span>
                <span className="text-xs text-gray-400">·</span>
                <span className="text-xs text-gray-500">
                  {triggerLabel[r.triggerBefore] ?? r.triggerBefore}
                </span>
              </div>

              {eventName && (
                <p className="text-sm font-medium text-gray-800 mt-1 truncate">
                  {eventName(r.eventId)}
                </p>
              )}

              {r.message && (
                <p className="text-xs text-gray-500 mt-0.5 italic break-words">
                  "{r.message}"
                </p>
              )}

              <p className="text-xs text-gray-400 mt-1">
                Created {formatDate(r.createdAt)}
              </p>
            </div>

            <div className="flex-shrink-0">
              {confirmDeleteId === r.id ? (
                <div className="flex flex-col gap-1 items-end">
                  <button
                    onClick={() => {
                      deleteReminder(r.id);
                      setConfirmDeleteId(null);
                    }}
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
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDeleteId(r.id)}
                  className="sm:opacity-0 sm:group-hover:opacity-100 w-9 h-9 sm:w-auto sm:h-auto rounded-lg sm:rounded-none bg-red-50 sm:bg-transparent text-red-500 sm:text-gray-400 hover:text-red-500 transition-all flex items-center justify-center"
                  title="Delete reminder"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
