
import axiosInstance from '../services/axios';
import type { IComment } from '../types/index';

export const fetchComments = async (): Promise<IComment[]> => {
  const { data } = await axiosInstance.get('/comments');
  return data;
};

export const fetchCommentById = async (id: number): Promise<IComment> => {
  const { data } = await axiosInstance.get(`/comments/${id}`);
  return data;
};

export const fetchCommentsByPostId = async (postId: number): Promise<IComment[]> => {
  const { data } = await axiosInstance.get(`/comments?postId=${postId}`);
  return data;
};

export const createComment = async (comment: Omit<IComment, 'id'>): Promise<IComment> => {
  const { data } = await axiosInstance.post('/comments', comment);
  return data;
};

export const updateComment = async ({ id, ...comment }: IComment): Promise<IComment> => {
  const { data } = await axiosInstance.put(`/comments/${id}`, comment);
  return data;
};

export const deleteComment = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/comments/${id}`);
};