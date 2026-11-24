import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

/** UNBREAKABLE // FITNESS AU lockup. */
export function BrandLockup({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      to="/"
      data-ocid="brand.link"
      className={cn("group flex items-center gap-3", className)}
    >
      <span
        aria-hidden="true"
        className="flex size-9 items-center justify-center rounded-md bg-gradient-primary font-display text-lg font-bold text-primary-foreground shadow-primary-glow"
      >
        U
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-base font-bold uppercase tracking-[0.08em] text-foreground">
          Unbreakable
        </span>
        <span className="mt-1 font-mono text-[0.6rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">
          {"// Fitness AU"}
        </span>
      </span>
      {compact ? null : (
        <span className="sr-only">Unbreakable Fitness AU home</span>
      )}
    </Link>
  );
}
