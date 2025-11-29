import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import RootLayout from './components/RootLayout';
import HomePage from './Pages/HomePage';
import ProductsPage from './Pages/ProductsPage';
import { LoginAuthForm } from './features/auth/components/LoginAuthForm';
import { RegisterForm } from './features/auth/components/RegisterForm';

const ProductDetail = lazy(() => import('./Pages/ProductDetail'));
const CartPage = lazy(() => import('./Pages/CartPage'));
const CheckoutPage = lazy(() => import('./Pages/CheckoutPage'));
const OrdersPage = lazy(() => import('./Pages/OrdersPage'));
const OrderDetail = lazy(() => import('./Pages/OrderDetail'));
const ProfilePage = lazy(() => import('./Pages/ProfilePage'));

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<p>Loading...</p>}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/ecommerce/:tenantSlug/ecs-client',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'products',
        element: <ProductsPage />
      },
      {
        path: 'product/:id',
        element: withSuspense(ProductDetail)
      },
      {
        path: 'cart',
        element: withSuspense(CartPage)
      },
      {
        path: 'checkout',
        element: withSuspense(CheckoutPage)
      },
      {
        path: 'orders',
        element: withSuspense(OrdersPage)
      },
      {
        path: 'order/:id',
        element: withSuspense(OrderDetail)
      },
      {
        path: 'profile',
        element: withSuspense(ProfilePage)
      }
    ]
  },
  {
    path: '/ecommerce/:tenantSlug/ecs-client/login',
    element: <LoginAuthForm />
  },
  {
    path: '/ecommerce/:tenantSlug/ecs-client/register',
    element: <RegisterForm />
  },
  {
    path: '/ecs-client/:tenantSlug',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'products',
        element: <ProductsPage />
      },
      {
        path: 'product/:id',
        element: withSuspense(ProductDetail)
      },
      {
        path: 'cart',
        element: withSuspense(CartPage)
      },
      {
        path: 'checkout',
        element: withSuspense(CheckoutPage)
      },
      {
        path: 'orders',
        element: withSuspense(OrdersPage)
      },
      {
        path: 'order/:id',
        element: withSuspense(OrderDetail)
      },
      {
        path: 'profile',
        element: withSuspense(ProfilePage)
      }
    ]
  },
  {
    path: '/ecs-client/:tenantSlug/login',
    element: <LoginAuthForm />
  },
  {
    path: '/ecs-client/:tenantSlug/register',
    element: <RegisterForm />
  },
  {
    path: '/ecs-client',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />
      }
    ]
  }
]);
