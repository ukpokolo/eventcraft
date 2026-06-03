"use client";

import { useRef } from "react";
import { useEvents } from "@/hooks/useEvents";
import type { CreateGuestInput, RsvpStatus } from "@/types";

interface GuestFormProps {
  defaultEventId?: number;
  onSubmit: (data: CreateGuestInput) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

const rsvpOptions: { value: RsvpStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "declined", label: "Declined" },
];

export function GuestForm({ defaultEventId, onSubmit, isLoading, submitLabel = "Add Guest" }: GuestFormProps) {
  const { data: events = [] } = useEvents();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSubmit({
      firstName: fd.get("firstName") as string,
      lastName: fd.get("lastName") as string,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string,
      eventId: Number(fd.get("eventId")),
      rsvp: fd.get("rsvp") as RsvpStatus,
    });
    formRef.current?.reset();
  };

  const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800 placeholder-gray-400";

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">First Name *</label>
          <input name="firstName" required placeholder="Amaka" className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Last Name *</label>
          <input name="lastName" required placeholder="Okonkwo" className={inputCls} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
        <input name="email" type="email" required placeholder="amaka@email.com" className={inputCls} />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
        <input name="phone" placeholder="+234 801 234 5678" className={inputCls} />
      </div>
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
        <label className="block text-xs font-medium text-gray-600 mb-1">RSVP Status</label>
        <select name="rsvp" defaultValue="pending" className={inputCls}>
          {rsvpOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors"
      >
        {isLoading ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
