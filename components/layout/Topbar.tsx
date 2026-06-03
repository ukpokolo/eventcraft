import { cn } from "@/lib/utils";

interface TopbarProps {
  title: string;
  actions?: React.ReactNode;
  className?: string;
}

export function Topbar({ title, actions, className }: TopbarProps) {
  return (
    <header
      className={cn(
        "min-h-14 flex-shrink-0 flex flex-col items-stretch gap-3",
        "px-4 py-3 border-b border-gray-200 bg-white",
        "sm:flex-row sm:items-center sm:justify-between sm:px-6",
        className
      )}
    >
      <h1
        className="text-lg sm:text-xl font-semibold text-gray-900 truncate"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        {title}
      </h1>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}
