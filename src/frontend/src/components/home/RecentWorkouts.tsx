import type { Completion } from "@/backend";
import { Eyebrow, Panel, SectionTitle, Tag } from "@/components/layout/Panel";
import { EmptyState, ErrorState } from "@/components/layout/States";
import { unbreakableButton } from "@/components/layout/UnbreakableButton";
import { formatDay, formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, History } from "lucide-react";

/** The member's most recent completed sessions, newest first. */
export function RecentWorkouts({
  completions,
  isLoading,
  isError,
  onRetry,
}: {
  completions: Completion[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}) {
  const recent = [...completions]
    .sort((a, b) => (a.completedAt < b.completedAt ? 1 : -1))
    .slice(0, 4);

  return (
    <section aria-labelledby="recent-workouts-heading" className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <Eyebrow>Your log</Eyebrow>
          <SectionTitle slash="Recent" className="text-lg md:text-xl">
            <span id="recent-workouts-heading">Recent sessions</span>
          </SectionTitle>
        </div>
        <Link
          to="/workouts"
          data-ocid="home.recent.library_link"
          className="shrink-0 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground underline-offset-4 transition-smooth hover:text-primary hover:underline"
        >
          All training
        </Link>
      </div>

      {isLoading ? (
        <Panel className="divide-y divide-border">
          {Array.from({ length: 3 }, (_, i) => `recent-skeleton-${i}`).map(
            (id) => (
              <div key={id} className="flex items-center gap-3 p-4">
                <div className="size-9 animate-pulse rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                  <div className="h-2.5 w-1/4 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ),
          )}
        </Panel>
      ) : isError ? (
        <ErrorState
          title="Couldn't load your sessions"
          description="Your training log didn't come through. Give it another go."
          onRetry={onRetry}
        />
      ) : recent.length === 0 ? (
        <EmptyState
          icon={<History className="size-5" aria-hidden="true" />}
          title="No sessions logged yet"
          description="Finish your first session and it will show up here as proof of the work."
          action={
            <Link
              to="/workouts"
              data-ocid="home.recent.empty_button"
              className={cn(unbreakableButton({ size: "sm" }))}
            >
              Find a session
              <ArrowRight aria-hidden="true" />
            </Link>
          }
        />
      ) : (
        <Panel className="divide-y divide-border">
          {recent.map((completion, index) => (
            <Link
              key={completion.id.toString()}
              to="/workouts/$workoutId"
              params={{ workoutId: completion.workoutId.toString() }}
              data-ocid={`home.recent.item.${index + 1}`}
              className="group flex items-center gap-3 p-4 transition-smooth hover:bg-secondary/60"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-success/40 bg-success/15 text-success">
                <CheckCircle2 className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm font-semibold text-foreground">
                  {completion.workoutTitle}
                </p>
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">
                  {formatDay(completion.completedAt)} ·{" "}
                  {formatTime(completion.completedAt)}
                </p>
              </div>
              <Tag tone="online" className="hidden sm:inline-flex">
                Done
              </Tag>
              <ArrowRight
                className="size-4 shrink-0 text-muted-foreground transition-smooth group-hover:translate-x-0.5 group-hover:text-primary"
                aria-hidden="true"
              />
            </Link>
          ))}
        </Panel>
      )}
    </section>
  );
}
