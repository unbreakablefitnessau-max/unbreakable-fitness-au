import type { Message } from "@/backend";
import { MemberAvatar } from "@/components/layout/MemberAvatar";
import { Eyebrow, Panel, SectionTitle } from "@/components/layout/Panel";
import { EmptyState, ErrorState } from "@/components/layout/States";
import { formatTime, relativeDayLabel } from "@/lib/format";
import { Link } from "@tanstack/react-router";
import { ArrowRight, MessagesSquare } from "lucide-react";

/** Latest messages from the crew, trimmed to a scannable preview. */
export function ChatActivity({
  messages,
  isLoading,
  isError,
  onRetry,
}: {
  messages: Message[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}) {
  const latest = [...messages]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 4);

  return (
    <section aria-labelledby="chat-activity-heading" className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <Eyebrow>The crew</Eyebrow>
          <SectionTitle slash="Live" className="text-lg md:text-xl">
            <span id="chat-activity-heading">Group chat</span>
          </SectionTitle>
        </div>
        <Link
          to="/chat"
          data-ocid="home.chat.open_link"
          className="shrink-0 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground underline-offset-4 transition-smooth hover:text-primary hover:underline"
        >
          Open chat
        </Link>
      </div>

      {isLoading ? (
        <Panel className="divide-y divide-border">
          {Array.from({ length: 3 }, (_, i) => `chat-skeleton-${i}`).map(
            (id) => (
              <div key={id} className="flex items-start gap-3 p-4">
                <div className="size-9 animate-pulse rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-2.5 w-1/3 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ),
          )}
        </Panel>
      ) : isError ? (
        <ErrorState
          title="Chat is out of reach"
          description="We couldn't pull the latest messages. Try again."
          onRetry={onRetry}
        />
      ) : latest.length === 0 ? (
        <EmptyState
          icon={<MessagesSquare className="size-5" aria-hidden="true" />}
          title="Quiet in here"
          description="No messages yet. Be the first to check in with the crew."
          action={
            <Link
              to="/chat"
              data-ocid="home.chat.empty_button"
              className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-primary underline-offset-4 hover:underline"
            >
              Start the conversation
            </Link>
          }
        />
      ) : (
        <Panel className="divide-y divide-border">
          {latest.map((message, index) => (
            <div
              key={message.id.toString()}
              data-ocid={`home.chat.item.${index + 1}`}
              className="flex items-start gap-3 p-4"
            >
              <MemberAvatar name={message.senderName} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate font-display text-sm font-semibold text-foreground">
                    {message.senderName}
                  </p>
                  <span className="shrink-0 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-muted-foreground">
                    {relativeDayLabel(message.createdAt)} ·{" "}
                    {formatTime(message.createdAt)}
                  </span>
                </div>
                <p className="mt-0.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {message.body}
                </p>
              </div>
            </div>
          ))}
          <Link
            to="/chat"
            data-ocid="home.chat.view_all_link"
            className="group flex items-center justify-between gap-2 px-4 py-3 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-muted-foreground transition-smooth hover:bg-secondary/60 hover:text-foreground"
          >
            View the full thread
            <ArrowRight
              className="size-3.5 transition-smooth group-hover:translate-x-0.5 group-hover:text-primary"
              aria-hidden="true"
            />
          </Link>
        </Panel>
      )}
    </section>
  );
}
