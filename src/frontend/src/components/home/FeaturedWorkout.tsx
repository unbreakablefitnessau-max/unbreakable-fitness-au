import type { Workout } from "@/backend";
import { Eyebrow, Panel, Tag } from "@/components/layout/Panel";
import { unbreakableButton } from "@/components/layout/UnbreakableButton";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Flame, Layers } from "lucide-react";

/** Today's featured session: the newest workout in the library. */
export function FeaturedWorkout({ workout }: { workout: Workout }) {
  const exerciseCount = workout.exercises.length;

  return (
    <Panel className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-subtle opacity-70"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-primary/15 blur-3xl"
      />
      <div className="relative flex flex-col gap-6 p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <Eyebrow className="text-primary">Today&apos;s session</Eyebrow>
          <Tag tone="primary">{workout.category}</Tag>
          <Tag tone="outline">{workout.difficulty}</Tag>
        </div>

        <div className="space-y-3">
          <h3 className="font-display text-2xl font-bold uppercase leading-tight tracking-tight text-foreground md:text-3xl">
            {workout.title}
          </h3>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {workout.description}
          </p>
        </div>

        <dl className="flex flex-wrap gap-x-8 gap-y-3">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-primary" aria-hidden="true" />
            <div>
              <dt className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                Duration
              </dt>
              <dd className="font-display text-sm font-semibold text-foreground">
                {workout.durationMinutes.toString()} min
              </dd>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="size-4 text-primary" aria-hidden="true" />
            <div>
              <dt className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                Movements
              </dt>
              <dd className="font-display text-sm font-semibold text-foreground">
                {exerciseCount} {exerciseCount === 1 ? "block" : "blocks"}
              </dd>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="size-4 text-accent" aria-hidden="true" />
            <div>
              <dt className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                Intensity
              </dt>
              <dd className="font-display text-sm font-semibold text-foreground">
                {workout.difficulty}
              </dd>
            </div>
          </div>
        </dl>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/workouts/$workoutId"
            params={{ workoutId: workout.id.toString() }}
            data-ocid="home.featured.open_button"
            className={cn(
              unbreakableButton({ size: "md" }),
              "w-full sm:w-auto",
            )}
          >
            Start session
            <ArrowRight aria-hidden="true" />
          </Link>
          <Link
            to="/workouts"
            data-ocid="home.featured.library_link"
            className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground underline-offset-4 transition-smooth hover:text-foreground hover:underline"
          >
            Browse all training
          </Link>
        </div>
      </div>
    </Panel>
  );
}
