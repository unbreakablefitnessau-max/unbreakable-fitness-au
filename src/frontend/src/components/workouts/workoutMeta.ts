import type { Workout } from "@/backend";

export const CATEGORY_OPTIONS = [
  "Strength",
  "Conditioning",
  "Hypertrophy",
  "Mobility",
  "Endurance",
  "Power",
] as const;

export const DIFFICULTY_OPTIONS = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Elite",
] as const;

export type DifficultyTone = "muted" | "online" | "coach" | "primary";

/** Difficulty → badge tone. Beginner reads calm, Elite reads molten. */
export function difficultyTone(difficulty: string): DifficultyTone {
  switch (difficulty.trim().toLowerCase()) {
    case "beginner":
      return "online";
    case "intermediate":
      return "muted";
    case "advanced":
      return "coach";
    case "elite":
      return "primary";
    default:
      return "muted";
  }
}

/** Two-letter category monogram used on the card's iron plate. */
export function categoryMonogram(category: string): string {
  const trimmed = category.trim();
  if (!trimmed) return "??";
  return trimmed.slice(0, 2).toUpperCase();
}

/** "45 min" style duration label. */
export function durationLabel(minutes: bigint): string {
  return `${minutes.toString()} min`;
}

/** Compact exercise summary, e.g. "5 movements · 3 sets × 8 reps". */
export function exerciseSummary(workout: Workout): string {
  const count = workout.exercises.length;
  if (count === 0) return "No movements listed";
  return `${count} ${count === 1 ? "movement" : "movements"}`;
}
