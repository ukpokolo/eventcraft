"use client";

import Link from "next/link";
import { CalendarDays, Layers, Bell, Users, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

const ACTIONS = [
  {
    href:        "/events",
    label:       "Create New Event",
    description: "Add a new event to your calendar",
    icon:        <CalendarDays className="w-4 h-4" />,
    iconBg:      "bg-blue-50 text-blue-500",
  },
  {
    href:        "/cards",
    label:       "Generate Invitation Card",
    description: "Design & export a card for an event",
    icon:        <Layers className="w-4 h-4" />,
    iconBg:      "bg-purple-50 text-purple-500",
  },
  {
    href:        "/reminders",
    label:       "Schedule a Reminder",
    description: "Set up automated guest reminders",
    icon:        <Bell className="w-4 h-4" />,
    iconBg:      "bg-amber-50 text-amber-500",
  },
  {
    href:        "/guests",
    label:       "Manage Guests",
    description: "Add guests and track RSVPs",
    icon:        <Users className="w-4 h-4" />,
    iconBg:      "bg-green-50 text-green-500",
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <div className="divide-y divide-gray-50">
        {ACTIONS.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/60 transition-colors group"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${a.iconBg}`}>
              {a.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800">{a.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{a.description}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
          </Link>
        ))}
      </div>
    </Card>
  );
}
