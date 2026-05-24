import axiosInstance from '../services/axios';
import type { IAlbum } from '../types';

export const fetchAlbums = async (): Promise<IAlbum[]> => {
  const { data } = await axiosInstance.get('/albums');
  return data;
};

export const fetchAlbumById = async (id: number): Promise<IAlbum> => {
  const { data } = await axiosInstance.get(`/albums/${id}`);
  return data;
};

export const fetchAlbumsByUserId = async (userId: number): Promise<IAlbum[]> => {
  const { data } = await axiosInstance.get(`/albums?userId=${userId}`);
  return data;
};

export const createAlbum = async (album: Omit<IAlbum, 'id'>): Promise<IAlbum> => {
  const { data } = await axiosInstance.post('/albums', album);
  return data;
};

export const updateAlbum = async ({ id, ...album }: IAlbum): Promise<IAlbum> => {
  const { data } = await axiosInstance.put(`/albums/${id}`, album);
  return data;
};

export const deleteAlbum = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/albums/${id}`);
};