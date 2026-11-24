import { ChatActivity } from "@/components/home/ChatActivity";
import { FeaturedWorkout } from "@/components/home/FeaturedWorkout";
import { QuickLinks } from "@/components/home/QuickLinks";
import { RecentWorkouts } from "@/components/home/RecentWorkouts";
import { Eyebrow, Panel, SectionTitle } from "@/components/layout/Panel";
import { EmptyState, ErrorState } from "@/components/layout/States";
import {
  useMemberProfile,
  useMessages,
  useMyCompletions,
  useWorkouts,
} from "@/hooks/useQueries";
import { firstName } from "@/lib/format";
import { Link } from "@tanstack/react-router";
import { Dumbbell } from "lucide-react";

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function HomePage() {
  const profile = useMemberProfile();
  const workouts = useWorkouts();
  const completions = useMyCompletions();
  const messages = useMessages();

  const displayName = profile.data?.displayName?.trim() || "Member";
  const name = firstName(displayName);

  const featured = workouts.data?.length
    ? [...workouts.data].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))[0]
    : null;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <Eyebrow>{greeting()}</Eyebrow>
        <h1 className="font-display text-3xl font-bold uppercase leading-none tracking-tight text-foreground md:text-4xl">
          Welcome back, <span className="text-gradient-primary">{name}</span>
        </h1>
        <p className="max-w-xl text-sm text-muted-foreground">
          Your training, your crew, one place. Pick up where you left off and
          keep the streak alive.
        </p>
      </header>

      <section aria-labelledby="featured-heading" className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <SectionTitle slash="Today" className="text-lg md:text-xl">
            <span id="featured-heading">Featured workout</span>
          </SectionTitle>
        </div>

        {workouts.isLoading ? (
          <Panel className="space-y-4 p-6 md:p-8">
            <div className="h-3 w-24 animate-pulse rounded bg-muted" />
            <div className="h-8 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-3 w-full animate-pulse rounded bg-muted" />
            <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
            <div className="h-10 w-40 animate-pulse rounded-lg bg-muted" />
          </Panel>
        ) : workouts.isError ? (
          <ErrorState
            title="Couldn't load today's session"
            description="The training feed didn't come through. Try again in a moment."
            onRetry={() => void workouts.refetch()}
          />
        ) : featured ? (
          <FeaturedWorkout workout={featured} />
        ) : (
          <EmptyState
            icon={<Dumbbell className="size-5" aria-hidden="true" />}
            title="No sessions programmed yet"
            description="Your coaches haven't published a session yet. Check back soon or browse the library."
            action={
              <Link
                to="/workouts"
                data-ocid="home.featured.empty_button"
                className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-primary underline-offset-4 hover:underline"
              >
                Open training library
              </Link>
            }
          />
        )}
      </section>

      <QuickLinks />

      <div className="grid gap-8 lg:grid-cols-2">
        <RecentWorkouts
          completions={completions.data ?? []}
          isLoading={completions.isLoading}
          isError={completions.isError}
          onRetry={() => void completions.refetch()}
        />
        <ChatActivity
          messages={messages.data ?? []}
          isLoading={messages.isLoading}
          isError={messages.isError}
          onRetry={() => void messages.refetch()}
        />
      </div>
    </div>
  );
}
