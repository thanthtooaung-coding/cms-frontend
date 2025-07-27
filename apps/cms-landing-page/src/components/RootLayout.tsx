import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import Header from './LandingPage/Header';
import Footer from './LandingPage/Footer';

const RootLayout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="container mx-auto">
      <main>
        <Header />
        <Outlet />
        <Footer />
      </main>
    </div>
  );
};

export default RootLayout;
