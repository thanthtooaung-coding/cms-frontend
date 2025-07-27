import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  mfaSetup: boolean;
  onboardingComplete: boolean;
  roles: string[];
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

type Actions = {
  setIsAuthenticated: (status: boolean) => void;
  setUser: (user: User | null) => void;
  updateMfaStatus: (status: boolean) => void;
  resetAuth: () => void;
  setEmail: (email: string) => void;
};

type AuthStore = AuthState & Actions;

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const useAuthStore = create<AuthStore>()(
  persist(
    immer((set) => ({
      ...initialState,

      setIsAuthenticated: (status: boolean) => {
        set((state) => {
          state.isAuthenticated = status;
        });
      },

      setEmail: (email: string) => {
        set((state) => {
          if (state.user) {
            state.user.email = email;
          }
        });
      },

      setUser: (user: User | null) => {
        set((state) => {
          state.user = {
            id: user?.id || '',
            email: user?.email || '',
            mfaSetup: user?.mfaSetup || false,
            onboardingComplete: user?.onboardingComplete || false,
            roles: user?.roles || [],
            emailVerified: user?.emailVerified || false,
          };
          state.isAuthenticated = user !== null;
        });
      },

      updateMfaStatus: (status: boolean) => {
        set((state) => {
          if (state.user) {
            state.user.mfaSetup = status;
          }
        });
      },

      resetAuth: () => {
        set(() => {
          localStorage.removeItem('authToken'); // Clear token from storage as well
          return initialState;
        });
      },
    })),
    {
      name: 'auth-credentials',
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user ? { ...state.user, roles: state.user.roles } : null,
      }),
    }
  )
);

export default useAuthStore;
