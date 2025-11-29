import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './LandingPage/Header';
import Footer from './LandingPage/Footer';
import { TenantProvider } from '../context/TenantContext';

const RootLayout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <TenantProvider>
      <div className="container mx-auto">
        <main>
          <Header />
          <Outlet />
          <Footer />
        </main>
      </div>
    </TenantProvider>
  );
};

export default RootLayout;

