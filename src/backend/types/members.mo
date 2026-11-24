import Common "common";

module {
  public type InviteStatus = {
    #invited;
    #joined;
    #revoked;
  };

  public type Invite = {
    id : Common.InviteId;
    email : Text;
    status : InviteStatus;
    invitedAt : Common.Timestamp;
    joinedAt : ?Common.Timestamp;
    joinedPrincipal : ?Principal;
  };

  public type MemberProfile = {
    principal : Principal;
    email : Text;
    displayName : Text;
    joinedAt : Common.Timestamp;
  };

  public type MemberView = {
    principal : Principal;
    email : Text;
    displayName : Text;
    isAdmin : Bool;
  };

  public type AccessState = {
    #member;
    #pending;
    #unregistered;
  };
};
