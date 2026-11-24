import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import Types "../types/workouts";
import MembersTypes "../types/members";
import WorkoutsLib "../lib/workouts";

mixin (
  accessControlState : AccessControl.AccessControlState,
  invites : Map.Map<Nat, MembersTypes.Invite>,
  profiles : Map.Map<Principal, MembersTypes.MemberProfile>,
  workouts : Map.Map<Nat, Types.Workout>,
  completions : Map.Map<Nat, Types.Completion>,
  state : { var nextWorkoutId : Nat; var nextCompletionId : Nat },
) {
  func requireWorkoutMember(caller : Principal) {
    if (caller.isAnonymous()) {
      Runtime.trap("Access denied: only invited members may access the workout library");
    };
    if (not profiles.containsKey(caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Access denied: only invited members may access the workout library");
    };
  };

  func requireWorkoutAdmin(caller : Principal) {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Access denied: only admins may manage workouts");
    };
  };

  public query ({ caller }) func listWorkouts() : async [Types.Workout] {
    requireWorkoutMember(caller);
    WorkoutsLib.listWorkouts(workouts);
  };

  public query ({ caller }) func getWorkout(id : Nat) : async ?Types.Workout {
    requireWorkoutMember(caller);
    workouts.get(id);
  };

  public shared ({ caller }) func createWorkout(input : Types.WorkoutInput) : async Types.Workout {
    requireWorkoutAdmin(caller);
    let id = state.nextWorkoutId;
    state.nextWorkoutId := id + 1;
    let workout = WorkoutsLib.toWorkout(id, input, Time.now());
    workouts.add(id, workout);
    workout;
  };

  public shared ({ caller }) func updateWorkout(id : Nat, input : Types.WorkoutInput) : async Types.Workout {
    requireWorkoutAdmin(caller);
    let existing = workouts.get(id) ?? Runtime.trap("Workout not found");
    let updated = WorkoutsLib.toWorkout(id, input, existing.createdAt);
    workouts.add(id, updated);
    updated;
  };

  public shared ({ caller }) func deleteWorkout(id : Nat) : async () {
    requireWorkoutAdmin(caller);
    if (not workouts.containsKey(id)) {
      Runtime.trap("Workout not found");
    };
    workouts.remove(id);
  };

  public shared ({ caller }) func completeWorkout(id : Nat) : async Types.Completion {
    requireWorkoutMember(caller);
    let workout = workouts.get(id) ?? Runtime.trap("Workout not found");
    let completionId = state.nextCompletionId;
    state.nextCompletionId := completionId + 1;
    let completion : Types.Completion = {
      id = completionId;
      workoutId = id;
      member = caller;
      workoutTitle = workout.title;
      completedAt = Time.now();
    };
    completions.add(completionId, completion);
    completion;
  };

  public query ({ caller }) func listMyCompletions() : async [Types.Completion] {
    requireWorkoutMember(caller);
    WorkoutsLib.listCompletionsForMember(completions, caller);
  };
};
