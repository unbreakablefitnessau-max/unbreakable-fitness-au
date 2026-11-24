import type { Exercise, Workout, WorkoutInput } from "@/backend";
import { Eyebrow } from "@/components/layout/Panel";
import { UnbreakableButton } from "@/components/layout/UnbreakableButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { type FormEvent, useState } from "react";
import { CATEGORY_OPTIONS, DIFFICULTY_OPTIONS } from "./workoutMeta";

interface ExerciseDraft {
  key: string;
  name: string;
  sets: string;
  reps: string;
  notes: string;
}

interface WorkoutDraft {
  title: string;
  category: string;
  difficulty: string;
  durationMinutes: string;
  description: string;
  coachingNotes: string;
  exercises: ExerciseDraft[];
}

let draftSeq = 0;
function nextKey(): string {
  draftSeq += 1;
  return `ex-${draftSeq}`;
}

function emptyExercise(): ExerciseDraft {
  return { key: nextKey(), name: "", sets: "", reps: "", notes: "" };
}

function toDraft(workout: Workout | null): WorkoutDraft {
  if (!workout) {
    return {
      title: "",
      category: CATEGORY_OPTIONS[0],
      difficulty: DIFFICULTY_OPTIONS[1],
      durationMinutes: "45",
      description: "",
      coachingNotes: "",
      exercises: [emptyExercise()],
    };
  }
  return {
    title: workout.title,
    category: workout.category || CATEGORY_OPTIONS[0],
    difficulty: workout.difficulty || DIFFICULTY_OPTIONS[1],
    durationMinutes: workout.durationMinutes.toString(),
    description: workout.description,
    coachingNotes: workout.coachingNotes,
    exercises:
      workout.exercises.length > 0
        ? workout.exercises.map((exercise) => ({
            key: nextKey(),
            name: exercise.name,
            sets: exercise.sets?.toString() ?? "",
            reps: exercise.reps?.toString() ?? "",
            notes: exercise.notes ?? "",
          }))
        : [emptyExercise()],
  };
}

function parseOptionalNat(value: string): bigint | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const parsed = Number.parseInt(trimmed, 10);
  if (Number.isNaN(parsed) || parsed < 0) return undefined;
  return BigInt(parsed);
}

function buildInput(draft: WorkoutDraft): WorkoutInput {
  const exercises: Exercise[] = draft.exercises
    .filter((exercise) => exercise.name.trim().length > 0)
    .map((exercise) => {
      const sets = parseOptionalNat(exercise.sets);
      const reps = parseOptionalNat(exercise.reps);
      const notes = exercise.notes.trim();
      return {
        name: exercise.name.trim(),
        ...(sets !== undefined ? { sets } : {}),
        ...(reps !== undefined ? { reps } : {}),
        ...(notes ? { notes } : {}),
      };
    });
  const duration = Number.parseInt(draft.durationMinutes, 10);
  return {
    title: draft.title.trim(),
    category: draft.category,
    difficulty: draft.difficulty,
    durationMinutes: BigInt(
      Number.isNaN(duration) || duration < 0 ? 0 : duration,
    ),
    description: draft.description.trim(),
    coachingNotes: draft.coachingNotes.trim(),
    exercises,
  };
}

const fieldClass =
  "border-input bg-background font-body text-sm focus-visible:border-primary";

