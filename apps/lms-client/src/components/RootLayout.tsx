import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import Header from './LandingPage/Header';
import Footer from './LandingPage/Footer';
import SubNavigation from './SubNavigation';
import { TenantProvider } from '../context/TenantContext';
import { useAuthDataStore } from '../store/auth-store';

const RootLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { tenantSlug } = useParams<{ tenantSlug?: string }>();
  const { user } = useAuthDataStore();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('lms_token');
    const isLoginPage = pathname.includes('/login');
    const isRegisterPage = pathname.includes('/register');

    // If no token and not on login/register page, redirect to login
    if (!token && !user && !isLoginPage && !isRegisterPage) {
      const loginPath = tenantSlug ? `/lms/${tenantSlug}/login` : '/login';
      navigate(loginPath, { replace: true });
    }
  }, [pathname, user, tenantSlug, navigate]);

  // Don't render layout if redirecting to login
  const token = localStorage.getItem('lms_token');
  const isLoginPage = pathname.includes('/login');
  const isRegisterPage = pathname.includes('/register');
  
  if (!token && !user && !isLoginPage && !isRegisterPage) {
    return null; // Will redirect in useEffect
  }

  return (
    <TenantProvider>
      <div className="container mx-auto ">
        <main>
          <Header />
          <SubNavigation/>
          <Outlet />
          <Footer />
        </main>
      </div>
    </TenantProvider>
  );
};

export default RootLayout;
