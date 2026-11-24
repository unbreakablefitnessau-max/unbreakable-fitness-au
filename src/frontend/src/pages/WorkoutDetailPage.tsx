import type { Exercise } from "@/backend";
import { Eyebrow, Panel, SectionTitle, Tag } from "@/components/layout/Panel";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/layout/States";
import { UnbreakableButton } from "@/components/layout/UnbreakableButton";
import {
  useCompleteWorkout,
  useMyCompletions,
  useWorkout,
} from "@/hooks/useQueries";
import { formatDate, relativeDayLabel } from "@/lib/format";
import { useParams } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Dumbbell,
  Flame,
  History,
  Repeat,
  Timer,
} from "lucide-react";

function parseWorkoutId(raw: string): bigint | null {
  if (!/^\d+$/.test(raw)) return null;
  try {
    return BigInt(raw);
  } catch {
    return null;
  }
}

function exercisePrescription(exercise: Exercise): string {
  const parts: string[] = [];
  if (exercise.sets !== undefined && exercise.reps !== undefined) {
    parts.push(`${exercise.sets} × ${exercise.reps} reps`);
  } else if (exercise.sets !== undefined) {
    parts.push(`${exercise.sets} sets`);
  } else if (exercise.reps !== undefined) {
    parts.push(`${exercise.reps} reps`);
  }
  if (exercise.durationSeconds !== undefined) {
    const seconds = Number(exercise.durationSeconds);
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;
    parts.push(
      minutes > 0 ? `${minutes}m${rest > 0 ? ` ${rest}s` : ""}` : `${seconds}s`,
    );
  }
  return parts.length > 0 ? parts.join(" · ") : "As prescribed";
}

function ExerciseRow({
  exercise,
  index,
}: {
  exercise: Exercise;
  index: number;
}) {
  const hasTiming = exercise.durationSeconds !== undefined;
  return (
    <li
      data-ocid={`workout.exercise.item.${index + 1}`}
      className="flex gap-4 border-b border-border py-4 last:border-b-0"
    >
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-secondary font-mono text-xs font-semibold text-muted-foreground">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-display text-base font-semibold text-foreground">
            {exercise.name}
          </p>
          <Tag tone={hasTiming ? "primary" : "muted"}>
            {hasTiming ? (
              <Timer className="size-3" aria-hidden="true" />
            ) : (
              <Repeat className="size-3" aria-hidden="true" />
            )}
            {exercisePrescription(exercise)}
          </Tag>
        </div>
        {exercise.notes ? (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {exercise.notes}
          </p>
        ) : null}
      </div>
    </li>
  );
}

