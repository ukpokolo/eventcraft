import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-gray-500 uppercase tracking-wide"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full px-3 py-2 text-sm rounded-lg border bg-gray-50",
            "placeholder:text-gray-400 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-[#e94560]/30 focus:border-[#e94560] focus:bg-white",
            error
              ? "border-red-400 bg-red-50"
              : "border-gray-200 hover:border-gray-300",
            className
          )}
          {...props}
        />
        {hint && !error && (
          <span className="text-xs text-gray-400">{hint}</span>
        )}
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
