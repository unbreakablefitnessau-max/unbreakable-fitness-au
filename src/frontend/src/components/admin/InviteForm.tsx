import { Eyebrow, Panel } from "@/components/layout/Panel";
import { UnbreakableButton } from "@/components/layout/UnbreakableButton";
import { useInviteMember } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { CheckCircle2, MailPlus, TriangleAlert } from "lucide-react";
import { useId, useState } from "react";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Admin form: invite a member by email address. */
export function InviteForm() {
  const inputId = useId();
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const invite = useInviteMember();

  const trimmed = email.trim();
  const isValid = EMAIL_PATTERN.test(trimmed);
  const showError = touched && trimmed.length > 0 && !isValid;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);
    if (!isValid) return;

    const captured = trimmed;
    setEmail("");
    setTouched(false);
    invite.mutate(captured, {
      onError: () => {
        setEmail((current) => (current === "" ? captured : current));
      },
    });
  };

  return (
    <Panel className="p-5 md:p-6">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
          <MailPlus className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <Eyebrow>Grant access</Eyebrow>
          <h3 className="font-display text-lg font-bold uppercase tracking-tight text-foreground">
            Invite a member
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter the email they signed up with. They join the crew the moment
            they sign in.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-3" noValidate>
        <div className="space-y-1.5">
          <label
            htmlFor={inputId}
            className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-muted-foreground"
          >
            Member email
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id={inputId}
              data-ocid="admin.invite.input"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="member@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onBlur={() => setTouched(true)}
              aria-invalid={showError}
              aria-describedby={showError ? `${inputId}-error` : undefined}
              className={cn(
                "h-11 w-full min-w-0 rounded-lg border bg-muted/40 px-3 font-body text-sm text-foreground outline-none transition-smooth placeholder:text-muted-foreground/70 focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring/40",
                showError ? "border-destructive/60" : "border-input",
              )}
            />
            <UnbreakableButton
              type="submit"
              size="lg"
              data-ocid="admin.invite.submit_button"
              disabled={invite.isPending || trimmed.length === 0}
              className="shrink-0"
            >
              {invite.isPending ? "Sending…" : "Send invite"}
            </UnbreakableButton>
          </div>
          {showError ? (
            <p
              id={`${inputId}-error`}
              data-ocid="admin.invite.error_state"
              className="flex items-center gap-1.5 text-xs text-destructive"
            >
              <TriangleAlert className="size-3.5" aria-hidden="true" />
              Enter a valid email address.
            </p>
          ) : null}
        </div>

        {invite.isError ? (
          <p
            data-ocid="admin.invite.error_state"
            className="flex items-center gap-1.5 rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 text-xs text-destructive"
          >
            <TriangleAlert className="size-3.5 shrink-0" aria-hidden="true" />
            {invite.error instanceof Error
              ? invite.error.message
              : "That invite could not be sent. Try again."}
          </p>
        ) : null}

        {invite.isSuccess ? (
          <p
            data-ocid="admin.invite.success_state"
            className="flex items-center gap-1.5 rounded-lg border border-success/40 bg-success/10 px-3 py-2 text-xs text-success"
          >
            <CheckCircle2 className="size-3.5 shrink-0" aria-hidden="true" />
            Invite sent to {invite.data.email}.
          </p>
        ) : null}
      </form>
    </Panel>
  );
}
