
import axiosInstance from '../services/axios';
import type { IPhotos } from '../types';


export const fetchPhotos = async (): Promise<IPhotos[]> => {
  const { data } = await axiosInstance.get('/photos');
  return data;
};


export const fetchPhotoById = async (id: number): Promise<IPhotos> => {
  const { data } = await axiosInstance.get(`/photos/${id}`);
  return data;
};


export const fetchPhotosByAlbumId = async (albumId: number): Promise<IPhotos[]> => {
  const { data } = await axiosInstance.get(`/photos?albumId=${albumId}`);
  return data;
};


export const createPhoto = async (photo: Omit<IPhotos, 'id'>): Promise<IPhotos> => {
  const { data } = await axiosInstance.post('/photos', photo);
  return data;
};


export const updatePhoto = async ({ id, ...photo }: IPhotos): Promise<IPhotos> => {
  const { data } = await axiosInstance.put(`/photos/${id}`, photo);
  return data;
};


export const deletePhoto = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/photos/${id}`);
};