import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";
import { BrandLockup } from "./BrandLockup";
import { ProfileMenu } from "./ProfileMenu";
import { SidebarNav } from "./SidebarNav";
import { UnbreakableButton } from "./UnbreakableButton";

export interface LayoutProps {
  displayName: string;
  isAdmin: boolean;
  children: React.ReactNode;
}

/** App shell: sticky header, desktop sidebar, mobile sheet nav, sparse footer. */
export function Layout({ displayName, isAdmin, children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const year = new Date().getFullYear();

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 pt-[env(safe-area-inset-top)] backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="flex h-16 items-center justify-between gap-3 px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <UnbreakableButton
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open navigation"
                  data-ocid="nav.open_modal_button"
                >
                  <Menu aria-hidden="true" />
                </UnbreakableButton>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-72 border-r border-border bg-sidebar p-0"
              >
                <SheetHeader className="border-b border-sidebar-border px-5 py-4">
                  <SheetTitle className="sr-only">Navigation</SheetTitle>
                  <BrandLockup />
                </SheetHeader>
                <div className="px-3 py-4">
                  <SidebarNav
                    isAdmin={isAdmin}
                    onNavigate={() => setMobileOpen(false)}
                  />
                </div>
              </SheetContent>
            </Sheet>
            <BrandLockup className="hidden sm:flex" />
            <BrandLockup className="sm:hidden" compact />
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 md:flex">
              <span
                aria-hidden="true"
                className="size-2 animate-pulse-ring rounded-full bg-success"
              />
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-muted-foreground">
                Online
              </span>
            </span>
            <ProfileMenu displayName={displayName} isAdmin={isAdmin} />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden w-60 shrink-0 border-r border-sidebar-border bg-sidebar md:block">
          <div className="sticky top-[calc(4rem+env(safe-area-inset-top))] flex flex-col gap-6 px-3 py-6">
            <p className="px-3 font-mono text-[0.6rem] uppercase tracking-[0.28em] text-muted-foreground">
              Member Area
            </p>
            <SidebarNav isAdmin={isAdmin} />
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:px-8 md:py-8">
            {children}
          </div>
        </main>
      </div>

      <footer className="border-t border-border bg-muted/40 pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:px-8">
          <p className="font-mono uppercase tracking-[0.18em]">
            Unbreakable Fitness AU — Invite only
          </p>
          <p>
            © {year}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noreferrer"
              className="text-foreground underline-offset-4 hover:text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