export function WorkoutForm({
  initial,
  submitLabel,
  isPending,
  errorMessage,
  onSubmit,
  onCancel,
}: {
  initial: Workout | null;
  submitLabel: string;
  isPending: boolean;
  errorMessage?: string;
  onSubmit: (input: WorkoutInput) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<WorkoutDraft>(() => toDraft(initial));
  const [touched, setTouched] = useState(false);

  const titleMissing = draft.title.trim().length === 0;
  const durationInvalid =
    draft.durationMinutes.trim() === "" ||
    Number.isNaN(Number.parseInt(draft.durationMinutes, 10)) ||
    Number.parseInt(draft.durationMinutes, 10) <= 0;
  const invalid = titleMissing || durationInvalid;

  function patch(partial: Partial<WorkoutDraft>) {
    setDraft((current) => ({ ...current, ...partial }));
  }

  function patchExercise(key: string, partial: Partial<ExerciseDraft>) {
    setDraft((current) => ({
      ...current,
      exercises: current.exercises.map((exercise) =>
        exercise.key === key ? { ...exercise, ...partial } : exercise,
      ),
    }));
  }

  function addExercise() {
    setDraft((current) => ({
      ...current,
      exercises: [...current.exercises, emptyExercise()],
    }));
  }

  function removeExercise(key: string) {
    setDraft((current) => ({
      ...current,
      exercises:
        current.exercises.length > 1
          ? current.exercises.filter((exercise) => exercise.key !== key)
          : current.exercises,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);
    if (invalid) return;
    onSubmit(buildInput(draft));
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="workout-title">Title</Label>
          <Input
            id="workout-title"
            data-ocid="workouts.form.title_input"
            value={draft.title}
            onChange={(event) => patch({ title: event.target.value })}
            placeholder="Iron Foundations — Lower Body"
            aria-invalid={touched && titleMissing}
            className={fieldClass}
          />
          {touched && titleMissing ? (
            <p
              data-ocid="workouts.form.title_error"
              className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-destructive"
            >
              A title is required
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="workout-category">Category</Label>
          <Select
            value={draft.category}
            onValueChange={(value) => patch({ category: value })}
          >
            <SelectTrigger
              id="workout-category"
              data-ocid="workouts.form.category_select"
              className="w-full border-input bg-background"
            >
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="workout-difficulty">Difficulty</Label>
          <Select
            value={draft.difficulty}
            onValueChange={(value) => patch({ difficulty: value })}
          >
            <SelectTrigger
              id="workout-difficulty"
              data-ocid="workouts.form.difficulty_select"
              className="w-full border-input bg-background"
            >
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              {DIFFICULTY_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="workout-duration">Duration (minutes)</Label>
          <Input
            id="workout-duration"
            data-ocid="workouts.form.duration_input"
            type="number"
            min={1}
            inputMode="numeric"
            value={draft.durationMinutes}
            onChange={(event) => patch({ durationMinutes: event.target.value })}
            aria-invalid={touched && durationInvalid}
            className={fieldClass}
          />
          {touched && durationInvalid ? (
            <p
              data-ocid="workouts.form.duration_error"
              className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-destructive"
            >
              Enter a duration above zero
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="workout-description">Description</Label>
        <Textarea
          id="workout-description"
          data-ocid="workouts.form.description_textarea"
          value={draft.description}
          onChange={(event) => patch({ description: event.target.value })}
          placeholder="What the session covers and who it suits."
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="workout-coaching">Coaching notes</Label>
        <Textarea
          id="workout-coaching"
          data-ocid="workouts.form.coaching_textarea"
          value={draft.coachingNotes}
          onChange={(event) => patch({ coachingNotes: event.target.value })}
          placeholder="Cues, pacing and intensity targets."
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Eyebrow>Movements</Eyebrow>
          <UnbreakableButton
            variant="ghost"
            size="sm"
            data-ocid="workouts.form.add_exercise_button"
            onClick={addExercise}
          >
            <Plus aria-hidden="true" />
            Add movement
          </UnbreakableButton>
        </div>
        <div className="flex flex-col gap-2">
          {draft.exercises.map((exercise, index) => (
            <div
              key={exercise.key}
              data-ocid={`workouts.form.exercise.${index}`}
              className="grid grid-cols-2 gap-2 rounded-md border border-border bg-muted/30 p-3 sm:grid-cols-[1fr_4.5rem_4.5rem_auto]"
            >
              <Input
                aria-label={`Movement ${index + 1} name`}
                value={exercise.name}
                onChange={(event) =>
                  patchExercise(exercise.key, { name: event.target.value })
                }
                placeholder="Back squat"
                className={`${fieldClass} col-span-2 sm:col-span-1`}
              />
              <Input
                aria-label={`Movement ${index + 1} sets`}
                type="number"
                min={0}
                inputMode="numeric"
                value={exercise.sets}
                onChange={(event) =>
                  patchExercise(exercise.key, { sets: event.target.value })
                }
                placeholder="Sets"
                className={fieldClass}
              />
              <Input
                aria-label={`Movement ${index + 1} reps`}
                type="number"
                min={0}
                inputMode="numeric"
                value={exercise.reps}
                onChange={(event) =>
                  patchExercise(exercise.key, { reps: event.target.value })
                }
                placeholder="Reps"
                className={fieldClass}
              />
              <UnbreakableButton
                variant="ghost"
                size="icon"
                aria-label={`Remove movement ${index + 1}`}
                disabled={draft.exercises.length === 1}
                onClick={() => removeExercise(exercise.key)}
              >
                <X aria-hidden="true" />
              </UnbreakableButton>
            </div>
          ))}
        </div>
      </div>

      {errorMessage ? (
        <p
          role="alert"
          data-ocid="workouts.form.error_state"
          className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {errorMessage}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
        <UnbreakableButton
          variant="secondary"
          data-ocid="workouts.form.cancel_button"
          onClick={onCancel}
          disabled={isPending}
          type="button"
        >
          Cancel
        </UnbreakableButton>
        <UnbreakableButton
          type="submit"
          data-ocid="workouts.form.submit_button"
          disabled={isPending}
        >
          {isPending ? "Saving…" : submitLabel}
        </UnbreakableButton>
      </div>
    </form>
  );
}
