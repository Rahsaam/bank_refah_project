import React, { useState, useEffect, useRef } from 'react';
import type { IUser, UserRoleType } from '../types';
import type { ReactNode } from 'react';
import { AuthContext } from './AuthContext.ts';


const MOCK_USERS = {
  admin: { id: 1, username: 'admin', password: 'admin123', role: 'admin' as UserRoleType },
  editor: { id: 2, username: 'editor', password: 'editor123', role: 'editor' as UserRoleType },
  viewer: { id: 3, username: 'viewer', password: 'viewer123', role: 'viewer' as UserRoleType },
};


const createToken = (userId: number, role: UserRoleType): string => {
  const payload = {
    userId,
    role,
    exp: Date.now() + 5 * 60 * 1000,
    iat: Date.now(),
  };
  return btoa(JSON.stringify(payload));
};


const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token));
    return payload.exp < Date.now();
  } catch {
    return true;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const refreshIntervalRef = useRef<number | null>(null);


  const refreshToken = () => {
    if (!user) return;
    
    console.log('🔄 رفرش توکن در حال انجام...');
    const newToken = createToken(user.id, user.role);
    setToken(newToken);
    console.log('✅ توکن جدید ساخته شد');
  };


  useEffect(() => {
    if (user && token) {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      

      refreshIntervalRef.current = window.setInterval(() => {
        refreshToken();
      }, 4 * 60 * 1000);
      
      console.log('⏰ تایمر رفرش توکن تنظیم شد (هر ۴ دقیقه)');
    }
    
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token]);


  const login = async (username: string, password: string): Promise<boolean> => {
    const mockUser = Object.values(MOCK_USERS).find(
      (u) => u.username === username && u.password === password
    );

    if (!mockUser) {
      return false;
    }

    const newToken = createToken(mockUser.id, mockUser.role);
    setToken(newToken);
    setUser({
      id: mockUser.id,
      username: mockUser.username,
      role: mockUser.role,
    });

    return true;
  };


  const logout = () => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
    setToken(null);
    setUser(null);
  };


  const hasPermission = (action: 'view' | 'create' | 'edit' | 'delete'): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (user.role === 'editor') return action !== 'delete';
    if (user.role === 'viewer') return action === 'view';
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        hasPermission,
        isAuthenticated: !!user && !isTokenExpired(token || ''),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
