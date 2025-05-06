import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthUser {
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  signUp: (email: string, password: string) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';

function getStoredUsers(): { email: string; password: string }[] {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}
function setStoredUsers(users: { email: string; password: string }[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function getCurrentUser(): AuthUser | null {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
}
function setCurrentUser(user: AuthUser | null) {
  if (user) localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(CURRENT_USER_KEY);
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(getCurrentUser());

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const signUp = async (email: string, password: string) => {
    const users = getStoredUsers();
    if (users.find(u => u.email === email)) {
      return '이미 가입된 이메일입니다.';
    }
    users.push({ email, password });
    setStoredUsers(users);
    setCurrentUser({ email });
    setUser({ email });
    return null;
  };

  const signIn = async (email: string, password: string) => {
    const users = getStoredUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) {
      return '이메일 또는 비밀번호가 올바르지 않습니다.';
    }
    setCurrentUser({ email });
    setUser({ email });
    return null;
  };

  const signOut = () => {
    setCurrentUser(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('AuthContext 사용 오류');
  return ctx;
} 