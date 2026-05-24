export type UserRoleType = 'admin' | 'editor' | 'viewer';


export interface IAuthContext {
  user: IUser | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (action: 'view' | 'create' | 'edit' | 'delete') => boolean;
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
  category: 'electronics' | 'clothing' | 'food' | 'home' | 'books';
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


export interface ILoginResponse {
  token: string;
  user: IUser;
}