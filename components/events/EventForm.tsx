"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input }     from "@/components/ui/Input";
import { Select }    from "@/components/ui/Select";
import { Textarea }  from "@/components/ui/Textarea";
import type { CreateEventInput, EventStatus, Event } from "@/types";

// ─── react-hook-form isn't installed yet — we'll use controlled state instead.
// We keep the form logic self-contained so swapping to RHF later is trivial.

export interface EventFormValues {
  name:        string;
  date:        string;
  time:        string;
  venue:       string;
  description: string;
  status:      EventStatus;
  color:       string;
}

const DEFAULTS: EventFormValues = {
  name:        "",
  date:        "",
  time:        "18:00",
  venue:       "",
  description: "",
  status:      "upcoming",
  color:       "#1a1a2e",
};

const STATUS_OPTIONS: { value: EventStatus; label: string }[] = [
  { value: "upcoming",  label: "Upcoming" },
  { value: "ongoing",   label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const COLOR_OPTIONS = [
  { value: "#1a1a2e", label: "Midnight Blue" },
  { value: "#0d4f3c", label: "Deep Emerald" },
  { value: "#9d4b6b", label: "Rose" },
  { value: "#1a237e", label: "Royal Blue" },
  { value: "#e65c00", label: "Sunset Orange" },
  { value: "#5c4a1e", label: "Classic Ivory" },
];

interface EventFormProps {
  defaultValues?: Partial<Event>;
  onSubmit: (values: EventFormValues) => void;
  formId?: string;
}

export function EventForm({
  defaultValues,
  onSubmit,
  formId = "event-form",
}: EventFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<EventFormValues>({ defaultValues: DEFAULTS });

  // Populate form when editing an existing event
  useEffect(() => {
    if (defaultValues) {
      reset({
        name:        defaultValues.name        ?? "",
        date:        defaultValues.date        ?? "",
        time:        defaultValues.time        ?? "18:00",
        venue:       defaultValues.venue       ?? "",
        description: defaultValues.description ?? "",
        status:      defaultValues.status      ?? "upcoming",
        color:       defaultValues.color       ?? "#1a1a2e",
      });
    } else {
      reset(DEFAULTS);
    }
  }, [defaultValues, reset]);

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Event name */}
      <Input
        label="Event Name"
        placeholder="e.g. Annual Graduation Dinner"
        error={errors.name?.message}
        {...register("name", { required: "Event name is required" })}
      />

      {/* Date + Time */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Date"
          type="date"
          error={errors.date?.message}
          {...register("date", { required: "Date is required" })}
        />
        <Input
          label="Time"
          type="time"
          error={errors.time?.message}
          {...register("time", { required: "Time is required" })}
        />
      </div>

      {/* Venue */}
      <Input
        label="Venue"
        placeholder="e.g. Eko Hotel & Suites, Lagos"
        error={errors.venue?.message}
        {...register("venue", { required: "Venue is required" })}
      />

      {/* Description */}
      <Textarea
        label="Description"
        placeholder="Brief description of the event..."
        {...register("description")}
      />

      {/* Status + Colour */}
      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Status"
          options={STATUS_OPTIONS}
          {...register("status")}
        />
        <Select
          label="Card Colour"
          options={COLOR_OPTIONS}
          {...register("color")}
        />
      </div>
    </form>
  );
}
