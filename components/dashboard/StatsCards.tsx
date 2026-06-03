"use client";

import { CalendarDays, Users, Bell, TrendingUp } from "lucide-react";
import type { Event, Guest, Reminder } from "@/types";

interface StatsCardsProps {
  events: Event[];
  guests: Guest[];
  reminders: Reminder[];
}

interface StatCardProps {
  label: string;
  value: number;
  sub: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

function StatCard({ label, value, sub, icon, iconBg, iconColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            {label}
          </p>
          <p
            className="text-3xl font-bold text-gray-900 leading-none"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {value}
          </p>
          <p className="text-xs text-gray-400 mt-1.5">{sub}</p>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
          <span className={iconColor}>{icon}</span>
        </div>
      </div>
    </div>
  );
}

export function StatsCards({ events, guests, reminders }: StatsCardsProps) {
  const upcoming  = events.filter((e) => e.status === "upcoming").length;
  const confirmed = guests.filter((g) => g.rsvp === "confirmed").length;
  const scheduled = reminders.filter((r) => r.status === "scheduled").length;

  const stats: StatCardProps[] = [
    {
      label:     "Total Events",
      value:     events.length,
      sub:       `${upcoming} upcoming`,
      icon:      <CalendarDays className="w-5 h-5" />,
      iconBg:    "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      label:     "Upcoming",
      value:     upcoming,
      sub:       "scheduled events",
      icon:      <TrendingUp className="w-5 h-5" />,
      iconBg:    "bg-green-50",
      iconColor: "text-green-500",
    },
    {
      label:     "Total Guests",
      value:     guests.length,
      sub:       `${confirmed} confirmed`,
      icon:      <Users className="w-5 h-5" />,
      iconBg:    "bg-amber-50",
      iconColor: "text-amber-500",
    },
    {
      label:     "Active Reminders",
      value:     scheduled,
      sub:       "scheduled to send",
      icon:      <Bell className="w-5 h-5" />,
      iconBg:    "bg-red-50",
      iconColor: "text-[#e94560]",
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>
  );
}
