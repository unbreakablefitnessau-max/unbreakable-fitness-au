import { Panel } from "@/components/layout/Panel";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Dumbbell, MessagesSquare } from "lucide-react";

const quickLinks = [
  {
    to: "/workouts",
    label: "Training library",
    description: "Every session, programmed by your coaches.",
    icon: Dumbbell,
    ocid: "home.quick.workouts_link",
  },
  {
    to: "/chat",
    label: "Group chat",
    description: "Check in, share wins, keep each other honest.",
    icon: MessagesSquare,
    ocid: "home.quick.chat_link",
  },
] as const;

/** Two-up shortcuts into the core member areas. */
export function QuickLinks() {
  return (
    <nav aria-label="Quick links" className="grid gap-3 sm:grid-cols-2">
      {quickLinks.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.to}
            to={link.to}
            data-ocid={link.ocid}
            className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Panel className="flex h-full items-start gap-3 p-4 transition-smooth group-hover:border-primary/50 group-hover:shadow-elevated">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-secondary text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>{" "}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-display text-sm font-semibold uppercase tracking-tight text-foreground">
                    {link.label}
                  </p>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-muted-foreground transition-smooth group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {link.description}
                </p>
              </div>
            </Panel>
          </Link>
        );
      })}
    </nav>
  );
}
