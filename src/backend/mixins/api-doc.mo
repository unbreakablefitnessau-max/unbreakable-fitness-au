mixin () {
  public query func getApiDoc() : async Text {
    "# Unbreakable Fitness AU — Backend API\n\n" #
    "## Purpose\n\n" #
    "Private, invite-only fitness app for Unbreakable Fitness AU members. It provides a workout library, per-member workout completion history, and a single shared group chat. Access is restricted to emails an admin has invited.\n\n" #
    "## Authentication\n\n" #
    "Sign-in uses Internet Identity. The frontend pins an Internet Identity derivation origin, published at `/.well-known/ii-derivation-origin` when available. An agent that already holds the user's Internet Identity authorization derives the correct per-app principal against that origin (for example `icp identity link web <name> --app <host>`). Such a delegation acts with the user's full authority in this app until it expires.\n\n" #
    "Methods that require a signed (non-anonymous) caller: `registerMember`, `sendMessage`, `deleteMessage`, `completeWorkout`, `listWorkouts`, `getWorkout`, `listMyCompletions`, `listMessages`, `getMyAccessState`, `getMyMemberProfile`. Admin-only methods: `inviteMember`, `revokeInvite`, `removeMember`, `promoteToAdmin`, `listInvites`, `listMembers`, `createWorkout`, `updateWorkout`, `deleteWorkout`, `assignCallerUserRole`.\n\n" #
    "## Registration prerequisite\n\n" #
    "Registration happens only when a caller signs in through the app's own frontend and calls `registerMember(displayName)`. A principal that never did so is unregistered even when it belongs to the app's owner, and a principal derived against a different origin is a different principal than the one the frontend registered.\n\n" #
    "- The first caller to invoke `_initialize_access_control` becomes the initial admin; subsequent callers receive the default user role.\n" #
    "- An unregistered caller receives `#unregistered` from `getMyAccessState`; a caller whose principal is linked to an invitation but who has not registered receives `#pending`; an admin always receives `#member`.\n" #
    "- Guarded endpoints trap with messages such as `Access denied: only invited members may access the workout library`, `Only invited Unbreakable Fitness AU members can access the group chat`, or `Unauthorized: Only admins can perform this action`.\n\n" #
    "## Authorization\n\n" #
    "- Members are principals with a stored profile (created by `registerMember` after their email matches an invitation).\n" #
    "- Admins are principals holding the `#admin` role in the access-control state. An admin is treated as a member even without a stored profile row: `getMyAccessState` returns `#member`, `getMyMemberProfile` returns a view with an empty email and display name `Admin`, and the workout and chat endpoints accept the caller.\n" #
    "- Anonymous callers may only call `getMyAccessState`, `getMyMemberProfile`, `schema`, `execute`, and `getApiDoc`; the first two return `#unregistered` and `null` for them.\n\n" #
    "## Units and encoding\n\n" #
    "- All timestamps are `Int` nanoseconds since the Unix epoch (UTC).\n" #
    "- Identifiers (`id`, `workoutId`) are `Nat` counters.\n" #
    "- Principals are rendered as canonical text in OQL results.\n" #
    "- Optional values are `null` when absent.\n" #
    "- `InviteStatus` is one of `#invited`, `#joined`, `#revoked`.\n" #
    "- `AccessState` is one of `#member`, `#pending`, `#unregistered`.\n\n" #
    "## Lifecycle and polling\n\n" #
    "- An invitation moves `#invited` -> `#joined` when the invited principal registers; `revokeInvite` and `removeMember` set `#revoked`.\n" #
    "- `listMessages` returns the full chat ordered by ascending id; poll it to refresh the group chat.\n" #
    "- `listMyCompletions` returns the caller's completions newest first.\n\n" #
    "## Mutation retry safety\n\n" #
    "- `inviteMember`, `createWorkout`, `completeWorkout`, `sendMessage` are not idempotent: retrying creates a new record. Check state before retrying after a timeout.\n" #
    "- `updateWorkout`, `revokeInvite`, `removeMember`, `promoteToAdmin`, `deleteWorkout`, `deleteMessage` are idempotent in effect but trap when the target is missing.\n" #
    "- `registerMember` is safe to retry: an already-registered caller returns `#member`.\n" #
    "- `sendMessage` stores the caller's profile display name; an admin without a profile row posts as `Admin`.\n" #
    "- `listWorkouts`, `getWorkout`, `listMyCompletions`, `listMessages` and `sendMessage` accept any signed-in admin even without a stored profile row.\n\n" #
    "## Errors and gotchas\n\n" #
    "- Traps surface as opaque rejects; the message text is informational only.\n" #
    "- `inviteMember` traps on an invalid email, an already-invited email, or an existing member.\n" #
    "- `removeMember` refuses to remove the caller's own access.\n" #
    "- `deleteMessage` allows the sender or any admin only.\n" #
    "- `schema()` and `execute()` expose queryable data through OQL; entities are filtered per caller authorization.\n";
  };
};
