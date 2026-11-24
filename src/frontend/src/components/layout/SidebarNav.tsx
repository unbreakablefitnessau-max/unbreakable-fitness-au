import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  Dumbbell,
  LayoutDashboard,
  MessagesSquare,
  ShieldCheck,
} from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  adminOnly?: boolean;
}

export const navItems: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/workouts", label: "Training", icon: Dumbbell },
  { to: "/chat", label: "Group Chat", icon: MessagesSquare },
  { to: "/admin", label: "Admin", icon: ShieldCheck, adminOnly: true },
];

/** Mono nav rows with a molten-red active pill on the left edge. */
export function SidebarNav({
  isAdmin,
  onNavigate,
  className,
}: {
  isAdmin: boolean;
  onNavigate?: () => void;
  className?: string;
}) {
  const visible = navItems.filter((item) => !item.adminOnly || isAdmin);
  return (
    <nav aria-label="Primary" className={cn("flex flex-col gap-1", className)}>
      {visible.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            activeOptions={{ exact: item.to === "/" }}
            data-ocid={`nav.${item.label.toLowerCase().replace(/\s+/g, "_")}_link`}
            className="group relative flex items-center gap-3 rounded-md px-3 py-2.5 font-mono text-[0.72rem] font-medium uppercase tracking-[0.16em] text-muted-foreground transition-smooth hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            activeProps={{
              className:
                "bg-sidebar-accent text-foreground before:absolute before:left-0 before:top-1/2 before:h-5 before:w-[3px] before:-translate-y-1/2 before:rounded-full before:bg-primary",
            }}
          >
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
