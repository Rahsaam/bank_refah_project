
import axiosInstance from '../services/axios';
import type { IPost } from '../types/index';

export const fetchPosts = async (): Promise<IPost[]> => {
  const { data } = await axiosInstance.get('/posts');
  return data;
};

export const fetchPostById = async (id: number): Promise<IPost> => {
  const { data } = await axiosInstance.get(`/posts/${id}`);
  return data;
};

export const createPost = async (post: Omit<IPost, 'id'>): Promise<IPost> => {
  const { data } = await axiosInstance.post('/posts', post);
  return data;
};

export const updatePost = async ({ id, ...post }: IPost): Promise<IPost> => {
  const { data } = await axiosInstance.put(`/posts/${id}`, post);
  return data;
};

export const deletePost = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/posts/${id}`);
};