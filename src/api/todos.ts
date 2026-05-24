
import axiosInstance from '../services/axios';
import type { ITodo } from '../types';

export const fetchTodos = async (): Promise<ITodo[]> => {
  const { data } = await axiosInstance.get('/todos');
  return data;
};

export const fetchTodoById = async (id: number): Promise<ITodo> => {
  const { data } = await axiosInstance.get(`/todos/${id}`);
  return data;
};

export const fetchTodosByUserId = async (userId: number): Promise<ITodo[]> => {
  const { data } = await axiosInstance.get(`/todos?userId=${userId}`);
  return data;
};

export const createTodo = async (todo: Omit<ITodo, 'id'>): Promise<ITodo> => {
  const { data } = await axiosInstance.post('/todos', todo);
  return data;
};

export const updateTodo = async ({ id, ...todo }: ITodo): Promise<ITodo> => {
  const { data } = await axiosInstance.put(`/todos/${id}`, todo);
  return data;
};

export const deleteTodo = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/todos/${id}`);
};