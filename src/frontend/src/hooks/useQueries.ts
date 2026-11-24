import { createActor } from "@/backend";
import type {
  Exercise,
  Invite,
  MemberView,
  Message,
  Workout,
  WorkoutInput,
} from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const queryKeys = {
  accessState: ["accessState"] as const,
  memberProfile: ["memberProfile"] as const,
  workouts: ["workouts"] as const,
  workout: (id: bigint) => ["workout", id.toString()] as const,
  completions: ["completions"] as const,
  messages: ["messages"] as const,
  invites: ["invites"] as const,
  members: ["members"] as const,
};

/** Access gate: member | pending | unregistered. Drives every screen. */
export function useAccessState() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.accessState,
    queryFn: async () => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.getMyAccessState();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useMemberProfile() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.memberProfile,
    queryFn: async () => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.getMyMemberProfile();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useRegisterMember() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (displayName: string) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.registerMember(displayName);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.accessState });
      void queryClient.invalidateQueries({ queryKey: queryKeys.memberProfile });
    },
  });
}

export function useWorkouts() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.workouts,
    queryFn: async () => {
      if (!actor) return [] as Workout[];
      return actor.listWorkouts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useWorkout(id: bigint | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.workout(id ?? 0n),
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getWorkout(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useMyCompletions() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.completions,
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMyCompletions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCompleteWorkout() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.completeWorkout(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.completions });
    },
  });
}

export function useMessages() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.messages,
    queryFn: async () => {
      if (!actor) return [] as Message[];
      return actor.listMessages();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 15_000,
  });
}

export function useSendMessage() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: string) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.sendMessage(body);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.messages });
    },
  });
}

export function useDeleteMessage() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.deleteMessage(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.messages });
    },
  });
}

export function useInvites() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.invites,
    queryFn: async () => {
      if (!actor) return [] as Invite[];
      return actor.listInvites();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useInviteMember() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (email: string) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.inviteMember(email);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.invites });
    },
  });
}

export function useRevokeInvite() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.revokeInvite(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.invites });
    },
  });
}

export function useMembers() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.members,
    queryFn: async () => {
      if (!actor) return [] as MemberView[];
      return actor.listMembers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRemoveMember() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      member: Parameters<NonNullable<typeof actor>["removeMember"]>[0],
    ) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.removeMember(member);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.members });
    },
  });
}

export function usePromoteToAdmin() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      member: Parameters<NonNullable<typeof actor>["promoteToAdmin"]>[0],
    ) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.promoteToAdmin(member);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.members });
    },
  });
}

export function useCreateWorkout() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: WorkoutInput) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.createWorkout(input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.workouts });
    },
  });
}

export function useUpdateWorkout() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: bigint; input: WorkoutInput }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.updateWorkout(id, input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.workouts });
    },
  });
}

export function useDeleteWorkout() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.deleteWorkout(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.workouts });
    },
  });
}

export type { Exercise, Invite, MemberView, Message, Workout, WorkoutInput };
