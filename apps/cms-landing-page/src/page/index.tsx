import Hero from '../components/LandingPage/Hero';
import Service from '../components/LandingPage/Service';
import About from '../components/LandingPage/About';
import PageRequest from '../components/LandingPage/PageRequest';
import useAuthStore from '../store/auth-store';
import { useEffect } from 'react';

export default function Home() {
  // const { setIsAuthenticated, setUser } = useAuthStore();

  // useEffect(() => {
  //   const checkAuthStatus = async () => {
  //     const token = localStorage.getItem('accessToken');
  //     if (token) {
  //       try {
  //         await new Promise((resolve) => setTimeout(resolve, 300));

  //         const demoUser = {
  //           id: 'demo-user-id',
  //           email: 'demo@example.com',
  //           emailVerified: true,
  //           mfaSetup: true,
  //           onboardingComplete: false, // Set based on actual user data from backend
  //           roles: ['user'],
  //         };
  //         setIsAuthenticated(true);
  //         setUser(demoUser);
  //       } catch (error) {
  //         console.error('Token validation failed or user data fetch error:', error);
  //         localStorage.removeItem('authToken');
  //         setIsAuthenticated(false);
  //         setUser(null);
  //       }
  //     }
  //   };
  //   checkAuthStatus();
  // }, [setIsAuthenticated, setUser]);
  return (
    <div>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <Hero />
      <Service />
      <PageRequest />
      <About />
    </div>
  );
}
