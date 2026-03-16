"use client";

import { useState, useEffect, useCallback } from "react";
import { AuthSession, User } from "@/types";
import * as auth from "@/lib/auth";

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setSession(auth.getSession());
    setUser(auth.getCurrentUser());
  }, []);

  useEffect(() => {
    refresh();
    setLoading(false);
  }, [refresh]);

  const login = (email: string, password: string) => {
    const result = auth.login(email, password);
    if (result.success) refresh();
    return result;
  };

  const register = (username: string, email: string, password: string) => {
    const result = auth.register(username, email, password);
    if (result.success) refresh();
    return result;
  };

  const logout = () => {
    auth.logout();
    setSession(null);
    setUser(null);
  };

  return {
    session,
    user,
    loading,
    isAuthenticated: !!session?.isAuthenticated,
    login,
    register,
    logout,
    refresh,
  };
}
