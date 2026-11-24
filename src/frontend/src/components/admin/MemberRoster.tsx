import type { MemberView } from "@/backend";
import { MemberAvatar } from "@/components/layout/MemberAvatar";
import { Eyebrow, Panel, Tag } from "@/components/layout/Panel";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/layout/States";
import { UnbreakableButton } from "@/components/layout/UnbreakableButton";
import {
  useMembers,
  usePromoteToAdmin,
  useRemoveMember,
} from "@/hooks/useQueries";
import { Users } from "lucide-react";

function MemberRow({
  member,
  index,
  isSelf,
}: {
  member: MemberView;
  index: number;
  isSelf: boolean;
}) {
  const promote = usePromoteToAdmin();
  const remove = useRemoveMember();
  const busy = promote.isPending || remove.isPending;

  return (
    <li
      data-ocid={`admin.member.item.${index + 1}`}
      className="flex flex-col gap-3 border-b border-border/70 px-4 py-3.5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex min-w-0 items-center gap-3">
        <MemberAvatar name={member.displayName || member.email} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-body text-sm font-medium text-foreground">
              {member.displayName || "Unnamed member"}
            </p>
            {member.isAdmin ? <Tag tone="coach">Coach</Tag> : null}
            {isSelf ? <Tag tone="outline">You</Tag> : null}
          </div>
          <p className="truncate font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted-foreground">
            {member.email || "No email on file"}
          </p>
        </div>
      </div>

      {isSelf ? null : (
        <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
          {member.isAdmin ? null : (
            <UnbreakableButton
              variant="secondary"
              size="sm"
              data-ocid={`admin.member.promote_button.${index + 1}`}
              disabled={busy}
              onClick={() => promote.mutate(member.principal)}
            >
              {promote.isPending ? "Promoting…" : "Make coach"}
            </UnbreakableButton>
          )}
          <UnbreakableButton
            variant="destructive"
            size="sm"
            data-ocid={`admin.member.remove_button.${index + 1}`}
            disabled={busy}
            onClick={() => remove.mutate(member.principal)}
          >
            {remove.isPending ? "Removing…" : "Remove"}
          </UnbreakableButton>
        </div>
      )}
    </li>
  );
}

/** Admin roster of active members with promote and remove actions. */
export function MemberRoster({ selfPrincipal }: { selfPrincipal?: string }) {
  const members = useMembers();

  return (
    <Panel className="overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3.5">
        <div>
          <Eyebrow>Roster</Eyebrow>
          <h3 className="font-display text-base font-bold uppercase tracking-tight text-foreground">
            Active members
          </h3>
        </div>
        {members.data ? (
          <span className="font-mono text-xs text-muted-foreground">
            {members.data.length} active
          </span>
        ) : null}
      </div>

      {members.isLoading ? (
        <LoadingState label="Loading members" className="py-12" />
      ) : members.isError ? (
        <div className="p-4">
          <ErrorState
            title="Couldn't load members"
            description="The member roster didn't come through."
            onRetry={() => void members.refetch()}
          />
        </div>
      ) : members.data && members.data.length > 0 ? (
        <ul data-ocid="admin.member.list">
          {members.data.map((member, index) => (
            <MemberRow
              key={member.principal.toString()}
              member={member}
              index={index}
              isSelf={member.principal.toString() === selfPrincipal}
            />
          ))}
        </ul>
      ) : (
        <div className="p-4">
          <EmptyState
            icon={<Users className="size-5" aria-hidden="true" />}
            title="No members yet"
            description="Once invited members sign in, they'll show up here."
          />
        </div>
      )}
    </Panel>
  );
}
