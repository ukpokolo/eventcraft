"use client";

import { cn } from "@/lib/utils";
import type { CardTemplate } from "@/types";

interface TemplatePickerProps {
  templates: CardTemplate[];
  selectedId: number | null;
  onSelect: (t: CardTemplate) => void;
}

export function TemplatePicker({ templates, selectedId, onSelect }: TemplatePickerProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {templates.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelect(t)}
          className={cn(
            "relative rounded-xl overflow-hidden border-2 transition-all group",
            selectedId === t.id
              ? "border-indigo-500 shadow-lg scale-[1.02]"
              : "border-gray-200 hover:border-indigo-300 hover:shadow-md"
          )}
          style={{ background: t.bg }}
        >
          {/* Mini card preview */}
          <div className="h-20 flex flex-col items-center justify-center gap-1 px-2">
            <div
              className="text-[9px] font-bold uppercase tracking-widest opacity-60"
              style={{ color: t.textColor }}
            >
              You are invited
            </div>
            <div
              className="text-xs font-semibold text-center leading-tight"
              style={{ color: t.textColor }}
            >
              Event Name
            </div>
          </div>
          {/* Label */}
          <div className="absolute bottom-0 inset-x-0 bg-black/30 text-white text-[10px] font-medium text-center py-1">
            {t.name}
          </div>
          {selectedId === t.id && (
            <div className="absolute top-1 right-1 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
