"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="flex h-dvh overflow-hidden bg-[#f4f5f7]">
        <Sidebar />

        {navOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/45"
              aria-label="Close navigation"
              onClick={() => setNavOpen(false)}
            />
            <div className="relative h-full w-[260px] max-w-[82vw]">
              <Sidebar mobile onNavigate={() => setNavOpen(false)} />
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <div className="md:hidden h-14 flex-shrink-0 flex items-center gap-3 border-b border-gray-200 bg-white px-4">
            <button
              type="button"
              onClick={() => setNavOpen(true)}
              aria-label="Open navigation"
              className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-700"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <p
                className="text-base font-bold text-gray-900 leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                EventCraft
              </p>
              <p className="text-[10px] uppercase tracking-wide text-gray-400">
                Event Management
              </p>
            </div>
          </div>
          {children}
        </div>
      </div>
    </AuthGuard>
  );
}
