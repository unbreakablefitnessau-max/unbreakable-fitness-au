import { BrandLockup } from "@/components/layout/BrandLockup";
import { Eyebrow, Panel, Tag } from "@/components/layout/Panel";
import { UnbreakableButton } from "@/components/layout/UnbreakableButton";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { Clock, LogOut, Mail } from "lucide-react";

/** Signed-in but not yet invited: clear pending state with a contact path. */
export function AccessPendingScreen() {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  return (
    <div className="relative flex min-h-dvh flex-col bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-texture opacity-30"
      />
      <header className="relative z-10 flex items-center justify-between px-5 py-5 md:px-10">
        <BrandLockup />
        <UnbreakableButton
          variant="ghost"
          size="sm"
          data-ocid="auth.signout_button"
          onClick={() => {
            void queryClient.cancelQueries();
            queryClient.clear();
            clear();
          }}
        >
          <LogOut aria-hidden="true" />
          Sign out
        </UnbreakableButton>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-5 py-10">
        <Panel className="animate-fade-up p-7 md:p-9">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-full border border-accent/40 bg-accent/15 text-accent">
              <Clock className="size-5" aria-hidden="true" />
            </span>
            <div>
              <Eyebrow>Access pending</Eyebrow>
              <Tag tone="coach" className="mt-1">
                Awaiting coach approval
              </Tag>
            </div>
          </div>

          <h1 className="mt-6 font-display text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
            You&apos;re on the list
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Your sign-in worked, but this identity hasn&apos;t been matched to a
            member invite yet. A coach needs to approve you before the training
            library and crew chat unlock.
          </p>

          <div className="mt-6 rounded-md border border-border bg-muted/40 p-4">
            <p className="flex items-center gap-2 font-mono text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-foreground">
              <Mail className="size-3.5" aria-hidden="true" />
              Contact the team
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Message your coach or email{" "}
              <a
                href="mailto:members@unbreakablefitness.au"
                className="font-medium text-foreground underline-offset-4 hover:text-primary hover:underline"
              >
                members@unbreakablefitness.au
              </a>{" "}
              with the email address you were invited on. We usually approve
              within one business day.
            </p>
          </div>

          <p className="mt-5 text-xs text-muted-foreground">
            Already approved? Sign out and back in so we can re-check your
            access.
          </p>
        </Panel>
      </main>

      <footer className="relative z-10 border-t border-border px-5 py-4 md:px-10">
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-muted-foreground">
          Unbreakable Fitness AU — Invite only
        </p>
      </footer>
    </div>
  );
}
