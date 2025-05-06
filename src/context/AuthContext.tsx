import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import * as supabaseClient from '../utils/supabaseClient';

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    supabaseClient.getCurrentUser().then(user => {
      setState(prev => ({ ...prev, user, loading: false }));
    });
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const user = await supabaseClient.signUp(email, password);
      setState({ user, loading: false, error: null });
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: (error as Error).message,
        loading: false 
      }));
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const user = await supabaseClient.signIn(email, password);
      setState({ user, loading: false, error: null });
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: (error as Error).message,
        loading: false 
      }));
    }
  };

  const signOut = async () => {
    try {
      await supabaseClient.signOut();
      setState({ user: null, loading: false, error: null });
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: (error as Error).message,
        loading: false 
      }));
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, signUp, signIn, signOut }}>
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