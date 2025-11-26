import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
};

export const useAuthDataStore = create<AuthState>()(
  persist(
    immer((set, get) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => {
        set({ token });
        if (token) {
          localStorage.setItem('auth_token', token);
        } else {
          localStorage.removeItem('auth_token');
        }
      },
      logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem('auth_token');
      },
      isAuthenticated: () => {
        const state = get();
        return state.user !== null && state.token !== null;
      },
    })),
    { name: 'auth-storage', storage: createJSONStorage(() => sessionStorage) }
  )
);
