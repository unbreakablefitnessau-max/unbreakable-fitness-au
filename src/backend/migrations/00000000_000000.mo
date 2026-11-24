import Map "mo:core/Map";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";

module {
  type InviteStatus = { #invited; #joined; #revoked };

  type Invite = {
    id : Nat;
    email : Text;
    status : InviteStatus;
    invitedAt : Int;
    joinedAt : ?Int;
    joinedPrincipal : ?Principal;
  };

  type MemberProfile = {
    principal : Principal;
    email : Text;
    displayName : Text;
    joinedAt : Int;
  };

  type Exercise = {
    name : Text;
    sets : ?Nat;
    reps : ?Nat;
    durationSeconds : ?Nat;
    notes : ?Text;
  };

  type Workout = {
    id : Nat;
    title : Text;
    category : Text;
    durationMinutes : Nat;
    difficulty : Text;
    description : Text;
    exercises : [Exercise];
    coachingNotes : Text;
    createdAt : Int;
  };

  type Completion = {
    id : Nat;
    workoutId : Nat;
    member : Principal;
    workoutTitle : Text;
    completedAt : Int;
  };

  type Message = {
    id : Nat;
    sender : Principal;
    senderName : Text;
    body : Text;
    createdAt : Int;
  };

  public type OldActor = {};

  public type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    invites : Map.Map<Nat, Invite>;
    profiles : Map.Map<Principal, MemberProfile>;
    workouts : Map.Map<Nat, Workout>;
    completions : Map.Map<Nat, Completion>;
    messages : Map.Map<Nat, Message>;
    membersState : { var nextInviteId : Nat };
    workoutsState : { var nextWorkoutId : Nat; var nextCompletionId : Nat };
    chatState : { var nextMessageId : Nat };
  };

  public func migration(_ : OldActor) : NewActor {
    {
      accessControlState = AccessControl.initState();
      invites = Map.empty();
      profiles = Map.empty();
      workouts = Map.empty();
      completions = Map.empty();
      messages = Map.empty();
      membersState = { var nextInviteId = 0 };
      workoutsState = { var nextWorkoutId = 0; var nextCompletionId = 0 };
      chatState = { var nextMessageId = 0 };
    };
  };
};
