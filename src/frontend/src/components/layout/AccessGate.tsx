import { AccessState } from "@/backend";
import { RequireSignIn } from "@/components/InternetIdentity";
import { AccessPendingScreen } from "@/components/layout/AccessPendingScreen";
import { InstallPrompt } from "@/components/layout/InstallPrompt";
import { Layout } from "@/components/layout/Layout";
import { ErrorState, LoadingState } from "@/components/layout/States";
import { WelcomeScreen } from "@/components/layout/WelcomeScreen";
import { useAccessState, useMemberProfile } from "@/hooks/useQueries";
import { Outlet } from "@tanstack/react-router";
import { useEffect } from "react";

/**
 * Member shell. Mounted only inside the signed-in subtree, so every private
 * query here runs after authentication.
 */
function MemberShell() {
  const access = useAccessState();
  const profile = useMemberProfile();

  useEffect(() => {
    if (access.data === AccessState.member) {
      document.title = "Unbreakable Fitness AU";
    }
  }, [access.data]);

  if (access.isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <LoadingState label="Checking your access" />
      </div>
    );
  }

  if (access.isError) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background px-5">
        <ErrorState
          title="We couldn't check your access"
          description="The connection to Unbreakable dropped. Try again in a moment."
          onRetry={() => void access.refetch()}
          className="w-full max-w-md"
        />
      </div>
    );
  }

  if (access.data === AccessState.pending) {
    return <AccessPendingScreen />;
  }

  if (access.data === AccessState.unregistered) {
    // Signed in but never registered: treat as pending with the same contact path.
    return <AccessPendingScreen />;
  }

  const displayName = profile.data?.displayName?.trim() || "Member";
  const isAdmin = profile.data?.isAdmin ?? false;

  return (
    <Layout displayName={displayName} isAdmin={isAdmin}>
      <div className="mb-6">
        <InstallPrompt />
      </div>
      <Outlet />
    </Layout>
  );
}

/** Root access gate: welcome → pending → member shell. */
export function AccessGate() {
  return (
    <RequireSignIn fallback={<WelcomeScreen />}>
      <MemberShell />
    </RequireSignIn>
  );
}
