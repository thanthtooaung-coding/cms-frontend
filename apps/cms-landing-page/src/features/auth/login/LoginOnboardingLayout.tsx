'use client';

import { Check, Shield, User, ChevronRight } from 'lucide-react';
import type React from 'react';
import { useEffect } from 'react';
import { useLocation, Outlet, useNavigate } from 'react-router';
import { Button } from '@cms/ui/components/button';
import { Card } from '@cms/ui/components/card';
import { Badge } from '@cms/ui/components/badge';
import { cn } from '@cms/ui/lib/utils';

const onboardingSteps = [
  {
    label: 'Account Login',
    description: 'Enter your credentials to access your account',
    path: '/auth/login',
    icon: User,
  },
  {
    label: 'Two-Factor Authentication',
    description: 'Secure your account with additional verification',
    path: '/auth/mfa',
    icon: Shield,
  },
];

interface LoginOnboardingStepperLayoutProps {
  currentStep?: number;
  setCurrentStep?: (step: number) => void;
}

const LoginOnboardingStepperLayout: React.FC<LoginOnboardingStepperLayoutProps> = ({
  currentStep = 1,
  setCurrentStep = () => {},
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentStepData = onboardingSteps.find((step) => location.pathname === step.path);
  const activeStepIndex = currentStepData ? onboardingSteps.indexOf(currentStepData) : 0;

  useEffect(() => {
    if (currentStepData && currentStep !== activeStepIndex + 1) {
      setCurrentStep(activeStepIndex + 1);
    }
  }, [location.pathname, currentStepData, activeStepIndex, currentStep, setCurrentStep]);

  const handleStepClick = (index: number) => {
    if (index <= activeStepIndex) {
      navigate(onboardingSteps[index].path);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-96 bg-white/80 backdrop-blur-sm border-r border-slate-200/60 flex-col">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-slate-800">CMS Portal</span>
            </div>

            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome back</h1>
              <p className="text-slate-600">
                Please complete the steps below to access your account
              </p>
            </div>

            {/* Progress indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                <span>Progress</span>
                <span>
                  {activeStepIndex + 1} of {onboardingSteps.length}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((activeStepIndex + 1) / onboardingSteps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-4">
              {onboardingSteps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === activeStepIndex;
                const isCompleted = index < activeStepIndex;
                const isClickable = index <= activeStepIndex;

                return (
                  <div
                    key={step.path}
                    className={cn(
                      'relative group transition-all duration-200',
                      isClickable && 'cursor-pointer'
                    )}
                    onClick={() => handleStepClick(index)}
                  >
                    <Card
                      className={cn(
                        'p-4 border-2 transition-all duration-200',
                        isActive && 'border-blue-500 bg-blue-50/50 shadow-md',
                        isCompleted && 'border-green-500 bg-green-50/50',
                        !isActive && !isCompleted && 'border-slate-200 hover:border-slate-300',
                        isClickable && 'hover:shadow-sm'
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={cn(
                            'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200',
                            isCompleted && 'bg-green-500 text-white',
                            isActive && 'bg-blue-500 text-white',
                            !isActive && !isCompleted && 'bg-slate-200 text-slate-600'
                          )}
                        >
                          {isCompleted ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            <Icon className="w-5 h-5" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                              className={cn(
                                'font-semibold transition-colors duration-200',
                                isActive && 'text-blue-700',
                                isCompleted && 'text-green-700',
                                !isActive && !isCompleted && 'text-slate-700'
                              )}
                            >
                              {step.label}
                            </h3>
                            {isCompleted && (
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-700 text-xs"
                              >
                                Complete
                              </Badge>
                            )}
                            {isActive && (
                              <Badge
                                variant="secondary"
                                className="bg-blue-100 text-blue-700 text-xs"
                              >
                                Current
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {step.description}
                          </p>
                        </div>

                        {isClickable && (
                          <ChevronRight
                            className={cn(
                              'w-4 h-4 transition-all duration-200 opacity-0 group-hover:opacity-100',
                              isActive && 'text-blue-500',
                              isCompleted && 'text-green-500',
                              !isActive && !isCompleted && 'text-slate-400'
                            )}
                          />
                        )}
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom section */}
          <div className="mt-auto p-8 border-t border-slate-200/60">
            <Button
              onClick={() => navigate('/onboarding/register')}
              variant="outline"
              className="w-full border-slate-300 hover:bg-slate-50 transition-colors duration-200"
            >
              Create New Account
            </Button>
            <p className="text-xs text-slate-500 text-center mt-3">
              Need help?{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Contact Support
              </a>
            </p>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col">
          <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
            <div className="w-full max-w-md">
              <Outlet />
            </div>
          </div>

          {/* Mobile progress indicator */}
          <div className="lg:hidden p-6 bg-white/80 backdrop-blur-sm border-t border-slate-200/60">
            <div className="flex items-center justify-center gap-2 mb-4">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all duration-300',
                    index === activeStepIndex && 'bg-blue-500 w-6',
                    index < activeStepIndex && 'bg-green-500',
                    index > activeStepIndex && 'bg-slate-300'
                  )}
                />
              ))}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-700">
                Step {activeStepIndex + 1} of {onboardingSteps.length}:{' '}
                {onboardingSteps[activeStepIndex]?.label}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {onboardingSteps[activeStepIndex]?.description}
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LoginOnboardingStepperLayout;
