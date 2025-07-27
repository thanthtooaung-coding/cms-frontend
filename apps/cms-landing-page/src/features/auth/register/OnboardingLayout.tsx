import {
  Building2,
  Check,
  User,
  Mail,
  Shield,
  CheckCircle,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

import { useLocation, Outlet, useNavigate } from 'react-router';
import { Button } from '@cms/ui/components/button';
import { Card } from '@cms/ui/components/card';
import { Badge } from '@cms/ui/components/badge';
import { cn } from '@cms/ui/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { FetchOwnerQuery } from '@cms/data';

const onboardingSteps = [
  {
    label: 'Your Details',
    description: 'Please provide your name and email address',
    path: '/onboarding/register',
    icon: User,
  },
  {
    label: 'Create Account',
    description: 'Choose your role and create your account',
    path: '/onboarding/create-account',
    icon: Building2,
  },
  {
    label: 'Verify Email',
    description: 'Check your inbox for a verification link',
    path: '/onboarding/verify-email',
    icon: Mail,
  },
  {
    label: 'Two Factor Setup',
    description: 'Set up Two Factor Authentication for security',
    path: '/onboarding/mfa-setup',
    icon: Shield,
  },
  {
    label: 'Verify Account',
    description: 'Verify your account with two factor',
    path: '/onboarding/mfa-verify',
    icon: CheckCircle,
  },
];

const RegistrationOnboardingLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const activeStepIndex = onboardingSteps.findIndex((step) =>
    location.pathname.startsWith(step.path)
  );

  const handleStepClick = (index: number) => {
    if (index <= activeStepIndex) {
      navigate(onboardingSteps[index].path);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-20 to-purple-20">
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex w-110 bg-white/80 backdrop-blur-sm border-r border-slate-200/60 flex-col">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="relative">
                <div className="bg-gradient-to-br from-slate-900 to-slate-700 p-2.5 rounded-xl shadow-lg">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="h-3 w-3 text-yellow-500" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">ContentFlow</h1>
                <p className="text-xs text-slate-600 -mt-0.5">Multi-Tenant CMS</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Create Your Account</h2>
              <p className="text-slate-600">Follow these steps to set up your new account</p>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                <span>Progress</span>
                <span>
                  {activeStepIndex + 1} of {onboardingSteps.length}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((activeStepIndex + 1) / onboardingSteps.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-3 flex-1">
              {onboardingSteps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === activeStepIndex;
                const isCompleted = index < activeStepIndex;

                return (
                  <div
                    key={step.path}
                    className={cn(
                      'relative group transition-all duration-200',
                      index <= activeStepIndex && 'cursor-pointer'
                    )}
                    onClick={() => handleStepClick(index)}
                  >
                    <Card
                      className={cn(
                        'p-4 border-2 transition-all duration-200',
                        isActive && 'border-indigo-500 bg-indigo-50/50 shadow-md',
                        isCompleted && 'border-green-500 bg-green-50/50',
                        !isActive && !isCompleted && 'border-slate-200 hover:border-slate-300',
                        index <= activeStepIndex && 'hover:shadow-sm'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            'w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0',
                            isCompleted && 'bg-green-500 text-white',
                            isActive && 'bg-indigo-500 text-white',
                            !isActive && !isCompleted && 'bg-slate-200 text-slate-600'
                          )}
                        >
                          {isCompleted ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Icon className="w-4 h-4" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                              className={cn(
                                'font-semibold text-sm transition-colors duration-200',
                                isActive && 'text-indigo-700',
                                isCompleted && 'text-green-700',
                                !isActive && !isCompleted && 'text-slate-700'
                              )}
                            >
                              {step.label}
                            </h3>
                            {isCompleted && (
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-700 text-xs px-2 py-0"
                              >
                                Done
                              </Badge>
                            )}
                            {isActive && (
                              <Badge
                                variant="secondary"
                                className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0"
                              >
                                Active
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {step.description}
                          </p>
                        </div>

                        {index <= activeStepIndex && (
                          <ChevronRight
                            className={cn(
                              'w-4 h-4 transition-all duration-200 opacity-0 group-hover:opacity-100 flex-shrink-0',
                              isActive && 'text-indigo-500',
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

          <div className="p-8 border-t border-slate-200/60">
            <Button
              onClick={() => navigate('/auth')}
              variant="outline"
              className="w-full border-slate-300 hover:bg-slate-50 transition-colors duration-200"
            >
              Already have an account? Sign In
            </Button>
            <p className="text-xs text-slate-500 text-center mt-3">
              Need help?{' '}
              <a href="#" className="text-indigo-600 hover:underline">
                Contact Support
              </a>
            </p>
          </div>
        </aside>

        <main className="flex-1 flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full opacity-20 blur-3xl" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-tr from-blue-100 to-indigo-100 rounded-full opacity-15 blur-3xl" />
          </div>

          <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
            <div className="w-full max-w-lg">
              <Outlet />
            </div>
          </div>

          <div className="lg:hidden p-6 bg-white/80 backdrop-blur-sm border-t border-slate-200/60">
            <div className="flex items-center justify-center gap-2 mb-4">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    'h-2 rounded-full transition-all duration-300',
                    index === activeStepIndex && 'bg-indigo-500 w-8',
                    index < activeStepIndex && 'bg-green-500 w-2',
                    index > activeStepIndex && 'bg-slate-300 w-2'
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

export default RegistrationOnboardingLayout;
