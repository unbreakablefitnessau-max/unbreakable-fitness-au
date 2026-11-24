import { cn } from "@/lib/utils";
import type * as React from "react";

/** Raised iron panel: bg-card, 1px border, restrained shadow, 8px radius. */
export function Panel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card shadow-subtle",
        className,
      )}
      {...props}
    />
  );
}

/** Mono uppercase micro-label used above section titles and metrics. */
export function Eyebrow({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "font-mono text-[0.68rem] font-medium uppercase tracking-[0.22em] text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

/** Section heading with the `//` slash motif from the brand lockup. */
export function SectionTitle({
  children,
  slash,
  className,
}: {
  children: React.ReactNode;
  slash?: string;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "font-display text-xl font-bold uppercase tracking-tight text-foreground md:text-2xl",
        className,
      )}
    >
      {children}
      {slash ? (
        <span className="ml-2 font-mono text-sm font-medium tracking-[0.2em] text-primary">
          {"// "}
          {slash}
        </span>
      ) : null}
    </h2>
  );
}

/** Full-pill mono badge. Amber for coach, green for online, muted for roles. */
export function Tag({
  tone = "muted",
  className,
  ...props
}: React.ComponentProps<"span"> & {
  tone?: "muted" | "coach" | "online" | "primary" | "outline";
}) {
  const tones: Record<string, string> = {
    muted: "border-border bg-muted text-muted-foreground",
    coach: "border-accent/40 bg-accent/15 text-accent",
    online: "border-success/40 bg-success/15 text-success",
    primary: "border-primary/40 bg-primary/15 text-primary",
    outline: "border-border bg-transparent text-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em]",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
