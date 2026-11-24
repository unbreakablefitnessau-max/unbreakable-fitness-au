import { MemberAvatar } from "@/components/layout/MemberAvatar";
import { Tag } from "@/components/layout/Panel";
import type { Message } from "@/hooks/useQueries";
import { formatTime, timestampToDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";

export interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  canDelete: boolean;
  isDeleting: boolean;
  onDelete: (id: bigint) => void;
  index: number;
}

/** One chat message: avatar, sender, timestamp and body, with delete affordance. */
export function MessageBubble({
  message,
  isOwn,
  canDelete,
  isDeleting,
  onDelete,
  index,
}: MessageBubbleProps) {
  const sentAt = timestampToDate(message.createdAt);

  return (
    <li
      data-ocid={`chat.item.${index}`}
      className={cn(
        "group flex gap-3 rounded-lg px-2 py-2 transition-colors",
        isOwn ? "bg-primary/[0.04]" : "hover:bg-secondary/40",
      )}
    >
      <MemberAvatar name={message.senderName} size="md" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="truncate font-display text-sm font-semibold text-foreground">
            {message.senderName}
          </span>
          {isOwn ? <Tag tone="primary">You</Tag> : null}
          <time
            dateTime={sentAt ? sentAt.toISOString() : undefined}
            className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground"
          >
            {formatTime(message.createdAt)}
          </time>
          {canDelete ? (
            <button
              type="button"
              onClick={() => onDelete(message.id)}
              disabled={isDeleting}
              aria-label={`Delete message from ${message.senderName}`}
              data-ocid={`chat.delete_button.${index}`}
              className="ml-auto inline-flex size-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-smooth hover:bg-destructive/10 hover:text-destructive focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100 disabled:opacity-40"
            >
              <Trash2 className="size-3.5" aria-hidden="true" />
            </button>
          ) : null}
        </div>
        <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground/90">
          {message.body}
        </p>
      </div>
    </li>
  );
}
