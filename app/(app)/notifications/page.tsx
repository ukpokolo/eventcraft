"use client";

import { useMemo, useState } from "react";
import { Mail, MessageSquare, Bell, CheckCircle2, XCircle, Clock, Search } from "lucide-react";
import { useReminders } from "@/hooks/useReminders";
import { useEvents } from "@/hooks/useEvents";
import { PageLoader } from "@/components/ui/Spinner";
import { formatDate, TRIGGER_LABELS, REMINDER_STATUS_COLORS } from "@/lib/utils";
import type { ReminderStatus, ReminderType } from "@/types";

const typeIcon: Record<ReminderType, React.ElementType> = {
  email: Mail,
  sms:   MessageSquare,
  push:  Bell,
};

const statusIcon: Record<ReminderStatus, React.ElementType> = {
  scheduled: Clock,
  sent:      CheckCircle2,
  failed:    XCircle,
};

export default function NotificationsPage() {
  const { data: reminders = [], isLoading: rLoad } = useReminders();
  const { data: events    = [], isLoading: eLoad } = useEvents();

  const [search, setSearch]       = useState("");
  const [statusFilter, setStatus] = useState<"all" | ReminderStatus>("all");
  const [typeFilter,   setType]   = useState<"all" | ReminderType>("all");

  const eventNameMap = useMemo(
    () => Object.fromEntries(events.map((e) => [e.id, e.name])),
    [events]
  );

  const filtered = useMemo(() => {
    return reminders
      .slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .filter((r) => {
        const name = eventNameMap[r.eventId] ?? "";
        const matchSearch  = !search || name.toLowerCase().includes(search.toLowerCase()) || r.message.toLowerCase().includes(search.toLowerCase());
        const matchStatus  = statusFilter === "all" || r.status === statusFilter;
        const matchType    = typeFilter   === "all" || r.type   === typeFilter;
        return matchSearch && matchStatus && matchType;
      });
  }, [reminders, search, statusFilter, typeFilter, eventNameMap]);

  // Summary counts
  const sent      = reminders.filter((r) => r.status === "sent").length;
  const scheduled = reminders.filter((r) => r.status === "scheduled").length;
  const failed    = reminders.filter((r) => r.status === "failed").length;

  if (rLoad || eLoad) return <PageLoader />;

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-6">
        <h1
          className="text-2xl font-bold text-gray-900"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Notification Log
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Full history of all scheduled and sent reminders.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total",     value: reminders.length, bg: "bg-gray-50",     color: "text-gray-800"    },
          { label: "Scheduled", value: scheduled,         bg: "bg-blue-50",     color: "text-blue-700"    },
          { label: "Sent",      value: sent,              bg: "bg-emerald-50",  color: "text-emerald-700" },
          { label: "Failed",    value: failed,            bg: "bg-red-50",      color: "text-red-600"     },
        ].map((s) => (
          <div key={s.label} className={"rounded-xl p-4 " + s.bg}>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{s.label}</p>
            <p className={"text-2xl font-bold mt-1 " + s.color}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by event or message..."
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatus(e.target.value as typeof statusFilter)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-700"
          >
            <option value="all">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="sent">Sent</option>
            <option value="failed">Failed</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setType(e.target.value as typeof typeFilter)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-700"
          >
            <option value="all">All Types</option>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="push">Push</option>
          </select>
        </div>

        {/* Log table */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No notifications match your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Type", "Event", "Timing", "Message", "Status", "Date"].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 pr-4 last:pr-0"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((r) => {
                  const TypeIcon   = typeIcon[r.type]   ?? Bell;
                  const StatusIcon = statusIcon[r.status] ?? Clock;
                  return (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      {/* Type */}
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                            <TypeIcon className="w-3.5 h-3.5" />
                          </div>
                          <span className="capitalize text-gray-700">{r.type}</span>
                        </div>
                      </td>
                      {/* Event */}
                      <td className="py-3 pr-4 font-medium text-gray-800 max-w-[160px] truncate">
                        {eventNameMap[r.eventId] ?? "—"}
                      </td>
                      {/* Timing */}
                      <td className="py-3 pr-4 text-gray-600 whitespace-nowrap">
                        {TRIGGER_LABELS[r.triggerBefore]}
                      </td>
                      {/* Message */}
                      <td className="py-3 pr-4 text-gray-500 max-w-[200px] truncate italic">
                        {r.message || <span className="not-italic text-gray-300">—</span>}
                      </td>
                      {/* Status */}
                      <td className="py-3 pr-4">
                        <span className={"inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize " + REMINDER_STATUS_COLORS[r.status]}>
                          <StatusIcon className="w-3 h-3" />
                          {r.status}
                        </span>
                      </td>
                      {/* Date */}
                      <td className="py-3 text-gray-500 whitespace-nowrap">
                        {formatDate(r.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > 0 && (
          <p className="text-xs text-gray-400 mt-3 text-right">
            {filtered.length} of {reminders.length} entries
          </p>
        )}
      </div>
    </div>
  );
}
