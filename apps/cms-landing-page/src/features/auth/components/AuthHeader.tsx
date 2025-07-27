import { Building2, Sparkles } from 'lucide-react';

const AuthHeader = () => {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 p-4">
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 md:px-6 lg:px-12 py-4">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="bg-gradient-to-br from-gray-900 to-gray-700 p-2.5 rounded-xl shadow-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1">
              <Sparkles className="h-3 w-3 text-yellow-500" />
            </div>
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold ">ContentFlow</h1>
            <p className="text-xs  -mt-0.5">Multi-Tenant CMS</p>
          </div>
        </div>

        {/* Support text */}
        <div className="text-sm text-gray-500">
          <span className="cursor-pointer hover:underline">Need help?Contact support</span>
        </div>
      </div>
    </header>
  );
};

export default AuthHeader;
