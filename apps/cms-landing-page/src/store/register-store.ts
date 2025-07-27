import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { RegistrationData, RegistrationStore } from '../types/auth';

const initialData: RegistrationData = {
  name: '',
  email: '',
  username: '',
  password: '',
  userId: '',
  mfaTokenID: '',
  confirmPassword: '',
  role: '',
  verificationCode: '',
  emailVerified: false,
  mfaEnabled: false,
  mfaSecret: '',
  mfaCode: '',
  accountCreated: false,
};

export const useRegistrationStore = create<RegistrationStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        currentStep: 1,
        data: initialData,
        isLoading: false,
        error: null,

        // Basic actions
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

        updateData: (newData: Partial<RegistrationData>) => {
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
          if (currentStep < 7) {
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

        submitStepOne: async (stepData: { name: string; email: string }) => {
          set({ isLoading: true, error: null, currentStep: 2 }, false, 'submitStepOne/start');

          try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            get().updateData(stepData);
            get().nextStep();
          } catch (error) {
            set(
              { error: error instanceof Error ? error.message : 'An error occurred' },
              false,
              'submitStepOne/error'
            );
          } finally {
            set({ isLoading: false }, false, 'submitStepOne/end');
          }
        },

        submitStepTwo: async (stepData: {
          username: string;
          password: string;
          userId: string;
          confirmPassword: string;
          role: string;
        }) => {
          set({ isLoading: true, error: null }, false, 'submitStepTwo/start');

          try {
            get().updateData(stepData);
            get().nextStep();
          } catch (error) {
            set(
              { error: error instanceof Error ? error.message : 'An error occurred' },
              false,
              'submitStepTwo/error'
            );
          } finally {
            set({ isLoading: false }, false, 'submitStepTwo/end');
          }
        },

        verifyEmail: async (code: string) => {
          set({ isLoading: true, error: null }, false, 'verifyEmail/start');

          try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Mock validation
            if (code !== '123456') {
              throw new Error('Invalid verification code');
            }

            get().updateData({ verificationCode: code, emailVerified: true });
            get().nextStep();
          } catch (error) {
            set(
              { error: error instanceof Error ? error.message : 'An error occurred' },
              false,
              'verifyEmail/error'
            );
          } finally {
            set({ isLoading: false }, false, 'verifyEmail/end');
          }
        },

        setupMFA: async () => {
          set({ isLoading: true, error: null }, false, 'setupMFA/start');

          try {
            // Simulate API call
            get().updateData({
              mfaEnabled: true,
              accountCreated: true,
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
        name: 'registration-store',
        // Only persist the data and currentStep, not loading states
        partialize: (state) => ({
          currentStep: state.currentStep,
          data: state.data,
        }),
      }
    ),
    {
      name: 'registration-store',
    }
  )
);
