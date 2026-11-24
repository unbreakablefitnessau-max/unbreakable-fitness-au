import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Types "../types/members";

module {
  public func normalizeEmail(email : Text) : Text {
    email.trim(#predicate(func c = c == ' ' or c == '\t' or c == '\n' or c == '\r')).toLower();
  };

  public func findInviteByEmail(invites : Map.Map<Nat, Types.Invite>, email : Text) : ?Types.Invite {
    let target = normalizeEmail(email);
    invites.values().find(func invite = normalizeEmail(invite.email) == target);
  };

  // Admins are members even when they have no stored profile row.
  public func accessState(
    invites : Map.Map<Nat, Types.Invite>,
    profiles : Map.Map<Principal, Types.MemberProfile>,
    isAdmin : Bool,
    caller : Principal,
  ) : Types.AccessState {
    if (isAdmin or profiles.containsKey(caller)) {
      #member;
    } else {
      switch (invites.values().find(func invite = invite.joinedPrincipal == ?caller)) {
        case (?_) { #pending };
        case null { #unregistered };
      };
    };
  };

  // Admins without a profile row still get a view so the shell can render.
  public func toMemberView(
    profiles : Map.Map<Principal, Types.MemberProfile>,
    isAdmin : Bool,
    caller : Principal,
  ) : ?Types.MemberView {
    switch (profiles.get(caller)) {
      case (?profile) {
        ?{
          principal = profile.principal;
          email = profile.email;
          displayName = profile.displayName;
          isAdmin;
        };
      };
      case null {
        if (isAdmin) {
          ?{
            principal = caller;
            email = "";
            displayName = "Admin";
            isAdmin = true;
          };
        } else {
          null;
        };
      };
    };
  };
};
