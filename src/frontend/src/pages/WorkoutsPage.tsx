import type { Workout, WorkoutInput } from "@/backend";
import { Eyebrow, Panel, SectionTitle, Tag } from "@/components/layout/Panel";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/layout/States";
import { UnbreakableButton } from "@/components/layout/UnbreakableButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CompletionHistory } from "@/components/workouts/CompletionHistory";
import { WorkoutCard } from "@/components/workouts/WorkoutCard";
import { WorkoutForm } from "@/components/workouts/WorkoutForm";
import { CATEGORY_OPTIONS } from "@/components/workouts/workoutMeta";
import {
  useCreateWorkout,
  useDeleteWorkout,
  useMemberProfile,
  useMyCompletions,
  useUpdateWorkout,
  useWorkouts,
} from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { Dumbbell, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

type EditorState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; workout: Workout };

const ALL = "All";

export function WorkoutsPage() {
  const workoutsQuery = useWorkouts();
  const completionsQuery = useMyCompletions();
  const profileQuery = useMemberProfile();
  const createWorkout = useCreateWorkout();
  const updateWorkout = useUpdateWorkout();
  const deleteWorkout = useDeleteWorkout();

  const isAdmin = profileQuery.data?.isAdmin ?? false;
  const workouts = workoutsQuery.data ?? [];
  const completions = completionsQuery.data ?? [];

  const [category, setCategory] = useState<string>(ALL);
  const [editor, setEditor] = useState<EditorState>({ mode: "closed" });
  const [pendingDelete, setPendingDelete] = useState<Workout | null>(null);
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const categories = useMemo(() => {
    const present = new Set(
      workouts.map((workout) => workout.category).filter(Boolean),
    );
    const ordered = CATEGORY_OPTIONS.filter((option) => present.has(option));
    const extras = [...present].filter(
      (value) => !(CATEGORY_OPTIONS as readonly string[]).includes(value),
    );
    return [ALL, ...ordered, ...extras];
  }, [workouts]);

  const visible =
    category === ALL
      ? workouts
      : workouts.filter((workout) => workout.category === category);

  function openCreate() {
    setFormError(undefined);
    setEditor({ mode: "create" });
  }

  function openEdit(workout: Workout) {
    setFormError(undefined);
    setEditor({ mode: "edit", workout });
  }

  function closeEditor() {
    setEditor({ mode: "closed" });
    setFormError(undefined);
  }

  function handleSubmit(input: WorkoutInput) {
    setFormError(undefined);
    if (editor.mode === "edit") {
      updateWorkout.mutate(
        { id: editor.workout.id, input },
        {
          onSuccess: closeEditor,
          onError: () =>
            setFormError("Could not save the workout. Please try again."),
        },
      );
      return;
    }
    createWorkout.mutate(input, {
      onSuccess: closeEditor,
      onError: () =>
        setFormError("Could not create the workout. Please try again."),
    });
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    deleteWorkout.mutate(pendingDelete.id, {
      onSuccess: () => setPendingDelete(null),
    });
  }

  const isSaving = createWorkout.isPending || updateWorkout.isPending;

  return (
    <div data-ocid="workouts.page" className="space-y-6 md:space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow>Training library</Eyebrow>
          <SectionTitle slash="Library">Training</SectionTitle>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Coach-built sessions for every level. Open a workout to see the
            movements, cues and how to log it.
          </p>
        </div>
        {isAdmin ? (
          <UnbreakableButton
            data-ocid="workouts.open_modal_button"
            onClick={openCreate}
            className="self-start md:self-auto"
          >
            <Plus aria-hidden="true" />
            New workout
          </UnbreakableButton>
        ) : null}
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-8">
        <section className="min-w-0 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((option) => {
              const active = option === category;
              return (
                <button
                  key={option}
                  type="button"
                  data-ocid={`workouts.filter.${option.toLowerCase().replace(/\s+/g, "_")}_tab`}
                  aria-pressed={active}
                  onClick={() => setCategory(option)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] transition-smooth",
                    active
                      ? "border-primary/50 bg-primary/15 text-primary"
                      : "border-border bg-transparent text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {workoutsQuery.isLoading ? (
            <Panel className="p-6">
              <LoadingState label="Loading the library" />
            </Panel>
          ) : workoutsQuery.isError ? (
            <ErrorState
              title="The library didn't load"
              description="We couldn't reach the training library. Try again in a moment."
              onRetry={() => void workoutsQuery.refetch()}
            />
          ) : visible.length === 0 ? (
            <EmptyState
              icon={<Dumbbell className="size-5" aria-hidden="true" />}
              title={workouts.length === 0 ? "No workouts yet" : "Nothing here"}
              description={
                workouts.length === 0
                  ? isAdmin
                    ? "Add the first session to start building the library."
                    : "Your coach hasn't published any sessions yet. Check back soon."
                  : "No sessions in this category. Try another filter."
              }
              action={
                workouts.length === 0 && isAdmin ? (
                  <UnbreakableButton
                    data-ocid="workouts.empty_state_button"
                    onClick={openCreate}
                  >
                    <Plus aria-hidden="true" />
                    New workout
                  </UnbreakableButton>
                ) : undefined
              }
            />
          ) : (
            <div
              data-ocid="workouts.list"
              className="grid gap-4 sm:grid-cols-2"
            >
              {visible.map((workout, index) => (
                <WorkoutCard
                  key={workout.id.toString()}
                  workout={workout}
                  index={index}
                  isAdmin={isAdmin}
                  onEdit={openEdit}
                  onDelete={setPendingDelete}
                />
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <Panel className="p-5">
            <Eyebrow>At a glance</Eyebrow>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-md border border-border bg-muted/30 px-3 py-3">
                <p className="font-display text-2xl font-bold text-foreground">
                  {workouts.length.toString().padStart(2, "0")}
                </p>
                <p className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-muted-foreground">
                  Sessions
                </p>
              </div>
              <div className="rounded-md border border-border bg-muted/30 px-3 py-3">
                <p className="font-display text-2xl font-bold text-primary">
                  {completions.length.toString().padStart(2, "0")}
                </p>
                <p className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-muted-foreground">
                  Completed
                </p>
              </div>
            </div>
            {isAdmin ? (
              <div className="mt-3">
                <Tag tone="coach">Coach access</Tag>
              </div>
            ) : null}
          </Panel>

          {completionsQuery.isLoading ? (
            <Panel className="p-6">
              <LoadingState label="Loading your log" />
            </Panel>
          ) : completionsQuery.isError ? (
            <ErrorState
              title="History unavailable"
              description="We couldn't load your completed sessions."
              onRetry={() => void completionsQuery.refetch()}
            />
          ) : (
            <CompletionHistory completions={completions} workouts={workouts} />
          )}
        </aside>
      </div>

      <Dialog
        open={editor.mode !== "closed"}
        onOpenChange={(open) => {
          if (!open) closeEditor();
        }}
      >
        <DialogContent className="max-h-[90dvh] overflow-y-auto border-border bg-card sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold uppercase tracking-tight">
              {editor.mode === "edit" ? "Edit workout" : "New workout"}
            </DialogTitle>
            <DialogDescription>
              {editor.mode === "edit"
                ? "Update the session details and movements."
                : "Add a session to the member training library."}
            </DialogDescription>
          </DialogHeader>
          {editor.mode !== "closed" ? (
            <WorkoutForm
              key={
                editor.mode === "edit" ? editor.workout.id.toString() : "new"
              }
              initial={editor.mode === "edit" ? editor.workout : null}
              submitLabel={editor.mode === "edit" ? "Save changes" : "Create"}
              isPending={isSaving}
              errorMessage={formError}
              onSubmit={handleSubmit}
              onCancel={closeEditor}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <DialogContent className="border-border bg-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold uppercase tracking-tight">
              Delete workout
            </DialogTitle>
            <DialogDescription>
              {pendingDelete
                ? `"${pendingDelete.title}" will be removed from the library. This can't be undone.`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <UnbreakableButton
              variant="secondary"
              data-ocid="workouts.delete.cancel_button"
              onClick={() => setPendingDelete(null)}
            >
              Cancel
            </UnbreakableButton>
            <UnbreakableButton
              variant="destructive"
              data-ocid="workouts.delete.confirm_button"
              onClick={confirmDelete}
              disabled={deleteWorkout.isPending}
            >
              <Trash2 aria-hidden="true" />
              {deleteWorkout.isPending ? "Deleting…" : "Delete"}
            </UnbreakableButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
