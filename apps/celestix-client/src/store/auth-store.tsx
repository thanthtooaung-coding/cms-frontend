import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = {
  id: string;
  name: string;
  email: string;
  tenantId: string;
  role: string;
  roleName: string;
};

type AuthState = {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
};

export const useAuthDataStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => {
        set({ user });
        if (user) {
          // Don't overwrite bms_token here - it's set in LoginForm
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('tenant_id', user.tenantId);
        }
      },
      clearUser: () => {
        set({ user: null });
        localStorage.removeItem('bms_token');
        localStorage.removeItem('user');
        localStorage.removeItem('tenant_id');
      },
    }),
    {
      name: 'bms-auth-storage',
    }
  )
);


