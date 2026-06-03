"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Layers,
  Bell,
  Users,
  BellRing,
  Settings,
  LogOut,
} from "lucide-react";
import { cn, initials } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS = [
  { href: "/dashboard",      label: "Dashboard",         icon: LayoutDashboard },
  { href: "/events",         label: "My Events",         icon: CalendarDays },
  { href: "/cards",          label: "Card Generator",    icon: Layers },
  { href: "/reminders",      label: "Reminders",         icon: Bell },
  { href: "/guests",         label: "Guests",            icon: Users },
  { href: "/notifications",  label: "Notification Log",  icon: BellRing },
  { href: "/settings",       label: "Settings",          icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const displayName = user ? `${user.firstName} ${user.lastName}` : "Guest";
  const displayRole = user?.role ?? "";
  const avatarLetters = user ? initials(user.firstName, user.lastName) : "?";

  return (
    <aside className="w-[220px] flex-shrink-0 flex flex-col h-full"
           style={{ background: "#1a1a2e" }}>

      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <p className="text-white font-bold text-lg leading-tight"
           style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          EventCraft
        </p>
        <p className="text-white/40 text-[10px] tracking-widest uppercase mt-0.5">
          Event Management
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm",
                "transition-all duration-150 font-medium",
                active
                  ? "bg-[#e94560] text-white"
                  : "text-white/55 hover:text-white/90 hover:bg-white/8"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-full bg-[#f5a623] flex items-center
                          justify-center text-xs font-bold text-white flex-shrink-0">
            {avatarLetters}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white/80 text-xs font-medium leading-tight truncate">
              {displayName}
            </p>
            <p className="text-white/35 text-[10px] truncate">{displayRole}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs
                     text-white/50 hover:text-white/90 hover:bg-white/8
                     transition-all font-medium"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
