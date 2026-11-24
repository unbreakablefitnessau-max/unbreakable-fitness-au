import Common "common";

module {
  public type Exercise = {
    name : Text;
    sets : ?Nat;
    reps : ?Nat;
    durationSeconds : ?Nat;
    notes : ?Text;
  };

  public type Workout = {
    id : Common.WorkoutId;
    title : Text;
    category : Text;
    durationMinutes : Nat;
    difficulty : Text;
    description : Text;
    exercises : [Exercise];
    coachingNotes : Text;
    createdAt : Common.Timestamp;
  };

  public type WorkoutInput = {
    title : Text;
    category : Text;
    durationMinutes : Nat;
    difficulty : Text;
    description : Text;
    exercises : [Exercise];
    coachingNotes : Text;
  };

  public type Completion = {
    id : Nat;
    workoutId : Common.WorkoutId;
    member : Principal;
    workoutTitle : Text;
    completedAt : Common.Timestamp;
  };
};
