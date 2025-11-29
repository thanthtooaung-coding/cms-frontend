import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type User = {
  id: string;
  name: string;
  email: string;
  tenantId?: string;
  role?: string;
  roleName?: string;
};

type AuthState = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
};

export const useAuthDataStore = create<AuthState>()(
  persist(
    immer((set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => {
        set({ user: null });
        localStorage.removeItem('lms_token');
        localStorage.removeItem('tenant_id');
        // Keep tenant_slug in localStorage so it can be used after logout
        // It will be preserved in the URL path anyway
      },
      isAuthenticated: () => {
        const state = get();
        return state.user !== null;
      },
    })),
    { name: 'auth-storage', storage: createJSONStorage(() => sessionStorage) }
  )
);
