import { UnbreakableButton } from "@/components/layout/UnbreakableButton";
import { Send } from "lucide-react";
import { type FormEvent, useState } from "react";

export interface MessageComposerProps {
  onSend: (body: string) => void;
  isPending: boolean;
  isError: boolean;
  errorMessage?: string | null;
}

const MAX_LENGTH = 2000;

/** Sticky composer: owns its draft, clears on submit, restores on failure. */
export function MessageComposer({
  onSend,
  isPending,
  isError,
  errorMessage,
}: MessageComposerProps) {
  const [draft, setDraft] = useState("");
  const trimmed = draft.trim();
  const canSend = trimmed.length > 0 && !isPending;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSend) return;
    const captured = trimmed;
    setDraft("");
    onSend(captured);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-border bg-card/95 p-3 backdrop-blur md:p-4"
    >
      <div className="flex items-end gap-2">
        <label htmlFor="chat-composer" className="sr-only">
          Write a message
        </label>
        <textarea
          id="chat-composer"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }
          }}
          rows={1}
          maxLength={MAX_LENGTH}
          placeholder="Message the crew…"
          data-ocid="chat.textarea"
          className="max-h-40 min-h-11 flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <UnbreakableButton
          type="submit"
          size="md"
          disabled={!canSend}
          data-ocid="chat.submit_button"
          className="h-11 shrink-0"
        >
          <Send aria-hidden="true" />
          <span className="hidden sm:inline">Send</span>
        </UnbreakableButton>
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-3">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted-foreground">
          Enter to send · Shift + Enter for a new line
        </p>
        {isError ? (
          <p
            role="alert"
            data-ocid="chat.error_state"
            className="text-xs text-destructive"
          >
            {errorMessage ?? "Message failed to send. Try again."}
          </p>
        ) : null}
      </div>
    </form>
  );
}
