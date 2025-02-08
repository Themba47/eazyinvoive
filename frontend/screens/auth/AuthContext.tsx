import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

interface AuthContextType {
  authToken: string | null;
  userId: string | null;
  companyId: string | null;
  setAuthToken: (token: string | null) => void;
  setUserId: (userId: string | null) => void;
  setCompanyId: (userId: string | null) => void;
  logout: () => void;
}

const defaultAuthContext: AuthContextType = {
  authToken: null,
  userId: null,
  companyId: null,
  setAuthToken: () => {},
  setUserId: () => {},
  setCompanyId: () => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authToken, setAuthTokenState] = useState<string | null>(null);
  const [userId, setUserIdState] = useState<string | null>(null);
  const [companyId, setCompanyIdState] = useState<string | null>(null);

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const storedUserId = await AsyncStorage.getItem('userId');
        const storeCompanyId = await AsyncStorage.getItem('companyId')
        setAuthTokenState(token);
        setUserIdState(storedUserId);
        setCompanyIdState(storeCompanyId)
      } catch (error) {
        console.error('Failed to load auth data', error);
      }
    };
    loadAuthData();
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

  const setUserId = async (userId: string | null) => {
    try {
      if (userId) {
        await AsyncStorage.setItem('userId', userId);
      } else {
        await AsyncStorage.removeItem('userId');
      }
      setUserIdState(userId);
    } catch (error) {
      console.error('Failed to set user ID', error);
    }
  };

  const setCompanyId = async (companyId: string | null) => {
    try {
      if (companyId) {
        await AsyncStorage.setItem('companyId', companyId);
      } else {
        await AsyncStorage.removeItem('companyId');
      }
      setCompanyIdState(companyId);
    } catch (error) {
      console.error('Failed to set company ID', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('companyId');
      setAuthTokenState(null);
      setUserIdState(null);
      setCompanyIdState(null)
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  return (
    <AuthContext.Provider value={{ authToken, userId, companyId, setAuthToken, setUserId, setCompanyId, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

