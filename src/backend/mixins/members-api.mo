import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Types "../types/members";
import MembersLib "../lib/members";

mixin (
  accessControlState : AccessControl.AccessControlState,
  invites : Map.Map<Nat, Types.Invite>,
  profiles : Map.Map<Principal, Types.MemberProfile>,
  state : { var nextInviteId : Nat },
) {
  func requireAdmin(caller : Principal) {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
  };

  func findInvite(id : Nat) : ?Types.Invite {
    invites.get(id);
  };

  public query ({ caller }) func getMyAccessState() : async Types.AccessState {
    MembersLib.accessState(invites, profiles, AccessControl.isAdmin(accessControlState, caller), caller);
  };

  public query ({ caller }) func getMyMemberProfile() : async ?Types.MemberView {
    MembersLib.toMemberView(profiles, AccessControl.isAdmin(accessControlState, caller), caller);
  };

  public shared ({ caller }) func registerMember(displayName : Text) : async Types.AccessState {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Sign in to register");
    };
    switch (profiles.get(caller)) {
      case (?_) { return #member };
      case null {};
    };
    let name = displayName.trim(#predicate(func c = c == ' ' or c == '\t' or c == '\n' or c == '\r'));
    if (name.size() == 0) {
      Runtime.trap("Display name is required");
    };
    let now = Time.now();
    if (AccessControl.isAdmin(accessControlState, caller)) {
      profiles.add(caller, {
        principal = caller;
        email = "";
        displayName = name;
        joinedAt = now;
      });
      return #member;
    };
    switch (invites.values().find(func invite = invite.joinedPrincipal == ?caller)) {
      case (?invite) {
        profiles.add(caller, {
          principal = caller;
          email = invite.email;
          displayName = name;
          joinedAt = now;
        });
        #member;
      };
      case null { #pending };
    };
  };

  public query ({ caller }) func listInvites() : async [Types.Invite] {
    requireAdmin(caller);
    invites.values().toArray();
  };

  public shared ({ caller }) func inviteMember(email : Text) : async Types.Invite {
    requireAdmin(caller);
    let normalized = MembersLib.normalizeEmail(email);
    if (normalized.size() == 0 or not normalized.contains(#text "@")) {
      Runtime.trap("A valid email address is required");
    };
    switch (MembersLib.findInviteByEmail(invites, normalized)) {
      case (?existing) {
        switch (existing.status) {
          case (#invited) { Runtime.trap("This email has already been invited") };
          case (#joined) { Runtime.trap("This email is already a member") };
          case (#revoked) {};
        };
      };
      case null {};
    };
    let id = state.nextInviteId;
    state.nextInviteId := id + 1;
    let invite : Types.Invite = {
      id;
      email = normalized;
      status = #invited;
      invitedAt = Time.now();
      joinedAt = null;
      joinedPrincipal = null;
    };
    invites.add(id, invite);
    invite;
  };

  public shared ({ caller }) func revokeInvite(id : Nat) : async () {
    requireAdmin(caller);
    switch (findInvite(id)) {
      case (?invite) {
        invites.add(id, { invite with status = #revoked });
      };
      case null { Runtime.trap("Invitation not found") };
    };
  };

  public shared ({ caller }) func removeMember(member : Principal) : async () {
    requireAdmin(caller);
    if (member == caller) {
      Runtime.trap("You cannot remove your own access");
    };
    if (not profiles.containsKey(member)) {
      Runtime.trap("Member not found");
    };
    profiles.remove(member);
    switch (invites.values().find(func invite = invite.joinedPrincipal == ?member)) {
      case (?invite) {
        invites.add(invite.id, {
          invite with
          status = #revoked;
          joinedPrincipal = null;
        });
      };
      case null {};
    };
  };

  public shared ({ caller }) func promoteToAdmin(member : Principal) : async () {
    requireAdmin(caller);
    if (not profiles.containsKey(member)) {
      Runtime.trap("Member not found");
    };
    AccessControl.assignRole(accessControlState, caller, member, #admin);
  };

  public query ({ caller }) func listMembers() : async [Types.MemberView] {
    requireAdmin(caller);
    profiles.values().map(func profile = {
      principal = profile.principal;
      email = profile.email;
      displayName = profile.displayName;
      isAdmin = AccessControl.isAdmin(accessControlState, profile.principal);
    }).toArray();
  };
};
