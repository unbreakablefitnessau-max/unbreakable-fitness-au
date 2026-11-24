import Map "mo:core/Map";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import MembersTypes "../types/members";

module {
  /// True when the caller is a registered member or an admin.
  public func hasMemberAccess(
    accessControlState : AccessControl.AccessControlState,
    profiles : Map.Map<Principal, MembersTypes.MemberProfile>,
    caller : Principal,
  ) : Bool {
    profiles.containsKey(caller) or AccessControl.isAdmin(accessControlState, caller);
  };
};
