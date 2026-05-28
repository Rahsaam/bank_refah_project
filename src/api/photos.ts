
import axiosInstance from '../services/axios';
import type { IPhoto } from '../types';


export const fetchPhotos = async (): Promise<IPhoto[]> => {
  const { data } = await axiosInstance.get('/photos');
  return data;
};


export const fetchPhotoById = async (id: number): Promise<IPhoto> => {
  const { data } = await axiosInstance.get(`/photos/${id}`);
  return data;
};


export const fetchPhotosByAlbumId = async (albumId: number): Promise<IPhoto[]> => {
  const { data } = await axiosInstance.get(`/photos?albumId=${albumId}`);
  return data;
};


export const createPhoto = async (photo: Omit<IPhoto, 'id'>): Promise<IPhoto> => {
  const { data } = await axiosInstance.post('/photos', photo);
  return data;
};


export const updatePhoto = async ({ id, ...photo }: IPhoto): Promise<IPhoto> => {
  const { data } = await axiosInstance.put(`/photos/${id}`, photo);
  return data;
};


export const deletePhoto = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/photos/${id}`);
};