export function WorkoutDetailPage() {
  const params = useParams({ from: "/workouts/$workoutId" });
  const workoutId = parseWorkoutId(params.workoutId);
  const workoutQuery = useWorkout(workoutId);
  const completionsQuery = useMyCompletions();
  const completeWorkout = useCompleteWorkout();

  const workout = workoutQuery.data ?? null;
  const completions = completionsQuery.data ?? [];
  const history = workout
    ? completions
        .filter((entry) => entry.workoutId === workout.id)
        .sort((a, b) => Number(b.completedAt - a.completedAt))
    : [];
  const lastCompleted = history[0] ?? null;

  const backLink = (
    <Link
      to="/workouts"
      data-ocid="workout.back_link"
      className="inline-flex items-center gap-1.5 font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-muted-foreground transition-smooth hover:text-primary"
    >
      <ArrowLeft className="size-3.5" aria-hidden="true" />
      Training library
    </Link>
  );

  if (workoutId === null) {
    return (
      <div className="space-y-6">
        {backLink}
        <EmptyState
          icon={<Dumbbell className="size-5" aria-hidden="true" />}
          title="Workout not found"
          description="That session link doesn't match anything in the library. Pick a workout from the training library to get started."
          action={
            <Link
              to="/workouts"
              data-ocid="workout.browse_button"
              className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-transparent px-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-foreground transition-smooth hover:border-primary/60 hover:bg-secondary"
            >
              Browse workouts
            </Link>
          }
        />
      </div>
    );
  }

  if (workoutQuery.isLoading) {
    return (
      <div className="space-y-6">
        {backLink}
        <LoadingState label="Loading session" />
      </div>
    );
  }

  if (workoutQuery.isError) {
    return (
      <div className="space-y-6">
        {backLink}
        <ErrorState
          title="Couldn't load this session"
          description="The workout details didn't come through. Check your connection and try again."
          onRetry={() => void workoutQuery.refetch()}
        />
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="space-y-6">
        {backLink}
        <EmptyState
          icon={<Dumbbell className="size-5" aria-hidden="true" />}
          title="Workout not found"
          description="This session may have been removed from the library. Head back to browse what's available."
          action={
            <Link
              to="/workouts"
              data-ocid="workout.browse_button"
              className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-transparent px-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-foreground transition-smooth hover:border-primary/60 hover:bg-secondary"
            >
              Browse workouts
            </Link>
          }
        />
      </div>
    );
  }

  const isCompleting = completeWorkout.isPending;

  return (
    <div className="space-y-6">
      {backLink}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <Panel className="overflow-hidden">
            <div className="border-b border-border bg-gradient-subtle px-5 py-6 md:px-7 md:py-8">
              <div className="flex flex-wrap items-center gap-2">
                <Tag tone="primary">{workout.category}</Tag>
                <Tag tone="outline">{workout.difficulty}</Tag>
              </div>
              <h1 className="mt-3 font-display text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
                {workout.title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {workout.description}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-3.5" aria-hidden="true" />
                  {Number(workout.durationMinutes)} min
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Dumbbell className="size-3.5" aria-hidden="true" />
                  {workout.exercises.length} exercises
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Flame className="size-3.5" aria-hidden="true" />
                  {workout.difficulty}
                </span>
              </div>
            </div>

            <div className="px-5 py-5 md:px-7 md:py-6">
              <SectionTitle slash="Exercises" className="text-lg md:text-xl">
                The work
              </SectionTitle>
              {workout.exercises.length > 0 ? (
                <ul data-ocid="workout.exercise.list" className="mt-3">
                  {workout.exercises.map((exercise, index) => (
                    <ExerciseRow
                      key={`${exercise.name}-${index}`}
                      exercise={exercise}
                      index={index}
                    />
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  No exercises have been listed for this session yet.
                </p>
              )}
            </div>
          </Panel>

          <Panel className="p-5 md:p-7">
            <div className="flex items-center gap-2">
              <Eyebrow className="text-accent">Coach notes</Eyebrow>
              <Tag tone="coach">Coach</Tag>
            </div>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
              {workout.coachingNotes}
            </p>
          </Panel>
        </div>

        <aside className="space-y-6">
          <Panel className="p-5">
            <Eyebrow>Log this session</Eyebrow>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Mark the workout complete to add it to your training history with
              today&apos;s date.
            </p>
            <UnbreakableButton
              className="mt-4 w-full"
              size="lg"
              data-ocid="workout.complete_button"
              disabled={isCompleting}
              onClick={() => completeWorkout.mutate(workout.id)}
            >
              <CheckCircle2 aria-hidden="true" />
              {isCompleting ? "Recording…" : "Mark complete"}
            </UnbreakableButton>
            {completeWorkout.isError ? (
              <p
                data-ocid="workout.complete_error"
                className="mt-3 text-xs text-destructive"
              >
                Couldn&apos;t record that. Please try again.
              </p>
            ) : null}
            {completeWorkout.isSuccess ? (
              <p
                data-ocid="workout.complete_success"
                className="mt-3 text-xs text-success"
              >
                Logged. Nice work — it&apos;s in your history.
              </p>
            ) : null}
            {lastCompleted ? (
              <p className="mt-3 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">
                Last done {relativeDayLabel(lastCompleted.completedAt)}
              </p>
            ) : null}
          </Panel>

          <Panel className="p-5">
            <div className="flex items-center gap-2">
              <History
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
              <Eyebrow>Your history</Eyebrow>
            </div>
            {completionsQuery.isLoading ? (
              <p className="mt-3 text-sm text-muted-foreground">Loading…</p>
            ) : history.length > 0 ? (
              <ul data-ocid="workout.history.list" className="mt-3 space-y-2">
                {history.map((entry, index) => (
                  <li
                    key={entry.id.toString()}
                    data-ocid={`workout.history.item.${index + 1}`}
                    className="flex items-center justify-between gap-3 rounded-md border border-border bg-secondary/40 px-3 py-2"
                  >
                    <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-foreground">
                      {relativeDayLabel(entry.completedAt)}
                    </span>
                    <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted-foreground">
                      {formatDate(entry.completedAt)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                You haven&apos;t logged this session yet. Complete it to start
                your history.
              </p>
            )}
          </Panel>
        </aside>
      </div>
    </div>
  );
}
