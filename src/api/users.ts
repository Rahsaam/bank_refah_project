import axiosInstance from '../services/axios';
import type { IClient } from '../types';



export const fetchUsers = async (): Promise<IClient[]> => {
  const { data } = await axiosInstance.get('/users');
  return data;
};

export const fetchUserById = async (id: number): Promise<IClient> => {
  const { data } = await axiosInstance.get(`/users/${id}`);
  return data;
};

export const createUser = async (user: Omit<IClient, 'id'>): Promise<IClient> => {
  const { data } = await axiosInstance.post('/users', user);
  return data;
};

export const updateUser = async ({ id, ...user }: IClient): Promise<IClient> => {
  const { data } = await axiosInstance.put(`/users/${id}`, user);
  return data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/users/${id}`);
};