import { MessageBubble } from "@/components/chat/MessageBubble";
import { MessageComposer } from "@/components/chat/MessageComposer";
import { MemberAvatar } from "@/components/layout/MemberAvatar";
import { Eyebrow, Panel, SectionTitle, Tag } from "@/components/layout/Panel";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/layout/States";
import {
  type Message,
  useDeleteMessage,
  useMemberProfile,
  useMessages,
  useSendMessage,
} from "@/hooks/useQueries";
import { dayKey, firstName, relativeDayLabel } from "@/lib/format";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { MessagesSquare } from "lucide-react";
import { useMemo } from "react";

interface DayGroup {
  key: string;
  label: string;
  messages: Message[];
}

function groupByDay(messages: Message[]): DayGroup[] {
  const groups: DayGroup[] = [];
  for (const message of messages) {
    const key = dayKey(message.createdAt);
    const last = groups[groups.length - 1];
    if (last && last.key === key) {
      last.messages.push(message);
    } else {
      groups.push({
        key,
        label: relativeDayLabel(message.createdAt),
        messages: [message],
      });
    }
  }
  return groups;
}

function sendErrorMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error ?? "");
  if (/sign in/i.test(raw)) {
    return "Your session expired. Sign in again to post.";
  }
  if (/invited|member/i.test(raw)) {
    return "Only invited members can post in this room.";
  }
  if (/empty/i.test(raw)) {
    return "Write something before sending.";
  }
  return "Message failed to send. Try again.";
}

export function ChatPage() {
  const { identity } = useInternetIdentity();
  const myPrincipal = identity?.getPrincipal().toText() ?? null;

  const profileQuery = useMemberProfile();
  const messagesQuery = useMessages();
  const sendMessage = useSendMessage();
  const deleteMessage = useDeleteMessage();

  const isAdmin = profileQuery.data?.isAdmin ?? false;
  const messages = messagesQuery.data ?? [];
  const groups = useMemo(() => groupByDay(messages), [messages]);

  const memberCount = useMemo(() => {
    const senders = new Set(messages.map((m) => m.sender.toText()));
    return senders.size;
  }, [messages]);

  // Only the conversation query gates the room; a profile hiccup must not
  // hide a conversation that loaded fine.
  const isLoading = messagesQuery.isLoading;
  const isError = messagesQuery.isError;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Eyebrow>The crew</Eyebrow>
          <SectionTitle slash="Main">Community chat</SectionTitle>
        </div>
        <div className="flex items-center gap-2">
          <Tag tone="online">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-success"
            />
            Live
          </Tag>
          <Tag tone="muted">
            {memberCount} {memberCount === 1 ? "voice" : "voices"}
          </Tag>
        </div>
      </div>

      <Panel className="flex h-[calc(100dvh-16rem)] min-h-[26rem] flex-col overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary">
              <MessagesSquare className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-sm font-semibold uppercase tracking-tight text-foreground">
                Unbreakable Fitness AU
              </p>
              <p className="truncate font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground">
                Members &amp; coaches · one shared room
              </p>
            </div>
          </div>
          {profileQuery.data ? (
            <span className="hidden items-center gap-2 sm:flex">
              <MemberAvatar name={profileQuery.data.displayName} size="sm" />
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">
                {firstName(profileQuery.data.displayName)}
              </span>
            </span>
          ) : null}
        </div>

        <div
          data-ocid="chat.list"
          className="flex-1 overflow-y-auto px-2 py-3 md:px-4"
        >
          {isLoading ? (
            <LoadingState label="Loading the room" />
          ) : isError ? (
            <ErrorState
              title="Chat unavailable"
              description="We couldn't load the conversation. Check your connection and try again."
              onRetry={() => void messagesQuery.refetch()}
            />
          ) : messages.length === 0 ? (
            <EmptyState
              icon={<MessagesSquare className="size-5" aria-hidden="true" />}
              title="No messages yet"
              description="Kick off the conversation — share a win, ask a question, or hype up the crew."
            />
          ) : (
            <div className="space-y-5">
              {groups.map((group) => (
                <section key={group.key} aria-label={group.label}>
                  <div className="mb-2 flex items-center gap-3">
                    <span className="h-px flex-1 bg-border" />
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-muted-foreground">
                      {group.label}
                    </span>
                    <span className="h-px flex-1 bg-border" />
                  </div>
                  <ul className="space-y-1">
                    {group.messages.map((message, index) => {
                      const isOwn =
                        myPrincipal !== null &&
                        message.sender.toText() === myPrincipal;
                      return (
                        <MessageBubble
                          key={message.id.toString()}
                          message={message}
                          isOwn={isOwn}
                          canDelete={isOwn || isAdmin}
                          isDeleting={
                            deleteMessage.isPending &&
                            deleteMessage.variables === message.id
                          }
                          onDelete={(id) => deleteMessage.mutate(id)}
                          index={index + 1}
                        />
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>

        <MessageComposer
          onSend={(body) => sendMessage.mutate(body)}
          isPending={sendMessage.isPending}
          isError={sendMessage.isError}
          errorMessage={
            sendMessage.isError ? sendErrorMessage(sendMessage.error) : null
          }
        />
      </Panel>
    </div>
  );
}
