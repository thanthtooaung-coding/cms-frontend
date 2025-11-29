'use client';

import type React from 'react';
import { Outlet } from 'react-router';

interface LoginOnboardingStepperLayoutProps {
  currentStep?: number;
  setCurrentStep?: (step: number) => void;
}

const LoginOnboardingStepperLayout: React.FC<LoginOnboardingStepperLayoutProps> = ({
  currentStep = 1,
  setCurrentStep = () => {},
}) => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="flex min-h-screen">
        {/* Main content */}
        <main className="flex-1 flex flex-col">
          <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
            <div className="w-full max-w-md">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LoginOnboardingStepperLayout;
