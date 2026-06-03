"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Download, RefreshCw } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { useTemplates } from "@/hooks/useTemplates";
import { useGuestsByEvent } from "@/hooks/useGuests";
import { TemplatePicker } from "@/components/cards/TemplatePicker";
import { CardPreview } from "@/components/cards/CardPreview";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import type { CardTemplate, Event } from "@/types";

export default function CardsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <CardsPageContent />
    </Suspense>
  );
}

function CardsPageContent() {
  const searchParams = useSearchParams();
  const preselectedEventId = searchParams.get("eventId")
    ? Number(searchParams.get("eventId"))
    : null;

  const { data: events = [], isLoading: eventsLoading } = useEvents();
  const { data: templates = [], isLoading: templatesLoading } = useTemplates();

  const [selectedEventId, setSelectedEventId] = useState<number | null>(preselectedEventId);
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate | null>(null);
  const [customMessage, setCustomMessage] = useState("");

  useEffect(() => {
    if (!templatesLoading && templates.length > 0 && !selectedTemplate) {
      setSelectedTemplate(templates[0]);
    }
  }, [selectedTemplate, templates, templatesLoading]);

  const { data: guests = [] } = useGuestsByEvent(selectedEventId ?? 0);

  const selectedEvent: Event | undefined = events.find(
    (e) => e.id === selectedEventId
  );

  const isLoading = eventsLoading || templatesLoading;

  const handleDownload = () => {
    if (!selectedEvent || !selectedTemplate) return;
    const el = document.getElementById("invitation-card");
    if (!el) return;
    const safeName = selectedEvent.name.replace(/[^a-z0-9]/gi, "-").toLowerCase();
    const html = [
      "<!DOCTYPE html>",
      "<html lang=\"en\">",
      "<head>",
      '  <meta charset="UTF-8" />',
      "  <title>Invitation</title>",
      '  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet" />',
      "  <style>",
      "    body { margin:0; display:flex; align-items:center; justify-content:center; min-height:100vh; background:#f3f4f6; }",
      "    .wrap { max-width:480px; width:90%; border-radius:16px; overflow:hidden; box-shadow:0 25px 50px rgba(0,0,0,.25); }",
      "  </style>",
      "</head>",
      "<body>",
      '  <div class="wrap">',
      el.outerHTML,
      "  </div>",
      "</body>",
      "</html>",
    ].join("\n");
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "invitation-" + safeName + ".html";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
      <div className="mb-6">
        <h1
          className="text-xl sm:text-2xl font-bold text-gray-900"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Card Generator
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Pick an event, choose a template, and download your invitation card.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left: controls */}
        <div className="space-y-6">
          {/* Step 1: Event selector */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">1. Select Event</h2>
            {events.length === 0 ? (
              <EmptyState
                icon="calendar"
                title="No events yet"
                description="Create an event first, then generate a card for it."
              />
            ) : (
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {events.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEventId(event.id)}
                    className={
                      "w-full text-left px-4 py-3 rounded-lg border-2 transition-all text-sm " +
                      (selectedEventId === event.id
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50")
                    }
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ background: event.color }}
                      />
                      <div>
                        <p className="font-medium text-gray-900">{event.name}</p>
                        <p className="text-xs text-gray-500">{event.venue}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Step 2: Template picker */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">2. Choose Template</h2>
            <TemplatePicker
              templates={templates}
              selectedId={selectedTemplate?.id ?? null}
              onSelect={setSelectedTemplate}
            />
          </div>

          {/* Step 3: Custom message */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-1">
              3. Personal Message{" "}
              <span className="font-normal text-gray-400">(optional)</span>
            </h2>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="e.g. Your presence would be greatly honoured..."
              rows={3}
              maxLength={200}
              className="mt-2 w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none text-gray-800 placeholder-gray-400"
            />
            <p className="text-xs text-gray-400 text-right">{customMessage.length}/200</p>
          </div>
        </div>

        {/* Right: live preview */}
        <div className="lg:sticky lg:top-6 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-700">Preview</h2>
              {selectedEvent && selectedTemplate && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setSelectedEventId(null);
                      setCustomMessage("");
                    }}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Reset
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </button>
                </div>
              )}
            </div>

            {!selectedEvent || !selectedTemplate ? (
              <div className="rounded-xl border-2 border-dashed border-gray-200 py-16 flex flex-col items-center gap-2 text-gray-400">
                <svg
                  className="w-10 h-10 opacity-30"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
                  />
                </svg>
                <p className="text-sm">Select an event and template to preview</p>
              </div>
            ) : (
              <CardPreview
                template={selectedTemplate}
                event={selectedEvent}
                guests={guests}
                customMessage={customMessage}
              />
            )}
          </div>
          {selectedEvent && selectedTemplate && (
            <p className="text-xs text-gray-400 text-center">
              Click <strong>Download</strong> to save as an HTML file you can open in any browser.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
