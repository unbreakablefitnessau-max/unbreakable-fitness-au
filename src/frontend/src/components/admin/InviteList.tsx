import { type Invite, InviteStatus } from "@/backend";
import { Eyebrow, Panel, Tag } from "@/components/layout/Panel";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/layout/States";
import { UnbreakableButton } from "@/components/layout/UnbreakableButton";
import { useInvites, useRevokeInvite } from "@/hooks/useQueries";
import { formatDate } from "@/lib/format";
import { MailX, UserPlus } from "lucide-react";

const statusMeta: Record<
  InviteStatus,
  { label: string; tone: "muted" | "coach" | "online" | "primary" }
> = {
  [InviteStatus.invited]: { label: "Invited", tone: "primary" },
  [InviteStatus.joined]: { label: "Joined", tone: "online" },
  [InviteStatus.revoked]: { label: "Revoked", tone: "muted" },
};

function InviteRow({ invite, index }: { invite: Invite; index: number }) {
  const revoke = useRevokeInvite();
  const meta = statusMeta[invite.status];
  const canRevoke = invite.status === InviteStatus.invited;

  return (
    <li
      data-ocid={`admin.invite.item.${index + 1}`}
      className="flex flex-col gap-3 border-b border-border/70 px-4 py-3.5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="min-w-0">
        <p className="truncate font-body text-sm font-medium text-foreground">
          {invite.email}
        </p>
        <p className="mt-0.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted-foreground">
          Invited {formatDate(invite.invitedAt)}
          {invite.joinedAt !== undefined
            ? ` · Joined ${formatDate(invite.joinedAt)}`
            : ""}
        </p>
      </div>
      <div className="flex items-center gap-2 sm:shrink-0">
        <Tag tone={meta.tone}>{meta.label}</Tag>
        {canRevoke ? (
          <UnbreakableButton
            variant="destructive"
            size="sm"
            data-ocid={`admin.invite.revoke_button.${index + 1}`}
            disabled={revoke.isPending}
            onClick={() => revoke.mutate(invite.id)}
          >
            <MailX aria-hidden="true" />
            {revoke.isPending ? "Revoking…" : "Revoke"}
          </UnbreakableButton>
        ) : null}
      </div>
    </li>
  );
}

/** Admin list of invitations with status and revoke action. */
export function InviteList() {
  const invites = useInvites();

  return (
    <Panel className="overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3.5">
        <div>
          <Eyebrow>Invitations</Eyebrow>
          <h3 className="font-display text-base font-bold uppercase tracking-tight text-foreground">
            Invited members
          </h3>
        </div>
        {invites.data ? (
          <span className="font-mono text-xs text-muted-foreground">
            {invites.data.length} total
          </span>
        ) : null}
      </div>

      {invites.isLoading ? (
        <LoadingState label="Loading invites" className="py-12" />
      ) : invites.isError ? (
        <div className="p-4">
          <ErrorState
            title="Couldn't load invites"
            description="The invite list didn't come through."
            onRetry={() => void invites.refetch()}
          />
        </div>
      ) : invites.data && invites.data.length > 0 ? (
        <ul data-ocid="admin.invite.list">
          {invites.data.map((invite, index) => (
            <InviteRow
              key={invite.id.toString()}
              invite={invite}
              index={index}
            />
          ))}
        </ul>
      ) : (
        <div className="p-4">
          <EmptyState
            icon={<UserPlus className="size-5" aria-hidden="true" />}
            title="No invites yet"
            description="Invite your first member above and they'll appear here."
          />
        </div>
      )}
    </Panel>
  );
}
