import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chaptersApi, memoriesApi, friendsApi, messagesApi, settingsApi, interactionsApi } from '../api';
import { toast } from 'sonner';

// Chapters Hooks
export function useChapters(includeUnpublished = false) {
  return useQuery({
    queryKey: ['chapters', { includeUnpublished }],
    queryFn: () => chaptersApi.getAll(includeUnpublished),
  });
}

export function useChapter(slug: string) {
  return useQuery({
    queryKey: ['chapter', slug],
    queryFn: () => chaptersApi.getBySlug(slug),
    enabled: !!slug,
  });
}

// Memories Hooks
export function useMemories(params: {
  chapter?: string;
  year?: string;
  mediaType?: string;
  isFeatured?: boolean;
  tag?: string;
  search?: string;
  includeUnpublished?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
} = {}) {
  return useQuery({
    queryKey: ['memories', params],
    queryFn: () => memoriesApi.getAll(params),
  });
}

export function useMemory(id: string) {
  return useQuery({
    queryKey: ['memory', id],
    queryFn: () => memoriesApi.getById(id),
    enabled: !!id,
  });
}

// Friends Hooks
export function useFriends(includeUnpublished = false) {
  return useQuery({
    queryKey: ['friends', { includeUnpublished }],
    queryFn: () => friendsApi.getAll(includeUnpublished),
  });
}

// Messages Hooks
export function useMessages(includeUnpublished = false) {
  return useQuery({
    queryKey: ['messages', { includeUnpublished }],
    queryFn: () => messagesApi.getAll(includeUnpublished),
  });
}

export function useCreateMessageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: messagesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast.success('Your note has been pinned to the Memory Wall! 📌');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to pin note.');
    },
  });
}

// Settings Hook
export function useSiteSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: settingsApi.get,
  });
}

// Interaction Hooks (Reactions & Comments)
export function useComments(targetType: 'chapter' | 'memory', targetId: string) {
  return useQuery({
    queryKey: ['comments', targetType, targetId],
    queryFn: () => interactionsApi.getComments(targetType, targetId),
    enabled: !!targetId,
  });
}

export function useInteractionStats(targetType: 'chapter' | 'memory', targetId: string) {
  return useQuery({
    queryKey: ['interactionStats', targetType, targetId],
    queryFn: () => interactionsApi.getStats(targetType, targetId),
    enabled: !!targetId,
  });
}

export function useReactMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: interactionsApi.react,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['interactionStats', variables.targetType, variables.targetId] });
      if (variables.targetType === 'chapter') {
        queryClient.invalidateQueries({ queryKey: ['chapters'] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['memories'] });
      }
    },
    onError: () => {
      // Quiet fail so user flow isn't interrupted
    },
  });
}

export function useAddCommentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: interactionsApi.addComment,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.targetType, variables.targetId] });
      queryClient.invalidateQueries({ queryKey: ['interactionStats', variables.targetType, variables.targetId] });
      toast.success('Your memory note has been posted! 💬');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to post comment.');
    },
  });
}

export function useDeleteCommentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: interactionsApi.deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      toast.success('Comment deleted successfully.');
    },
  });
}

