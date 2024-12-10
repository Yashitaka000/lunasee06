import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../firebase/config';
import { loginUser, registerUser, logoutUser, AuthError } from '../firebase/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setState(prev => ({
        ...prev,
        user,
        loading: false,
        error: null
      }));
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await loginUser(email, password);
    } catch (error) {
      setState(prev => ({ ...prev, error: error as AuthError }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await registerUser(email, password);
    } catch (error) {
      setState(prev => ({ ...prev, error: error as AuthError }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const logout = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await logoutUser();
    } catch (error) {
      setState(prev => ({ ...prev, error: error as AuthError }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout
  };
}