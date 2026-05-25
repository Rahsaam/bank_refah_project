import type { UseFormRegister, FieldValues, Path, FieldError } from 'react-hook-form';

export type UserRoleType = "admin" | "editor" | "viewer";

export interface IAuthContext {
  user: IUser | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (action: "view" | "create" | "edit" | "delete") => boolean;
  isAuthenticated: boolean;
}

export interface IUser {
  id: number;
  username: string;
  email?: string;
  role: UserRoleType;
}

export interface IProduct {
  id: number;
  title: string;
  price: number;
  discount: number;
  expiryDate: string;
  category: "electronics" | "clothing" | "food" | "home" | "books";
  image?: string;
  description?: string;
}

export interface IPost {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface IComment {
  id: number;
  name: string;
  email: string;
  body: string;
  postId: number;
}

export interface IAlbum {
  id: number;
  title: string;
  userId: number;
}

export interface IPhoto {
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
  albumId: number;
}

export interface ITodo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

export interface IPhotos {
  albumId: number;
  id: number;
  title: string;
  url: string;
  ththumbnailUrl: string;
}

export interface ILoginResponse {
  token: string;
  user: IUser;
}

export interface IClient {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: IAddress;
  company: ICompany;
}

interface IAddress {
  street: string;
  suit: string;
  city: string;
  zipcode: string;
  geo: IGeo;
}

interface IGeo {
  lat: string;
  lng: string;
}

interface ICompany {
  name: string;
  catchPhrase: string;
  bs: string;
}

export interface IImageUploaderProps {
  initialImage?: string;
  onImageChange: (base64: string) => void;
  error?: string;
}

export interface IFormInputProps {
  label: string;
  name: Path<FieldValues>; // 👈 این بخش باعث میشه فقط نام‌های معتبر فرم قبول بشن
  register: UseFormRegister<FieldValues>; // 👈 تایپ دقیق ریجستر
  type?: 'text' | 'number' | 'password' | 'email' | 'textarea'; // و بقیه تایپ‌ها
  error?: FieldError;
  required?: boolean;
  placeholder?: string;
}


export interface IFormSelectProps {
  label: string;
  name: Path<FieldValues>; // 👈 این بخش باعث میشه فقط نام‌های معتبر فرم قبول بشن
  register: UseFormRegister<FieldValues>; // 👈 تایپ دقیق ریجستر
  options: Option[];
  error?: FieldError;
  required?: boolean;
}

interface Option {
  value: string;
  label: string;
}

export interface IStatsCardsProps {
  totalProducts: number;
  discountedProducts: number;
  totalInventoryValue: number;
  expiringProducts: number;
}
