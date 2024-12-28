import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  authToken: string | null;
  setAuthToken: (token: string | null) => void;
  logout: () => void;
}

const defaultAuthContext: AuthContextType = {
  authToken: null,
  setAuthToken: () => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authToken, setAuthTokenState] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        setAuthTokenState(token);
      } catch (error) {
        console.error('Failed to load auth token', error);
      }
    };
    loadToken();
  }, []);

  const setAuthToken = async (token: string | null) => {
    try {
      if (token) {
        await AsyncStorage.setItem('authToken', token);
      } else {
        await AsyncStorage.removeItem('authToken');
      }
      setAuthTokenState(token);
    } catch (error) {
      console.error('Failed to set auth token', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      setAuthTokenState(null);
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
