import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import Types "../types/chat";
import MembersTypes "../types/members";
import ChatLib "../lib/chat";

mixin (
  accessControlState : AccessControl.AccessControlState,
  invites : Map.Map<Nat, MembersTypes.Invite>,
  profiles : Map.Map<Principal, MembersTypes.MemberProfile>,
  messages : Map.Map<Nat, Types.Message>,
  state : { var nextMessageId : Nat },
) {
  func requireChatMember(caller : Principal) : MembersTypes.MemberProfile {
    if (caller.isAnonymous()) {
      Runtime.trap("Sign in to access the group chat");
    };
    switch (profiles.get(caller)) {
      case (?profile) { profile };
      case (null) {
        if (AccessControl.isAdmin(accessControlState, caller)) {
          {
            principal = caller;
            email = "";
            displayName = "Admin";
            joinedAt = 0;
          };
        } else {
          Runtime.trap("Only invited Unbreakable Fitness AU members can access the group chat");
        };
      };
    };
  };

  public query ({ caller }) func listMessages() : async [Types.Message] {
    ignore requireChatMember(caller);
    ChatLib.listMessages(messages);
  };

  public shared ({ caller }) func sendMessage(body : Text) : async Types.Message {
    let profile = requireChatMember(caller);
    let trimmed = body.trim(#predicate (func c = c == ' ' or c == '\n' or c == '\t' or c == '\r'));
    if (trimmed.size() == 0) {
      Runtime.trap("Message cannot be empty");
    };
    let id = state.nextMessageId;
    state.nextMessageId := id + 1;
    let message : Types.Message = {
      id;
      sender = caller;
      senderName = profile.displayName;
      body = trimmed;
      createdAt = Time.now();
    };
    messages.add(id, message);
    message;
  };

  public shared ({ caller }) func deleteMessage(id : Nat) : async () {
    ignore requireChatMember(caller);
    let message = switch (messages.get(id)) {
      case (?m) { m };
      case (null) { Runtime.trap("Message not found") };
    };
    let isSender = message.sender.equal(caller);
    let isAdmin = switch (accessControlState.userRoles.get(caller)) {
      case (?#admin) { true };
      case (_) { false };
    };
    if (not isSender and not isAdmin) {
      Runtime.trap("You can only delete your own messages");
    };
    messages.remove(id);
  };
};
