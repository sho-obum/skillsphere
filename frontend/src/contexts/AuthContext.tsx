import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../types';
import apiService from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        try {
          // Ensure API service has the tokens first
          apiService.refreshTokensFromStorage();
          // Try to refresh token to validate and get user info
          await apiService.refreshAccessToken();
          // If successful, we need to decode the token or make a call to get user info
          // For now, we'll store user info in localStorage as well
          const userInfo = localStorage.getItem('user_info');
          if (userInfo) {
            setUser(JSON.parse(userInfo));
          }
        } catch (error) {
          console.error('Auth initialization failed:', error);
          // Clear invalid tokens
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user_info');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      const authResponse = await apiService.login(email, password);
      setUser(authResponse.user);
      // Store user info for persistence
      localStorage.setItem('user_info', JSON.stringify(authResponse.user));
      // Ensure API service has the latest tokens
      apiService.refreshTokensFromStorage();
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, role: string = 'customer'): Promise<void> => {
    try {
      setLoading(true);
      await apiService.signup(name, email, password, role);
      // After successful signup, automatically log in
      await login(email, password);
    } catch (error: any) {
      setLoading(false);
      throw new Error(error.response?.data?.error || 'Signup failed');
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user_info');
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
