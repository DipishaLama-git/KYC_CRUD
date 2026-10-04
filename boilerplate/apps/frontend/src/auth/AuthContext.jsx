import { createContext, useContext, useMemo, useState } from 'react';
import { api } from '../lib/api';

const TOKEN_STORAGE_KEY = 'kyc_access_token';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  });

  const login = async (username, password) => {
    const { accessToken } = await api.login(username, password);
    setToken(accessToken);
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
    } catch {
      // localStorage unavailable (e.g. private browsing) — session stays in-memory only
    }
  };

  const register = async (payload) => {
    await api.register(payload);
    await login(payload.username, payload.password);
  };

  const logout = () => {
    setToken(null);
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const value = useMemo(
    () => ({ token, isAuthenticated: token !== null, login, register, logout }),
    [token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(){
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}