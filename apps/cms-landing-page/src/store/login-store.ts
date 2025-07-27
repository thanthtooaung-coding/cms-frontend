import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { LoginStore } from '../types/auth';

interface LoginStateData {
  email: string;
  password: string;
  mfaSecret: string;
  mfaCode: string;
  mfaEnabled: boolean;
  userId: string;
}

const initialData: LoginStateData = {
  email: '',
  password: '',
  mfaSecret: '',
  mfaCode: '',
  mfaEnabled: false,
  userId: '',
};

export const useLoginStore = create<LoginStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        currentStep: 1,
        data: initialData,
        isLoading: false,
        error: null,

        setCurrentStep: (step: number) => {
          set({ currentStep: step, error: null }, false, 'setCurrentStep');
        },

        clearState: () => {
          set(
            {
              currentStep: 1,
              data: initialData,
              isLoading: false,
              error: null,
            },
            false,
            'clearState'
          );
        },

        updateData: (newData: Partial<LoginStateData>) => {
          set(
            (state) => ({
              data: { ...state.data, ...newData },
              error: null,
            }),
            false,
            'updateData'
          );
        },

        nextStep: () => {
          const { currentStep } = get();
          console.log(`Current Step: ${currentStep}`);
          if (currentStep < 6) {
            set({ currentStep: currentStep + 1, error: null }, false, 'nextStep');
          }
        },

        prevStep: () => {
          const { currentStep } = get();
          if (currentStep > 1) {
            set({ currentStep: currentStep - 1, error: null }, false, 'prevStep');
          }
        },

        setLoading: (loading: boolean) => {
          set({ isLoading: loading }, false, 'setLoading');
        },

        setError: (error: string | null) => {
          set({ error }, false, 'setError');
        },

        reset: () => {
          set(
            {
              currentStep: 1,
              data: initialData,
              isLoading: false,
              error: null,
            },
            false,
            'reset'
          );
        },

        // API actions (mock implementations - replace with real API calls)
        Login: async (data: { userId: string }) => {
          try {
            get().updateData({
              userId: data.userId,
            });
            get().nextStep();
          } catch (error) {
            set(
              { error: error instanceof Error ? error.message : 'An error occurred' },
              false,
              'Login/error'
            );
          } finally {
            set({ isLoading: false }, false, 'Login/end');
          }
        },

        setupMFA: async (code: string) => {
          set({ isLoading: true, error: null }, false, 'setupMFA/start');

          try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Mock validation
            if (code.length !== 6) {
              throw new Error('Invalid MFA code');
            }

            get().updateData({
              mfaCode: code,
              mfaEnabled: true,
            });
            get().nextStep();
          } catch (error) {
            set(
              { error: error instanceof Error ? error.message : 'An error occurred' },
              false,
              'setupMFA/error'
            );
          } finally {
            set({ isLoading: false }, false, 'setupMFA/end');
          }
        },
      }),
      {
        name: 'login-store',

        partialize: (state) => ({
          currentStep: state.currentStep,
          data: state.data,
        }),
      }
    ),
    {
      name: 'login-store',
    }
  )
);
