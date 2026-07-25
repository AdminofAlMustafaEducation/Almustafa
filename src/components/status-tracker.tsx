import { cn } from "@/lib/utils";
import { Check, Clock, FileSearch, XCircle } from "lucide-react";

type StatusStep = {
  label: string;
  description: string;
  date?: string;
  status: "complete" | "current" | "upcoming" | "rejected";
};

const STATUS_MAP: Record<string, StatusStep[]> = {
  pending: [
    {
      label: "Submitted",
      description: "Your application has been received.",
      date: "Jan 15, 2026",
      status: "complete",
    },
    {
      label: "Under Review",
      description: "Waiting for review by the admissions team.",
      status: "current",
    },
    {
      label: "Decision Made",
      description: "Final decision on your application.",
      status: "upcoming",
    },
  ],
  reviewing: [
    {
      label: "Submitted",
      description: "Your application has been received.",
      date: "Jan 15, 2026",
      status: "complete",
    },
    {
      label: "Under Review",
      description: "Your application is being reviewed.",
      date: "Jan 19, 2026",
      status: "current",
    },
    {
      label: "Decision Made",
      description: "Final decision on your application.",
      status: "upcoming",
    },
  ],
  approved: [
    {
      label: "Submitted",
      description: "Your application has been received.",
      date: "Jan 15, 2026",
      status: "complete",
    },
    {
      label: "Under Review",
      description: "Your application was reviewed.",
      date: "Jan 19, 2026",
      status: "complete",
    },
    {
      label: "Approved",
      description: "Congratulations! Your application has been approved.",
      date: "Jan 20, 2026",
      status: "complete",
    },
  ],
  rejected: [
    {
      label: "Submitted",
      description: "Your application has been received.",
      date: "Jan 15, 2026",
      status: "complete",
    },
    {
      label: "Under Review",
      description: "Your application was reviewed.",
      date: "Jan 19, 2026",
      status: "complete",
    },
    {
      label: "Not Accepted",
      description: "Unfortunately, your application was not accepted.",
      date: "Jan 25, 2026",
      status: "rejected",
    },
  ],
  enrolled: [
    {
      label: "Submitted",
      description: "Your application has been received.",
      date: "Jan 15, 2026",
      status: "complete",
    },
    {
      label: "Under Review",
      description: "Your application was reviewed.",
      date: "Jan 19, 2026",
      status: "complete",
    },
    {
      label: "Approved",
      description: "Your application was approved.",
      date: "Jan 20, 2026",
      status: "complete",
    },
    {
      label: "Enrolled",
      description: "You are now enrolled. Welcome to Al-Mustafa Academy!",
      date: "Jan 22, 2026",
      status: "complete",
    },
  ],
};

const STATUS_COLORS: Record<string, string> = {
  pending: "text-muted-foreground",
  reviewing: "text-blue-600",
  approved: "text-emerald-600",
  rejected: "text-red-600",
  enrolled: "text-emerald-600",
};

const STATUS_BG: Record<string, string> = {
  complete: "bg-emerald-100 text-emerald-700 border-emerald-200",
  current: "bg-blue-100 text-blue-700 border-blue-200",
  upcoming: "bg-muted text-muted-foreground border-border",
  rejected: "bg-red-100 text-red-700 border-red-200",
};

const STATUS_DOT: Record<string, string> = {
  complete: "bg-emerald-500",
  current: "bg-blue-500",
  upcoming: "bg-border",
  rejected: "bg-red-500",
};

type StatusTrackerProps = {
  status: string;
  createdAt?: string;
  reviewedAt?: string;
  reviewerNotes?: string;
};

export function StatusTracker({ status, createdAt, reviewedAt, reviewerNotes }: StatusTrackerProps) {
  const steps = STATUS_MAP[status] ?? STATUS_MAP.pending;
  const colorClass = STATUS_COLORS[status] ?? STATUS_COLORS.pending;

  return (
    <div className="space-y-6">
      {/* Current status badge */}
      <div className="flex items-center gap-3">
        <div className={cn("text-sm font-bold uppercase tracking-wider", colorClass)}>
          Status:
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
            STATUS_BG[status === "enrolled" ? "complete" : status === "approved" ? "complete" : status === "reviewing" ? "current" : status === "rejected" ? "rejected" : "upcoming"],
          )}
        >
          {status === "approved" || status === "enrolled" ? (
            <Check className="h-3.5 w-3.5" />
          ) : status === "rejected" ? (
            <XCircle className="h-3.5 w-3.5" />
          ) : status === "reviewing" ? (
            <FileSearch className="h-3.5 w-3.5" />
          ) : (
            <Clock className="h-3.5 w-3.5" />
          )}
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      {/* Timeline */}
      <div className="relative ml-4">
        <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-border" />
        <div className="space-y-8">
          {steps.map((step) => (
            <div key={step.label} className="relative flex gap-4">
              <div
                className={cn(
                  "relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full border-2",
                  STATUS_BG[step.status],
                )}
              >
                {step.status === "complete" ? (
                  <Check className="h-3.5 w-3.5" />
                ) : step.status === "rejected" ? (
                  <XCircle className="h-3.5 w-3.5" />
                ) : (
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      STATUS_DOT[step.status],
                    )}
                  />
                )}
              </div>
              <div className="pt-0.5">
                <div className="flex items-baseline gap-2">
                  <h4 className="text-sm font-bold text-navy-deep">{step.label}</h4>
                  {step.date && (
                    <span className="text-xs text-muted-foreground">{step.date}</span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviewer notes */}
      {reviewerNotes && (
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Reviewer Notes
          </p>
          <p className="mt-2 text-sm text-navy-deep">{reviewerNotes}</p>
        </div>
      )}
    </div>
  );
}
