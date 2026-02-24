import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL, API_ENDPOINTS, getApiUrl } from '../config';

interface User {
  id: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  firstName: string;
  lastName: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, role: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor to add token to requests
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await AsyncStorage.removeItem('token');
      // You might want to trigger a logout or redirect to login here
    }
    return Promise.reject(error);
  }
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('AuthProvider - Initial load');
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      console.log('AuthProvider - Token exists:', !!storedToken);
      
      if (!storedToken) {
        console.log('AuthProvider - No token found, setting isLoading to false');
        setIsLoading(false);
        return;
      }

      console.log('AuthProvider - Attempting to load user with token');
      setToken(storedToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

      const response = await api.get(API_ENDPOINTS.AUTH.ME);
      console.log('AuthProvider - User data received:', response.data);
      
      const userData = response.data.user || response.data;
      setUser({ ...userData, token: storedToken });
    } catch (error: any) {
      console.error('AuthProvider - Error loading user:', error);
      if (error.response) {
        console.error('AuthProvider - Error response:', error.response.data);
        console.error('AuthProvider - Error status:', error.response.status);
      }
      await AsyncStorage.removeItem('token');
      setError('Failed to load user data. Please login again.');
    } finally {
      console.log('AuthProvider - Setting isLoading to false');
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      console.log('Attempting login for:', email);
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });
      console.log('Login response:', response.data);
      const { token, user: userData } = response.data;
      
      // Store token in AsyncStorage
      await AsyncStorage.setItem('token', token);
      
      // Store user data with token
      setUser({ ...userData, token });
      setToken(token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        setError(error.response.data.message || 'Login failed');
      } else if (error.request) {
        console.error('Network error:', error.request);
        setError('Network error - please check your connection');
      } else {
        console.error('Other error:', error.message);
        setError('An unexpected error occurred');
      }
      throw error;
    }
  };

  const signup = async (email: string, password: string, role: string, firstName: string, lastName: string) => {
    try {
      setError(null);
      console.log('Attempting signup for:', email);
      const response = await api.post(API_ENDPOINTS.AUTH.SIGNUP, {
        email,
        password,
        role,
        firstName,
        lastName,
      });
      console.log('Signup response:', response.data);
      const { token, user: userData } = response.data;
      
      // Store token in AsyncStorage
      await AsyncStorage.setItem('token', token);
      
      // Store user data with token
      setUser({ ...userData, token });
      setToken(token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        setError(error.response.data.message || 'Signup failed');
      } else if (error.request) {
        console.error('Network error:', error.request);
        setError('Network error - please check your connection');
      } else {
        console.error('Other error:', error.message);
        setError('An unexpected error occurred');
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('AuthProvider: Logging out...');
      // Clear token from storage
      await AsyncStorage.removeItem('token');
      // Clear axios default headers
      api.defaults.headers.common['Authorization'] = '';
      // Clear state
      setUser(null);
      setToken(null);
      console.log('AuthProvider: Logout successful');
    } catch (error) {
      console.error('AuthProvider: Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 