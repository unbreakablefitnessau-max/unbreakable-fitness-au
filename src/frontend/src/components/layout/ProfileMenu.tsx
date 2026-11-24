import { cn } from "@/lib/utils";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { MemberAvatar } from "./MemberAvatar";
import { Tag } from "./Panel";
import { UnbreakableButton } from "./UnbreakableButton";

/** Signed-in identity chip with role tag and sign-out. */
export function ProfileMenu({
  displayName,
  isAdmin,
  className,
}: {
  displayName: string;
  isAdmin: boolean;
  className?: string;
}) {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="hidden min-w-0 flex-col items-end sm:flex">
        <span className="max-w-[12rem] truncate text-sm font-semibold text-foreground">
          {displayName}
        </span>
        <Tag tone={isAdmin ? "coach" : "muted"} className="mt-1">
          {isAdmin ? "Coach" : "Member"}
        </Tag>
      </div>
      <MemberAvatar name={displayName} />
      <UnbreakableButton
        variant="ghost"
        size="icon"
        aria-label="Sign out"
        data-ocid="auth.signout_button"
        onClick={() => {
          void queryClient.cancelQueries();
          queryClient.clear();
          clear();
        }}
      >
        <LogOut aria-hidden="true" />
      </UnbreakableButton>
    </div>
  );
}
