import type { Workout } from "@/backend";
import { Eyebrow, Panel, Tag } from "@/components/layout/Panel";
import { EmptyState } from "@/components/layout/States";
import { formatDate } from "@/lib/format";
import { Link } from "@tanstack/react-router";
import { History } from "lucide-react";

export function CompletionHistory({
  completions,
  workouts,
}: {
  completions: Array<{
    id: bigint;
    workoutId: bigint;
    workoutTitle: string;
    completedAt: bigint;
  }>;
  workouts: Workout[];
}) {
  const titleById = new Map(
    workouts.map((workout) => [workout.id.toString(), workout.title]),
  );
  const sorted = [...completions].sort((a, b) =>
    a.completedAt < b.completedAt ? 1 : a.completedAt > b.completedAt ? -1 : 0,
  );

  return (
    <Panel className="flex flex-col overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <Eyebrow>Your log</Eyebrow>
          <h3 className="font-display text-base font-bold uppercase tracking-tight text-foreground">
            Completed sessions
          </h3>
        </div>
        <span className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
          {sorted.length.toString().padStart(2, "0")}
        </span>
      </div>

      {sorted.length === 0 ? (
        <div className="p-4">
          <EmptyState
            icon={<History className="size-5" aria-hidden="true" />}
            title="No sessions logged"
            description="Finish a workout from the library and it will appear here."
            className="border-0 bg-transparent py-8"
          />
        </div>
      ) : (
        <ol
          data-ocid="workouts.history.list"
          className="divide-y divide-border"
        >
          {sorted.map((completion, index) => {
            const title =
              titleById.get(completion.workoutId.toString()) ??
              completion.workoutTitle;
            return (
              <li
                key={completion.id.toString()}
                data-ocid={`workouts.history.item.${index}`}
                className="flex items-center justify-between gap-3 px-5 py-3"
              >
                <div className="min-w-0">
                  <Link
                    to="/workouts/$workoutId"
                    params={{ workoutId: completion.workoutId.toString() }}
                    className="block truncate font-display text-sm font-semibold text-foreground underline-offset-4 hover:text-primary hover:underline"
                  >
                    {title}
                  </Link>
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground">
                    {formatDate(completion.completedAt)}
                  </p>
                </div>
                <Tag tone="online">Done</Tag>
              </li>
            );
          })}
        </ol>
      )}
    </Panel>
  );
}
