import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const areaId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={areaId}
            className="text-xs font-medium text-gray-500 uppercase tracking-wide"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={areaId}
          rows={3}
          className={cn(
            "w-full px-3 py-2 text-sm rounded-lg border bg-gray-50 resize-y",
            "placeholder:text-gray-400 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-[#e94560]/30 focus:border-[#e94560] focus:bg-white",
            error
              ? "border-red-400 bg-red-50"
              : "border-gray-200 hover:border-gray-300",
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
