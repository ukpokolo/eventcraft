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
        "h-14 flex-shrink-0 flex items-center justify-between",
        "px-6 border-b border-gray-200 bg-white",
        className
      )}
    >
      <h1
        className="text-xl font-semibold text-gray-900"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        {title}
      </h1>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
