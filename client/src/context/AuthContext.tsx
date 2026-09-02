import React, { createContext, useContext, useState, useEffect } from 'react';
import { Admin } from '../types';
import { authApi } from '../api';
import { toast } from 'sonner';

interface AuthContextType {
  admin: Admin | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(() => {
    const cached = localStorage.getItem('admin_user');
    return cached ? JSON.parse(cached) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setAdmin(null);
        setIsLoading(false);
        return;
      }

      try {
        const data = await authApi.getMe();
        if (data.data?.admin) {
          setAdmin(data.data.admin);
          localStorage.setItem('admin_user', JSON.stringify(data.data.admin));
        }
      } catch (err) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        setAdmin(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const res = await authApi.login(credentials);
      if (res.data?.admin) {
        setAdmin(res.data.admin);
        localStorage.setItem('admin_user', JSON.stringify(res.data.admin));
        if (res.data.token) {
          localStorage.setItem('admin_token', res.data.token);
        }
        toast.success(`Welcome back, ${res.data.admin.name}!`);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed. Please check credentials.';
      toast.error(msg);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // Ignore logout API error
    } finally {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      setAdmin(null);
      toast.info('Logged out successfully');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isLoading,
        isAuthenticated: !!admin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
