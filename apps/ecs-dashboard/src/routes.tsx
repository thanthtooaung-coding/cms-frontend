import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthenticatedLayout } from './components/Layout/authenticated-layout';
import { LoginAuthForm } from './features/auth/components/LoginAuthForm';

const Dashboard = lazy(() => import('./features/dashboard/app'));
const ProductsApp = lazy(() => import('./features/products/app'));
const OrdersApp = lazy(() => import('./features/orders/app'));
const RefundsApp = lazy(() => import('./features/refunds/app'));
const PromotionsApp = lazy(() => import('./features/promotions/app'));
const ReviewsApp = lazy(() => import('./features/reviews/app'));
const UsersApp = lazy(() => import('./features/users/app'));

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<p>Loading...</p>}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/ecommerce/:tenantSlug/ecs-dashboard',
    element: <AuthenticatedLayout />,
    children: [
      {
        index: true,
        element: withSuspense(Dashboard),
      },
      {
        path: 'products',
        element: withSuspense(ProductsApp),
      },
      {
        path: 'orders',
        element: withSuspense(OrdersApp),
      },
      {
        path: 'refunds',
        element: withSuspense(RefundsApp),
      },
      {
        path: 'promotions',
        element: withSuspense(PromotionsApp),
      },
      {
        path: 'reviews',
        element: withSuspense(ReviewsApp),
      },
      {
        path: 'users',
        element: withSuspense(UsersApp),
      },
    ],
  },
  {
    path: '/ecommerce/:tenantSlug/ecs-dashboard/login',
    element: <LoginAuthForm />,
  },
  {
    path: '/ecs-dashboard/:tenantSlug',
    element: <AuthenticatedLayout />,
    children: [
      {
        index: true,
        element: withSuspense(Dashboard),
      },
      {
        path: 'products',
        element: withSuspense(ProductsApp),
      },
      {
        path: 'orders',
        element: withSuspense(OrdersApp),
      },
      {
        path: 'refunds',
        element: withSuspense(RefundsApp),
      },
      {
        path: 'promotions',
        element: withSuspense(PromotionsApp),
      },
      {
        path: 'reviews',
        element: withSuspense(ReviewsApp),
      },
      {
        path: 'users',
        element: withSuspense(UsersApp),
      },
    ],
  },
  {
    path: '/ecs-dashboard/:tenantSlug/login',
    element: <LoginAuthForm />,
  },
]);
