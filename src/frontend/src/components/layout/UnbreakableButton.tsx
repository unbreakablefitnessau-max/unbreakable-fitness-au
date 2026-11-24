import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

/**
 * Unbreakable button: molten-red gradient primary, bordered ghost secondary.
 * 8px radius, uppercase mono label, hover lift with primary glow.
 */
const unbreakableButton = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-mono text-xs font-semibold uppercase tracking-[0.14em] transition-smooth outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-primary text-primary-foreground shadow-subtle hover:shadow-primary-glow hover:-translate-y-px active:translate-y-0",
        secondary:
          "border border-border bg-transparent text-foreground hover:border-primary/60 hover:bg-secondary",
        ghost: "text-muted-foreground hover:bg-secondary hover:text-foreground",
        destructive:
          "border border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20",
      },
      size: {
        sm: "h-8 px-3",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-[0.8rem]",
        icon: "size-9",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface UnbreakableButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof unbreakableButton> {}

export function UnbreakableButton({
  className,
  variant,
  size,
  type = "button",
  ...props
}: UnbreakableButtonProps) {
  return (
    <button
      type={type}
      className={cn(unbreakableButton({ variant, size }), className)}
      {...props}
    />
  );
}

export { unbreakableButton };
