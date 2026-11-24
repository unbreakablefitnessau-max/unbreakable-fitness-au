import type { Workout } from "@/backend";
import { Tag } from "@/components/layout/Panel";
import { UnbreakableButton } from "@/components/layout/UnbreakableButton";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock, Pencil, Trash2 } from "lucide-react";
import {
  categoryMonogram,
  difficultyTone,
  durationLabel,
  exerciseSummary,
} from "./workoutMeta";

export function WorkoutCard({
  workout,
  index,
  isAdmin,
  onEdit,
  onDelete,
}: {
  workout: Workout;
  index: number;
  isAdmin: boolean;
  onEdit: (workout: Workout) => void;
  onDelete: (workout: Workout) => void;
}) {
  return (
    <article
      data-ocid={`workouts.item.${index}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-subtle transition-smooth hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-elevated"
    >
      <div className="flex items-start justify-between gap-3 border-b border-border bg-muted/30 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden="true"
            className="flex size-11 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-primary/10 font-display text-sm font-bold uppercase tracking-tight text-primary"
          >
            {categoryMonogram(workout.category)}
          </span>
          <div className="min-w-0">
            <p className="truncate font-mono text-[0.6rem] uppercase tracking-[0.22em] text-muted-foreground">
              {workout.category || "Uncategorised"}
            </p>
            <h3 className="truncate font-display text-lg font-bold uppercase tracking-tight text-foreground">
              <Link
                to="/workouts/$workoutId"
                params={{ workoutId: workout.id.toString() }}
                data-ocid={`workouts.link.${index}`}
                className="outline-none after:absolute after:inset-0 focus-visible:underline focus-visible:underline-offset-4"
              >
                {workout.title}
              </Link>
            </h3>
          </div>
        </div>
        <Tag tone={difficultyTone(workout.difficulty)}>
          {workout.difficulty || "Open"}
        </Tag>
      </div>

      <div className="flex flex-1 flex-col gap-3 px-5 py-4">
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {workout.description || "No description provided yet."}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5 text-primary" aria-hidden="true" />
            {durationLabel(workout.durationMinutes)}
          </span>
          <span>{exerciseSummary(workout)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-border px-5 py-3">
        <span className="inline-flex items-center gap-1 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-primary">
          View session
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </span>
        {isAdmin ? (
          <div className="relative z-10 flex items-center gap-1">
            <UnbreakableButton
              variant="ghost"
              size="icon"
              aria-label={`Edit ${workout.title}`}
              data-ocid={`workouts.edit_button.${index}`}
              onClick={() => onEdit(workout)}
            >
              <Pencil aria-hidden="true" />
            </UnbreakableButton>
            <UnbreakableButton
              variant="ghost"
              size="icon"
              aria-label={`Delete ${workout.title}`}
              data-ocid={`workouts.delete_button.${index}`}
              className={cn("text-muted-foreground hover:text-destructive")}
              onClick={() => onDelete(workout)}
            >
              <Trash2 aria-hidden="true" />
            </UnbreakableButton>
          </div>
        ) : null}
      </div>
    </article>
  );
}
