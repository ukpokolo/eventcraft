"use client";

import Link from "next/link";
import { ArrowRight, Bell, Mail, MessageSquare, Smartphone } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { TRIGGER_LABELS } from "@/lib/utils";
import type { Reminder, Event, ReminderType } from "@/types";

interface UpcomingRemindersProps {
  reminders: Reminder[];
  events: Event[];
}

const TYPE_ICON: Record<ReminderType, React.ReactNode> = {
  email: <Mail className="w-3.5 h-3.5" />,
  sms:   <MessageSquare className="w-3.5 h-3.5" />,
  push:  <Smartphone className="w-3.5 h-3.5" />,
};

const TYPE_COLOR: Record<ReminderType, string> = {
  email: "bg-blue-50 text-blue-500",
  sms:   "bg-green-50 text-green-500",
  push:  "bg-amber-50 text-amber-500",
};

export function UpcomingReminders({ reminders, events }: UpcomingRemindersProps) {
  const scheduled = reminders
    .filter((r) => r.status === "scheduled")
    .slice(0, 4);

  const getEventName = (eventId: number) =>
    events.find((e) => e.id === eventId)?.name ?? "Unknown Event";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Reminders</CardTitle>
        <Link
          href="/reminders"
          className="flex items-center gap-1 text-xs text-[#e94560] hover:underline font-medium"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </CardHeader>

      {scheduled.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-6 h-6" />}
          title="No scheduled reminders"
          description="Schedule reminders to keep guests informed"
          action={
            <Link
              href="/reminders"
              className="text-xs text-[#e94560] hover:underline font-medium"
            >
              Go to Reminders →
            </Link>
          }
        />
      ) : (
        <div className="divide-y divide-gray-50">
          {scheduled.map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/60 transition-colors"
            >
              {/* type icon */}
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${TYPE_COLOR[r.type]}`}>
                {TYPE_ICON[r.type]}
              </div>

              {/* info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {getEventName(r.eventId)}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {r.type.toUpperCase()} · {TRIGGER_LABELS[r.triggerBefore]}
                </p>
              </div>

              {/* status pill */}
              <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full flex-shrink-0">
                Scheduled
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
