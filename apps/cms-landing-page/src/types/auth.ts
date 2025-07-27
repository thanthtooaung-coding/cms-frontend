export interface RegistrationStep {
  id: number;
  label: string;
  description: string;
  path: string;
}

interface LoginStateData {
  email: string;
  password: string;
  mfaSecret: string;
  mfaCode: string;
  mfaEnabled: boolean;
  userId: string; // Added userId to match the registration data structure
}

export interface RegistrationData {
  // Step 1: Your details
  name: string;
  email: string;

  // Step 2: Create Account
  username: string;
  password: string;
  confirmPassword: string;
  role: string;
  userId: string; // Assuming this is a typo and should be userId
  // Step 3: Email verification
  verificationCode: string;
  emailVerified: boolean;

  // Step 4: MFA Setup
  mfaTokenID: string;
  mfaEnabled: boolean;
  mfaSecret: string;
  mfaCode: string;

  // Step 5: Success
  accountCreated: boolean;
}

export interface RegistrationStore {
  // State
  currentStep: number;
  data: RegistrationData;
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrentStep: (step: number) => void;
  updateData: (data: Partial<RegistrationData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  clearState: () => void;

  // API actions (for future use)
  submitStepOne: (data: { name: string; email: string }) => Promise<void>;
  submitStepTwo: (data: {
    username: string;
    password: string;
    userId: string;
    confirmPassword: string;
    role: string;
  }) => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  setupMFA: (code: string) => Promise<void>;
}

export interface LoginStore {
  currentStep: number;
  data: LoginStateData;
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrentStep: (step: number) => void;
  updateData: (data: Partial<LoginStateData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  clearState: () => void;
  Login: (data: { userId: string }) => Promise<void>;

  setupMFA: (code: string) => Promise<void>;
}
