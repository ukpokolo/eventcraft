import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const sizeMap = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-8 h-8" };

export function Spinner({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <Loader2
      className={cn("animate-spin text-[#e94560]", sizeMap[size], className)}
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <Spinner className="w-8 h-8" />
    </div>
  );
}
