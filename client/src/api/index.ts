import { apiClient } from './client';
import { Chapter, Memory, Friend, Message, SiteSettings, Admin, ApiResponse, AlumniComment, ReactionStats } from '../types';

// Auth API
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await apiClient.post<ApiResponse<{ admin: Admin; token: string }>>('/auth/login', credentials);
    return res.data;
  },
  getMe: async () => {
    const res = await apiClient.get<ApiResponse<{ admin: Admin }>>('/auth/me');
    return res.data;
  },
  logout: async () => {
    const res = await apiClient.post<ApiResponse<null>>('/auth/logout');
    return res.data;
  },
};

// Chapters API
export const chaptersApi = {
  getAll: async (includeUnpublished = false) => {
    const res = await apiClient.get<ApiResponse<{ chapters: Chapter[] }>>('/chapters', {
      params: { includeUnpublished },
    });
    return res.data.data.chapters;
  },
  getBySlug: async (slug: string) => {
    const res = await apiClient.get<ApiResponse<{ chapter: Chapter; memories: Memory[] }>>(`/chapters/${slug}`);
    return res.data.data;
  },
  create: async (formData: FormData) => {
    const res = await apiClient.post<ApiResponse<{ chapter: Chapter }>>('/chapters', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data.chapter;
  },
  update: async (id: string, formData: FormData) => {
    const res = await apiClient.put<ApiResponse<{ chapter: Chapter }>>(`/chapters/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data.chapter;
  },
  delete: async (id: string) => {
    const res = await apiClient.delete<ApiResponse<null>>(`/chapters/${id}`);
    return res.data;
  },
  reorder: async (items: { id: string; displayOrder: number }[]) => {
    const res = await apiClient.patch<ApiResponse<{ chapters: Chapter[] }>>('/chapters/reorder', { items });
    return res.data.data.chapters;
  },
};

// Memories API
export const memoriesApi = {
  getAll: async (params: {
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
  } = {}) => {
    const res = await apiClient.get<ApiResponse<{ memories: Memory[]; total: number; page: number; limit: number }>>('/memories', {
      params,
    });
    return res.data.data;
  },
  getById: async (id: string) => {
    const res = await apiClient.get<ApiResponse<{ memory: Memory; adjacent: { prev?: Memory; next?: Memory } }>>(`/memories/${id}`);
    return res.data.data;
  },
  create: async (formData: FormData) => {
    const res = await apiClient.post<ApiResponse<{ memory: Memory }>>('/memories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data.memory;
  },
  update: async (id: string, formData: FormData) => {
    const res = await apiClient.put<ApiResponse<{ memory: Memory }>>(`/memories/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data.memory;
  },
  delete: async (id: string) => {
    const res = await apiClient.delete<ApiResponse<null>>(`/memories/${id}`);
    return res.data;
  },
  reorder: async (items: { id: string; displayOrder: number }[]) => {
    const res = await apiClient.patch<ApiResponse<null>>('/memories/reorder', { items });
    return res.data;
  },
};

// Friends API
export const friendsApi = {
  getAll: async (includeUnpublished = false) => {
    const res = await apiClient.get<ApiResponse<{ friends: Friend[] }>>('/friends', {
      params: { includeUnpublished },
    });
    return res.data.data.friends;
  },
  getById: async (id: string) => {
    const res = await apiClient.get<ApiResponse<{ friend: Friend }>>(`/friends/${id}`);
    return res.data.data.friend;
  },
  create: async (formData: FormData) => {
    const res = await apiClient.post<ApiResponse<{ friend: Friend }>>('/friends', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data.friend;
  },
  update: async (id: string, formData: FormData) => {
    const res = await apiClient.put<ApiResponse<{ friend: Friend }>>(`/friends/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data.friend;
  },
  delete: async (id: string) => {
    const res = await apiClient.delete<ApiResponse<null>>(`/friends/${id}`);
    return res.data;
  },
  reorder: async (items: { id: string; displayOrder: number }[]) => {
    const res = await apiClient.patch<ApiResponse<null>>('/friends/reorder', { items });
    return res.data;
  },
};

// Messages / Memory Wall API
export const messagesApi = {
  getAll: async (includeUnpublished = false) => {
    const res = await apiClient.get<ApiResponse<{ messages: Message[] }>>('/messages', {
      params: { includeUnpublished },
    });
    return res.data.data.messages;
  },
  create: async (data: Partial<Message>) => {
    const res = await apiClient.post<ApiResponse<{ message: Message }>>('/messages', data);
    return res.data.data.message;
  },
  update: async (id: string, data: Partial<Message>) => {
    const res = await apiClient.put<ApiResponse<{ message: Message }>>(`/messages/${id}`, data);
    return res.data.data.message;
  },
  delete: async (id: string) => {
    const res = await apiClient.delete<ApiResponse<null>>(`/messages/${id}`);
    return res.data;
  },
};

// Settings API
export const settingsApi = {
  get: async () => {
    const res = await apiClient.get<ApiResponse<{ settings: SiteSettings; stats: any }>>('/settings');
    return res.data.data;
  },
  update: async (formData: FormData) => {
    const res = await apiClient.put<ApiResponse<{ settings: SiteSettings }>>('/settings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data.settings;
  },
};

// Interactions (Reactions & Comments) API
export const interactionsApi = {
  react: async (payload: {
    targetType: 'chapter' | 'memory';
    targetId: string;
    emoji?: string;
    type?: 'reaction' | 'like';
  }) => {
    const res = await apiClient.post<ApiResponse<{ targetId: string; targetType: string; reactions: Record<string, number>; likesCount: number }>>('/interactions/react', payload);
    return res.data.data;
  },
  addComment: async (payload: {
    targetType: 'chapter' | 'memory';
    targetId: string;
    authorName: string;
    authorAvatar?: string;
    content: string;
  }) => {
    const res = await apiClient.post<ApiResponse<{ comment: AlumniComment }>>('/interactions/comments', payload);
    return res.data.data.comment;
  },
  getComments: async (targetType: 'chapter' | 'memory', targetId: string) => {
    const res = await apiClient.get<ApiResponse<{ comments: AlumniComment[]; count: number }>>(`/interactions/comments/${targetType}/${targetId}`);
    return res.data.data.comments;
  },
  getStats: async (targetType: 'chapter' | 'memory', targetId: string) => {
    const res = await apiClient.get<ApiResponse<ReactionStats>>(`/interactions/stats/${targetType}/${targetId}`);
    return res.data.data;
  },
  deleteComment: async (id: string) => {
    const res = await apiClient.delete<ApiResponse<null>>(`/interactions/comments/${id}`);
    return res.data;
  },
};

