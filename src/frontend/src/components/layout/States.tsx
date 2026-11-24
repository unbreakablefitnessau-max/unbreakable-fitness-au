import { cn } from "@/lib/utils";
import { AlertTriangle, Loader2, RefreshCw } from "lucide-react";
import type * as React from "react";
import { UnbreakableButton } from "./UnbreakableButton";

/** Layout-matched loading block with a mono status line. */
export function LoadingState({
  label = "Loading",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <output
      data-ocid="app.loading_state"
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-16 text-center",
        className,
      )}
    >
      <Loader2
        className="size-6 animate-spin text-primary"
        aria-hidden="true"
      />
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
    </output>
  );
}

/** Error block with a recovery action. */
export function ErrorState({
  title = "Something went wrong",
  description = "We could not load this right now.",
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      role="alert"
      data-ocid="app.error_state"
      className={cn(
        "flex flex-col items-center gap-3 rounded-lg border border-destructive/40 bg-destructive/5 px-6 py-10 text-center",
        className,
      )}
    >
      <AlertTriangle className="size-6 text-destructive" aria-hidden="true" />
      <div className="space-y-1">
        <p className="font-display text-base font-semibold text-foreground">
          {title}
        </p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {onRetry ? (
        <UnbreakableButton
          variant="secondary"
          size="sm"
          data-ocid="app.retry_button"
          onClick={onRetry}
        >
          <RefreshCw aria-hidden="true" />
          Try again
        </UnbreakableButton>
      ) : null}
    </div>
  );
}

/** Empty block with headline, supporting copy and an optional action. */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      data-ocid="app.empty_state"
      className={cn(
        "flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-card/40 px-6 py-12 text-center",
        className,
      )}
    >
      {icon ? (
        <span className="flex size-11 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground">
          {icon}
        </span>
      ) : null}
      <div className="space-y-1">
        <p className="font-display text-base font-semibold uppercase tracking-tight text-foreground">
          {title}
        </p>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}
