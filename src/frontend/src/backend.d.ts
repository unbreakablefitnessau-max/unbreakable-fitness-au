import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Cell {
    value: Value;
    name: string;
}
export interface Completion {
    id: bigint;
    member: Principal;
    completedAt: Timestamp;
    workoutTitle: string;
    workoutId: WorkoutId;
}
export type Error_ = {
    __kind__: "FrontendOriginsNotConfigured";
    FrontendOriginsNotConfigured: null;
} | {
    __kind__: "MixedSsoSources";
    MixedSsoSources: {
        otherKeys: Array<string>;
        ssoKeys: Array<string>;
    };
} | {
    __kind__: "Stale";
    Stale: {
        ageNs: bigint;
    };
} | {
    __kind__: "MalformedCandid";
    MalformedCandid: null;
} | {
    __kind__: "AmbiguousAttribute";
    AmbiguousAttribute: {
        field: string;
        sources: Array<string>;
    };
} | {
    __kind__: "NoAttributes";
    NoAttributes: null;
} | {
    __kind__: "UnknownNonce";
    UnknownNonce: null;
} | {
    __kind__: "UntrustedSsoSource";
    UntrustedSsoSource: {
        domain: string;
    };
} | {
    __kind__: "MissingField";
    MissingField: string;
} | {
    __kind__: "FrontendOriginMismatch";
    FrontendOriginMismatch: {
        got: string;
        expected: Array<string>;
    };
};
export interface Exercise {
    name: string;
    reps?: bigint;
    sets?: bigint;
    durationSeconds?: bigint;
    notes?: string;
}
export interface Invite {
    id: InviteId;
    status: InviteStatus;
    joinedAt?: Timestamp;
    invitedAt: Timestamp;
    email: string;
    joinedPrincipal?: Principal;
}
export type InviteId = bigint;
export interface MemberView {
    principal: Principal;
    displayName: string;
    email: string;
    isAdmin: boolean;
}
export interface Message {
    id: MessageId;
    body: string;
    createdAt: Timestamp;
    sender: Principal;
    senderName: string;
}
export type MessageId = bigint;
export interface Result {
    hasMore: boolean;
    rows: Array<Array<Cell>>;
}
export type Result__1 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export type Timestamp = bigint;
export type Value = {
    __kind__: "int";
    int: bigint;
} | {
    __kind__: "nat";
    nat: bigint;
} | {
    __kind__: "float";
    float: number;
} | {
    __kind__: "bool";
    bool: boolean;
} | {
    __kind__: "null";
    null: null;
} | {
    __kind__: "text";
    text: string;
};
export interface Workout {
    id: WorkoutId;
    title: string;
    coachingNotes: string;
    difficulty: string;
    createdAt: Timestamp;
    exercises: Array<Exercise>;
    description: string;
    durationMinutes: bigint;
    category: string;
}
export type WorkoutId = bigint;
export interface WorkoutInput {
    title: string;
    coachingNotes: string;
    difficulty: string;
    exercises: Array<Exercise>;
    description: string;
    durationMinutes: bigint;
    category: string;
}
export enum AccessState {
    member = "member",
    pending = "pending",
    unregistered = "unregistered"
}
export enum InviteStatus {
    revoked = "revoked",
    invited = "invited",
    joined = "joined"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    completeWorkout(id: bigint): Promise<Completion>;
    createWorkout(input: WorkoutInput): Promise<Workout>;
    deleteMessage(id: bigint): Promise<void>;
    deleteWorkout(id: bigint): Promise<void>;
    execute(qJson: string): Promise<Result>;
    getApiDoc(): Promise<string>;
    getCallerUserRole(): Promise<UserRole>;
    getMyAccessState(): Promise<AccessState>;
    getMyMemberProfile(): Promise<MemberView | null>;
    getWorkout(id: bigint): Promise<Workout | null>;
    inviteMember(email: string): Promise<Invite>;
    isCallerAdmin(): Promise<boolean>;
    listInvites(): Promise<Array<Invite>>;
    listMembers(): Promise<Array<MemberView>>;
    listMessages(): Promise<Array<Message>>;
    listMyCompletions(): Promise<Array<Completion>>;
    listWorkouts(): Promise<Array<Workout>>;
    promoteToAdmin(member: Principal): Promise<void>;
    registerMember(displayName: string): Promise<AccessState>;
    removeMember(member: Principal): Promise<void>;
    revokeInvite(id: bigint): Promise<void>;
    schema(): Promise<string>;
    sendMessage(body: string): Promise<Message>;
    updateWorkout(id: bigint, input: WorkoutInput): Promise<Workout>;
}
