import { SignInButton } from "@/components/InternetIdentity";
import { BrandLockup } from "@/components/layout/BrandLockup";
import { Eyebrow, Tag } from "@/components/layout/Panel";
import { UnbreakableButton } from "@/components/layout/UnbreakableButton";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { Download, Lock, Share, ShieldCheck, SquarePlus } from "lucide-react";

const pillars = [
  {
    label: "Coached blocks",
    copy: "Strength, conditioning and skill sessions programmed by the Unbreakable coaching team.",
  },
  {
    label: "The crew",
    copy: "One group chat for the whole gym — session times, capped blocks and call-outs.",
  },
  {
    label: "Invite only",
    copy: "Access is granted by a coach. No public sign-ups, no noise.",
  },
];

/** Branded signed-out welcome. Single sign-in action, zero member content. */
export function WelcomeScreen() {
  const { canInstall, needsIosGuide, install } = useInstallPrompt();

  return (
    <div className="relative flex min-h-dvh flex-col bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-texture opacity-40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_at_top,oklch(var(--primary)/0.18),transparent_65%)]"
      />

      <header className="relative z-10 flex items-center justify-between px-5 pb-5 pt-[calc(1.25rem+env(safe-area-inset-top))] md:px-10">
        <BrandLockup />
        <Tag tone="online">
          <span
            aria-hidden="true"
            className="size-1.5 animate-pulse-ring rounded-full bg-success"
          />
          Online
        </Tag>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-5 py-10 md:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="animate-fade-up">
            <Eyebrow className="text-primary">Invite-only community</Eyebrow>
            <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Train like it
              <br />
              <span className="text-gradient-primary">can&apos;t break</span>
              <br />
              you.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              The member home of Unbreakable Fitness AU. Coached programming,
              the crew chat and your training library — behind one door, opened
              by invitation.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <SignInButton className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-gradient-primary px-7 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground shadow-subtle transition-smooth hover:-translate-y-px hover:shadow-primary-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-60" />
              {canInstall ? (
                <UnbreakableButton
                  variant="secondary"
                  size="lg"
                  data-ocid="welcome.install_button"
                  onClick={() => void install()}
                >
                  <Download aria-hidden="true" />
                  Add to Home Screen
                </UnbreakableButton>
              ) : null}
            </div>

            {needsIosGuide ? (
              <div
                data-ocid="welcome.ios_install_guide"
                className="mt-6 max-w-md rounded-lg border border-border bg-card/70 p-4"
              >
                <p className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-primary">
                  Add to Home Screen on iPhone
                </p>
                <ol className="mt-3 space-y-2.5">
                  <li className="flex items-start gap-2.5 text-xs leading-relaxed text-muted-foreground">
                    <Share
                      className="mt-0.5 size-3.5 shrink-0 text-foreground"
                      aria-hidden="true"
                    />
                    <span>
                      Tap <span className="text-foreground">Share</span> in
                      Safari&apos;s toolbar.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs leading-relaxed text-muted-foreground">
                    <SquarePlus
                      className="mt-0.5 size-3.5 shrink-0 text-foreground"
                      aria-hidden="true"
                    />
                    <span>
                      Choose{" "}
                      <span className="text-foreground">
                        Add to Home Screen
                      </span>
                      , then tap <span className="text-foreground">Add</span>.
                    </span>
                  </li>
                </ol>
              </div>
            ) : null}

            <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="size-3.5" aria-hidden="true" />
              Need an invite? Ask a member or coach.
            </p>
          </div>

          <div className="animate-fade-up rounded-lg border border-border bg-card/80 p-6 shadow-elevated backdrop-blur-sm [animation-delay:120ms]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
              <Eyebrow className="text-foreground">Access gated</Eyebrow>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Every member is invited by email. Sign in with the Internet
              Identity you used to accept your invite and the door opens
              automatically.
            </p>
            <ul className="mt-6 space-y-4">
              {pillars.map((pillar) => (
                <li key={pillar.label} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                  />
                  <div>
                    <p className="font-mono text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-foreground">
                      {pillar.label}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {pillar.copy}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-border px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 md:px-10">
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-muted-foreground">
          Unbreakable Fitness AU — Invite only
        </p>
      </footer>
    </div>
  );
}
