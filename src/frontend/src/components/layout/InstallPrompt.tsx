import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { Download, Share, SquarePlus, X } from "lucide-react";
import { UnbreakableButton } from "./UnbreakableButton";

const iosSteps = [
  {
    icon: Share,
    title: "Tap the Share button",
    copy: "In Safari's toolbar, tap Share — the square with the arrow pointing up.",
  },
  {
    icon: SquarePlus,
    title: "Choose Add to Home Screen",
    copy: "Scroll the share sheet and tap Add to Home Screen.",
  },
  {
    icon: Download,
    title: "Tap Add",
    copy: "Unbreakable opens full screen, straight to your training.",
  },
];

/**
 * Dismissible home-screen install prompt for members. Android and desktop
 * browsers get the native install action; iOS Safari gets Add to Home Screen
 * steps, since it never offers an automatic prompt.
 */
export function InstallPrompt() {
  const { canInstall, needsIosGuide, install, dismiss } = useInstallPrompt();
  if (!canInstall && !needsIosGuide) return null;

  return (
    <div
      data-ocid="install.panel"
      className="rounded-lg border border-border bg-card px-4 py-4 shadow-subtle"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
          <Download className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">
            Add Unbreakable to your home screen
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            {needsIosGuide
              ? "Two taps in Safari and the gym lives on your home screen — full screen, no browser bar."
              : "One tap to the crew — no app store needed."}
          </p>
        </div>
        {canInstall ? (
          <UnbreakableButton
            size="sm"
            data-ocid="install.primary_button"
            onClick={() => void install()}
          >
            Install
          </UnbreakableButton>
        ) : null}
        <UnbreakableButton
          variant="ghost"
          size="icon"
          aria-label="Dismiss install prompt"
          data-ocid="install.close_button"
          onClick={dismiss}
        >
          <X aria-hidden="true" />
        </UnbreakableButton>
      </div>

      {needsIosGuide ? (
        <ol className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-3">
          {iosSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <li key={step.title} className="flex gap-2.5">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-secondary text-primary">
                  <Icon className="size-3.5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Step {index + 1}
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-foreground">
                    {step.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {step.copy}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      ) : null}
    </div>
  );
}
