// cms-landing-page/src/routes.tsx
import { lazy, Suspense } from 'react';
import { createBrowserRouter, redirect } from 'react-router';
import RootLayout from './components/RootLayout';
import Loading from './components/Loading';

import { MfaLoader } from './router/loader/auth-loader';

import Error from './page/Error';

import OnboardingStepperLayout from './features/auth/register/OnboardingLayout';
import RegisterStepOne from './features/auth/register/register-one';
import RegisterStepTwo from './features/auth/register/register-two';
import VerifyEmail from './features/auth/register/email-verify';
import PageRequestForm from './features/page-request/page-request-form'; // Import PageRequestForm
import MfaSetup from './features/auth/register/mfaSetup';
import MfaVerify from './features/auth/register/verify-mfa';
import LoginOnboardingStepperLayout from './features/auth/login/LoginOnboardingLayout';
import LoginMFAVerify from './features/auth/login/login-verify';

const LandingPage = lazy(() => import('./page/index'));
const LoginPage = lazy(() => import('./features/auth/login'));

const withSuspense = (Component: React.ComponentType) => {
  return (
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  );
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: withSuspense(LandingPage),
        errorElement: <Error />,
      },
      {
        path: 'about',
        element: <div>About</div>,
        errorElement: <Error />,
      },

      {
        path: '/page-request',
        element: withSuspense(PageRequestForm),
        errorElement: <Error />,
      },
    ],
  },
  {
    path: 'auth',
    element: withSuspense(LoginOnboardingStepperLayout),
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: withSuspense(LoginPage),
      },
      {
        path: 'mfa',
        element: withSuspense(LoginMFAVerify),
        // loader: loginLoader,
      },
    ],
  },
  {
    path: '/onboarding',
    element: <OnboardingStepperLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: withSuspense(RegisterStepOne),
      },
      {
        path: 'register',
        element: withSuspense(RegisterStepOne),
      },
      {
        path: 'create-account',
        element: withSuspense(RegisterStepTwo),
      },
      {
        path: 'verify-email',
        element: withSuspense(VerifyEmail),
      },
      {
        path: 'mfa-setup',
        element: withSuspense(MfaSetup),
        loader: MfaLoader,
      },
      {
        path: 'mfa-verify',
        element: withSuspense(MfaVerify),
      },
      {
        path: '*',
        loader: () => redirect('/onboarding/register'),
      },
    ],
  },
  {
    path: '/logout',
    loader: () => redirect('/'),
  },
]);
