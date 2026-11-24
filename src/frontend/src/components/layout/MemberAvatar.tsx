import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

const avatarTones = [
  "bg-primary/20 text-primary border-primary/30",
  "bg-accent/20 text-accent border-accent/30",
  "bg-success/20 text-success border-success/30",
  "bg-secondary text-foreground border-border",
];

function toneFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash + name.charCodeAt(i)) % avatarTones.length;
  }
  return avatarTones[hash];
}

/** Circular identity chip with deterministic initials and tone. */
export function MemberAvatar({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "size-7 text-[0.6rem]",
    md: "size-9 text-xs",
    lg: "size-12 text-sm",
  };
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border font-mono font-semibold uppercase tracking-wide",
        sizes[size],
        toneFor(name),
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
