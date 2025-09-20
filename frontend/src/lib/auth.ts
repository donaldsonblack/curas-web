import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from './api';

// This is a MOCK auth provider for MVP development.
// It will be replaced with a real AWS Cognito implementation.

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data based on the project brief
const MOCK_USERS: Record<string, User> = {
  'num@example.org': {
    id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    email: 'num@example.org',
    displayName: 'Alex Smith (NUM)',
    role: 'NUM',
  },
  'nurse@example.org': {
    id: 'b2c3d4e5-f6a7-8901-2345-67890abcdef0',
    email: 'nurse@example.org',
    displayName: 'Ben Carter (Nurse)',
    role: 'NURSE',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for an existing session on app load
    try {
      const storedUserEmail = localStorage.getItem('mockUserEmail');
      if (storedUserEmail && MOCK_USERS[storedUserEmail]) {
        setUser(MOCK_USERS[storedUserEmail]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(res => setTimeout(res, 500));
    const foundUser = MOCK_USERS[email];
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('mockUserEmail', email);
    } else {
      throw new Error('User not found');
    }
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(res => setTimeout(res, 500));
    setUser(null);
    localStorage.removeItem('mockUserEmail');
    setIsLoading(false);
  };

  const value = { user, isLoading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to access the auth context.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
