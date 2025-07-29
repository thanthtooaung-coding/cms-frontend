import { createBrowserRouter } from 'react-router';
import { lazy, Suspense } from 'react';
import { AuthenticatedLayout } from './components/Layout/authenticated-layout';

import LoginPage from './features/auth/components/LoginPage';

import userListing from './features/report/components/userListing';
import { OwnerLoader, PageLoader, PageRequestLoader } from './router/loader/data-loader';
import ErrorPage from './page/Error';

const Dashboard = lazy(() => import('./features/dashboard/app'));
const Owner = lazy(() => import('./features/owner/app'));
const PageRequest = lazy(() => import('./features/page-request/app'));

const PageList = lazy(() => import('./features/page-list/app'));

const Report = lazy(() => import('./features/report/app'));

// Wrapper component for lazy loading with suspense
const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<p>Loading...</p>}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthenticatedLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        index: true,
        element: withSuspense(Dashboard),
      },
      {
        path: '/owner',
        children: [
          {
            path: '',
            index: true,
            element: withSuspense(Owner),
            loader: OwnerLoader,
          },
          {
            path: 'create',
            element: <p>New Owner</p>,
          },
          {
            path: ':id/edit',
            element: <p>Edit Owner</p>,
          },
        ],
      },
      {
        path: '/page-request',
        element: withSuspense(PageRequest),
        loader: PageRequestLoader,
      },
      {
        path: '/report',
        element: withSuspense(Report),
      },
      {
        path: '/userListing',
        element: withSuspense(userListing),
      },
      {
        path: 'page-list',
        element: withSuspense(PageList),
        loader: PageLoader,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />, // Login is not lazy-loaded as it's usually needed immediately
  },
  {
    path: '/logout',
  },
]);
