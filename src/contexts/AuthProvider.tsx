import { useState, type ReactNode } from 'react';
import type { IUser, UserRoleType } from '../types/index.ts';
import { AuthContext } from './AuthContext.ts';

// یوزرها
const MOCK_USERS = {
  admin: { id: 1, username: 'admin', password: 'admin123', role: 'admin' as UserRoleType },
  editor: { id: 2, username: 'editor', password: 'editor123', role: 'editor' as UserRoleType },
  viewer: { id: 3, username: 'viewer', password: 'viewer123', role: 'viewer' as UserRoleType },
};

// تابع بررسی دسترسی بر اساس نقش
const checkPermission = (role: UserRoleType, action: 'view' | 'create' | 'edit' | 'delete'): boolean => {
  if (role === 'admin') return true;
  if (role === 'editor') return action !== 'delete';
  if (role === 'viewer') return action === 'view';
  return false;
};


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);


  const login = async (username: string, password: string): Promise<boolean> => {
    const mockUser = Object.values(MOCK_USERS).find(
      (u) => u.username === username && u.password === password
    );

    if (!mockUser) {
      return false;
    }

    const fakeToken = btoa(JSON.stringify({ userId: mockUser.id, role: mockUser.role, password: mockUser.password}));
    
    setToken(fakeToken);
    setUser({
      id: mockUser.id,
      username: mockUser.username,
      role: mockUser.role,
    });

    return true;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  // بررسی دسترسی
  const hasPermission = (action: 'view' | 'create' | 'edit' | 'delete'): boolean => {
    if (!user) return false;
    return checkPermission(user.role, action);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        hasPermission,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

