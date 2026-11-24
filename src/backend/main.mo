import Map "mo:core/Map";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import OQL "mo:caffeineai-oql";
import Expose "mo:caffeineai-oql/Expose";
import Entity "mo:caffeineai-oql/Entity";
import MapEntity "mo:caffeineai-oql/MapEntity";
import RecordValue "mo:caffeineai-oql/RecordValue";
import NatValue "mo:caffeineai-oql/NatValue";
import IntValue "mo:caffeineai-oql/IntValue";
import TextValue "mo:caffeineai-oql/TextValue";
import PrincipalValue "mo:caffeineai-oql/PrincipalValue";
import MembersTypes "types/members";
import WorkoutTypes "types/workouts";
import ChatTypes "types/chat";
import MembersApi "mixins/members-api";
import WorkoutsApi "mixins/workouts-api";
import ChatApi "mixins/chat-api";
import ApiDocMixin "mixins/api-doc";

actor {
  let accessControlState : AccessControl.AccessControlState;
  include MixinAuthorization(accessControlState, null);

  let invites : Map.Map<Nat, MembersTypes.Invite>;
  let profiles : Map.Map<Principal, MembersTypes.MemberProfile>;
  let workouts : Map.Map<Nat, WorkoutTypes.Workout>;
  let completions : Map.Map<Nat, WorkoutTypes.Completion>;
  let messages : Map.Map<Nat, ChatTypes.Message>;

  let membersState : { var nextInviteId : Nat };
  let workoutsState : { var nextWorkoutId : Nat; var nextCompletionId : Nat };
  let chatState : { var nextMessageId : Nat };

  include MembersApi(accessControlState, invites, profiles, membersState);
  include WorkoutsApi(accessControlState, invites, profiles, workouts, completions, workoutsState);
  include ChatApi(accessControlState, invites, profiles, messages, chatState);
  include ApiDocMixin();

  transient let samplePrincipal = Principal.fromText("aaaaa-aa");

  func inviteStatusText(status : MembersTypes.InviteStatus) : Text = switch (status) {
    case (#invited) "invited";
    case (#joined) "joined";
    case (#revoked) "revoked";
  };

  // Members and admins may read the shared group chat; anonymous callers may not.
  func canSeeChat(caller : Principal, _owner : OQL.Value) : Bool {
    not caller.isAnonymous();
  };

  // Members and admins may read the workout library; anonymous callers may not.
  func canSeeWorkouts(caller : Principal, _owner : OQL.Value) : Bool {
    not caller.isAnonymous();
  };

  include Expose({
    entities = [
      invites.toEntityManual("invite", "Invite", "id")
        .payload("id", func (i : MembersTypes.Invite) : Nat { i.id })
        .payload("email", func (i : MembersTypes.Invite) : Text { i.email })
        .payload("status", func (i : MembersTypes.Invite) : Text { inviteStatusText(i.status) })
        .payload("invitedAt", func (i : MembersTypes.Invite) : Int { i.invitedAt })
        .payload("joinedAt", func (i : MembersTypes.Invite) : ?Int { i.joinedAt })
        .payload("joinedPrincipal", func (i : MembersTypes.Invite) : ?Principal { i.joinedPrincipal })
        .sample({
          id = 0;
          email = "";
          status = #invited;
          invitedAt = 0;
          joinedAt = ?0;
          joinedPrincipal = ?samplePrincipal;
        })
        .domain("status", [#text "invited", #text "joined", #text "revoked"])
        .controllerOnly()
        .build(),
      profiles.toEntity("member", "MemberProfile", "id")
        .sample({
          principal = samplePrincipal;
          email = "";
          displayName = "";
          joinedAt = 0;
        })
        .controllerOnly()
        .build(),
      workouts.toEntityManual("workout", "Workout", "id")
        .payload("id", func (w : WorkoutTypes.Workout) : Nat { w.id })
        .payload("title", func (w : WorkoutTypes.Workout) : Text { w.title })
        .payload("category", func (w : WorkoutTypes.Workout) : Text { w.category })
        .payload("durationMinutes", func (w : WorkoutTypes.Workout) : Nat { w.durationMinutes })
        .payload("difficulty", func (w : WorkoutTypes.Workout) : Text { w.difficulty })
        .payload("description", func (w : WorkoutTypes.Workout) : Text { w.description })
        .payload("exerciseCount", func (w : WorkoutTypes.Workout) : Nat { w.exercises.size() })
        .payload("coachingNotes", func (w : WorkoutTypes.Workout) : Text { w.coachingNotes })
        .payload("createdAt", func (w : WorkoutTypes.Workout) : Int { w.createdAt })
        .sample({
          id = 0;
          title = "";
          category = "";
          durationMinutes = 0;
          difficulty = "";
          description = "";
          exercises = [];
          coachingNotes = "";
          createdAt = 0;
        })
        .ownedByWith("id", canSeeWorkouts)
        .controllerOrScoped()
        .build(),
      completions.toEntity("completion", "Completion", "id")
        .sample({
          id = 0;
          workoutId = 0;
          member = samplePrincipal;
          workoutTitle = "";
          completedAt = 0;
        })
        .ownedBy("member")
        .controllerOrScoped()
        .build(),
      messages.toEntity("message", "Message", "id")
        .sample({
          id = 0;
          sender = samplePrincipal;
          senderName = "";
          body = "";
          createdAt = 0;
        })
        .ownedByWith("id", canSeeChat)
        .controllerOrScoped()
        .build(),
    ];
  });
};
