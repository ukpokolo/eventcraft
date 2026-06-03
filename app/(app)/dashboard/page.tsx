"use client";

import { Topbar }             from "@/components/layout/Topbar";
import { PageLoader }         from "@/components/ui/Spinner";
import { StatsCards }         from "@/components/dashboard/StatsCards";
import { RecentEventsTable }  from "@/components/dashboard/RecentEventsTable";
import { UpcomingReminders }  from "@/components/dashboard/UpcomingReminders";
import { QuickActions }       from "@/components/dashboard/QuickActions";
import { useEvents }          from "@/hooks/useEvents";
import { useGuests }          from "@/hooks/useGuests";
import { useReminders }       from "@/hooks/useReminders";

export default function DashboardPage() {
  const { data: events    = [], isLoading: evLoading  } = useEvents();
  const { data: guests    = [], isLoading: guLoading  } = useGuests();
  const { data: reminders = [], isLoading: reLoading  } = useReminders();

  const loading = evLoading || guLoading || reLoading;

  return (
    <>
      <Topbar title="Dashboard" />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        {loading ? (
          <PageLoader />
        ) : (
          <>
            {/* Row 1 — Stats */}
            <StatsCards
              events={events}
              guests={guests}
              reminders={reminders}
            />

            {/* Row 2 — Recent events (full width) */}
            <RecentEventsTable events={events} guests={guests} />

            {/* Row 3 — Reminders + Quick Actions side by side */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <UpcomingReminders reminders={reminders} events={events} />
              <QuickActions />
            </div>
          </>
        )}
      </main>
    </>
  );
}
