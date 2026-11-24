import { InviteForm } from "@/components/admin/InviteForm";
import { InviteList } from "@/components/admin/InviteList";
import { MemberRoster } from "@/components/admin/MemberRoster";
import { Eyebrow, Panel, SectionTitle } from "@/components/layout/Panel";
import { ErrorState, LoadingState } from "@/components/layout/States";
import { useMemberProfile } from "@/hooks/useQueries";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";

/** Shown to signed-in members who are not coaches. */
function AccessDenied() {
  return (
    <div className="space-y-6">
      <div>
        <Eyebrow>Coaches only</Eyebrow>
        <SectionTitle slash="Admin">Member management</SectionTitle>
      </div>
      <Panel
        data-ocid="admin.access_denied"
        className="flex flex-col items-center gap-3 px-6 py-14 text-center"
      >
        <span className="flex size-12 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground">
          <Lock className="size-5" aria-hidden="true" />
        </span>
        <div className="space-y-1">
          <p className="font-display text-lg font-bold uppercase tracking-tight text-foreground">
            Coaches only
          </p>
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">
            Invite management is reserved for Unbreakable coaches. Ask a coach
            if you need access changed.
          </p>
        </div>
        <Link
          to="/"
          data-ocid="admin.back_link"
          className="font-mono text-xs uppercase tracking-[0.16em] text-foreground underline-offset-4 hover:text-primary hover:underline"
        >
          Back to dashboard
        </Link>
      </Panel>
    </div>
  );
}

export function AdminPage() {
  const profile = useMemberProfile();
  const { identity } = useInternetIdentity();

  if (profile.isLoading) {
    return <LoadingState label="Checking coach access" />;
  }

  if (profile.isError) {
    return (
      <ErrorState
        title="Couldn't verify your access"
        description="We couldn't confirm your coach status. Try again in a moment."
        onRetry={() => void profile.refetch()}
      />
    );
  }

  if (!profile.data?.isAdmin) {
    return <AccessDenied />;
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Eyebrow>Coaches only</Eyebrow>
          <SectionTitle slash="Admin">Member management</SectionTitle>
        </div>
        <p className="max-w-sm text-sm text-muted-foreground sm:text-right">
          Control who trains with Unbreakable. Invite members, revoke access and
          promote coaches.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start">
        <div className="animate-fade-up space-y-6">
          <InviteForm />
        </div>
        <div className="animate-fade-up space-y-6 [animation-delay:80ms]">
          <InviteList />
          <MemberRoster selfPrincipal={identity?.getPrincipal().toString()} />
        </div>
      </div>
    </div>
  );
}
