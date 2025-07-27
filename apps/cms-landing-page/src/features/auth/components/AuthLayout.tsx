import { Outlet } from 'react-router';
import AuthHeader from './AuthHeader';

const AuthLayout = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center  overflow-hidden">
      <AuthHeader />
      <div className="w-xs sm:w-md md:w-lg  relative z-10 bg-white backdrop-blur-lg shadow-2xl py-4 px-8 md:py-6 rounded-lg ">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
