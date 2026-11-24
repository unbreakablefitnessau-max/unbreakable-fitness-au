import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Types "../types/workouts";

module {
  public func toWorkout(id : Nat, input : Types.WorkoutInput, createdAt : Int) : Types.Workout {
    {
      id;
      title = input.title;
      category = input.category;
      durationMinutes = input.durationMinutes;
      difficulty = input.difficulty;
      description = input.description;
      exercises = input.exercises;
      coachingNotes = input.coachingNotes;
      createdAt;
    };
  };

  public func listWorkouts(workouts : Map.Map<Nat, Types.Workout>) : [Types.Workout] {
    workouts.values().toArray().sort(func(a, b) = Nat.compare(a.id, b.id));
  };

  public func listCompletionsForMember(
    completions : Map.Map<Nat, Types.Completion>,
    member : Principal,
  ) : [Types.Completion] {
    completions.values().toArray()
      .filter(func(c) = Principal.equal(c.member, member))
      .sort(func(a, b) = Nat.compare(b.id, a.id));
  };
};
