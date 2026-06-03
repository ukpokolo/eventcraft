"use client";

import { useRef } from "react";
import { useEvents } from "@/hooks/useEvents";
import type { CreateReminderInput, ReminderType, TriggerBefore } from "@/types";

interface ReminderFormProps {
  defaultEventId?: number;
  onSubmit: (data: CreateReminderInput) => void;
  isLoading?: boolean;
}

const typeOptions: { value: ReminderType; label: string; emoji: string }[] = [
  { value: "email", label: "Email", emoji: "✉️" },
  { value: "sms",   label: "SMS",   emoji: "💬" },
  { value: "push",  label: "Push",  emoji: "🔔" },
];

const triggerOptions: { value: TriggerBefore; label: string }[] = [
  { value: "15m", label: "15 minutes before" },
  { value: "1h",  label: "1 hour before" },
  { value: "3h",  label: "3 hours before" },
  { value: "24h", label: "24 hours before" },
  { value: "48h", label: "48 hours before" },
  { value: "1w",  label: "1 week before" },
];

const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800 placeholder-gray-400";

export function ReminderForm({ defaultEventId, onSubmit, isLoading }: ReminderFormProps) {
  const { data: events = [] } = useEvents();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSubmit({
      eventId: Number(fd.get("eventId")),
      type: fd.get("type") as ReminderType,
      triggerBefore: fd.get("triggerBefore") as TriggerBefore,
      message: fd.get("message") as string,
    });
    formRef.current?.reset();
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Event *</label>
        <select
          name="eventId"
          required
          defaultValue={defaultEventId ?? ""}
          className={inputCls}
        >
          <option value="" disabled>Select event</option>
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>{ev.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">Reminder Type *</label>
        <div className="grid grid-cols-3 gap-2">
          {typeOptions.map((t, i) => (
            <label key={t.value} className="cursor-pointer">
              <input
                type="radio"
                name="type"
                value={t.value}
                defaultChecked={i === 0}
                className="sr-only peer"
              />
              <div className="border-2 border-gray-200 rounded-lg py-2 text-center text-sm transition-all peer-checked:border-indigo-500 peer-checked:bg-indigo-50 hover:border-indigo-300">
                <span className="block text-base">{t.emoji}</span>
                <span className="text-xs font-medium text-gray-700">{t.label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Send *</label>
        <select name="triggerBefore" defaultValue="24h" className={inputCls}>
          {triggerOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Custom Message <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <textarea
          name="message"
          rows={2}
          placeholder="Reminder: the event starts soon!"
          className={inputCls + " resize-none"}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors"
      >
        {isLoading ? "Scheduling..." : "Schedule Reminder"}
      </button>
    </form>
  );
}
