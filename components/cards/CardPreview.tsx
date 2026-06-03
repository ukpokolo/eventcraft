"use client";

import type { CardTemplate, Event, Guest } from "@/types";
import { formatDate, formatTime } from "@/lib/utils";

interface CardPreviewProps {
  template: CardTemplate;
  event: Event;
  guests: Guest[];
  customMessage: string;
}

export function CardPreview({ template, event, guests, customMessage }: CardPreviewProps) {
  const confirmedCount = guests.filter((g) => g.rsvp === "confirmed").length;

  return (
    <div
      id="invitation-card"
      className="w-full rounded-2xl overflow-hidden shadow-2xl"
      style={{ background: template.bg, color: template.textColor, minHeight: 380 }}
    >
      {/* Top decorative band */}
      <div
        className="h-2 w-full opacity-40"
        style={{ background: template.textColor }}
      />

      <div className="px-8 py-10 flex flex-col items-center text-center gap-5">
        {/* Header */}
        <div>
          <p
            className="text-xs font-bold uppercase tracking-[0.3em] opacity-60 mb-2"
            style={{ color: template.textColor }}
          >
            You are cordially invited
          </p>
          <h1
            className="text-3xl font-bold leading-tight"
            style={{
              color: template.textColor,
              fontFamily: "'Playfair Display', Georgia, serif",
            }}
          >
            {event.name}
          </h1>
        </div>

        {/* Divider */}
        <div
          className="w-16 h-[2px] rounded-full opacity-40"
          style={{ background: template.textColor }}
        />

        {/* Event details */}
        <div className="flex flex-col gap-2 text-sm" style={{ color: template.textColor }}>
          <div className="flex items-center justify-center gap-2 opacity-90">
            <svg className="w-4 h-4 opacity-60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            <span className="font-medium">{formatDate(event.date)}</span>
            <span className="opacity-50">·</span>
            <span>{formatTime(event.time)}</span>
          </div>
          <div className="flex items-center justify-center gap-2 opacity-90">
            <svg className="w-4 h-4 opacity-60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span>{event.venue}</span>
          </div>
        </div>

        {/* Description */}
        {event.description && (
          <p className="text-sm leading-relaxed max-w-xs opacity-75" style={{ color: template.textColor }}>
            {event.description}
          </p>
        )}

        {/* Custom message */}
        {customMessage && (
          <>
            <div className="w-10 h-[1px] opacity-30" style={{ background: template.textColor }} />
            <p
              className="text-sm italic leading-relaxed max-w-xs opacity-90"
              style={{
                color: template.textColor,
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              &ldquo;{customMessage}&rdquo;
            </p>
          </>
        )}

        {/* Guest info */}
        {guests.length > 0 && (
          <div
            className="mt-2 px-4 py-2 rounded-full text-xs font-medium opacity-70"
            style={{
              border: `1px solid ${template.textColor}`,
              color: template.textColor,
            }}
          >
            {confirmedCount} confirmed · {guests.length} invited
          </div>
        )}
      </div>

      {/* Bottom band */}
      <div
        className="h-2 w-full opacity-40"
        style={{ background: template.textColor }}
      />
    </div>
  );
}
