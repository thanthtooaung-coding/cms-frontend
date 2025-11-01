import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './LandingPage/Header';
import Footer from './LandingPage/Footer';
import SubNavigation from './SubNavigation';
const RootLayout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="container mx-auto ">
      <main>
        <Header />
        <SubNavigation/>
        <Outlet />
        <Footer />
      </main>
    </div>
  );
};

export default RootLayout;
