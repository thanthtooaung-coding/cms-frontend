import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Search, User, BookOpen, Settings, LogOut } from 'lucide-react'
import { Button } from '@cms/ui/components/button'
import { Input } from '@cms/ui/components/input'
import { Avatar, AvatarFallback } from '@cms/ui/components/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@cms/ui/components/dropdown-menu';
import { useTenant } from '../../context/TenantContext';
import { useAuthDataStore } from '../../store/auth-store';

function Header() {

    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const { tenantSlug } = useParams<{ tenantSlug?: string }>();
    const { tenantInfo } = useTenant();
    const tenantName = tenantInfo?.tenantName || 'LearnHub';
    const { user, logout } = useAuthDataStore();

    const handleLogout = () => {
      logout();
      navigate(tenantSlug ? `/lms/${tenantSlug}` : '/');
    };

    const getUserInitials = () => {
      if (!user?.name) return 'U';
      const names = user.name.trim().split(/\s+/);
      if (names.length >= 2) {
        // First letter of first name + first letter of last name
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      // If single name, take first 2 letters
      return user.name.substring(0, 2).toUpperCase();
    };


      const basePath = tenantSlug ? `/lms/${tenantSlug}` : '';

      const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
          navigate(`${basePath}/courses?search=${encodeURIComponent(searchQuery)}`);
        }
      };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link to={basePath || '/'} className="flex items-center space-x-2 min-w-0 flex-shrink">
            <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 flex-shrink-0" />
            <span className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-purple-600 truncate max-w-[200px] sm:max-w-[300px] lg:max-w-[400px] xl:max-w-none" title={tenantName}>
              {tenantName}
            </span>
          </Link>

          {/* Navigation - Desktop */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-8">
            <Link
              to={`${basePath}/courses`}
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              Explore
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search for anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 xl:w-96 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </form>
            
            <Link
              to={`${basePath}/my-learning`}
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              My Learning
            </Link>

            {/* User Profile or Login Button */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 text-sm font-semibold">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={tenantSlug ? `/lms/${tenantSlug}/my-learning` : '/my-learning'} className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>My Learning</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={tenantSlug ? `/lms/${tenantSlug}/settings` : '/settings'} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                asChild
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                <Link to={tenantSlug ? `/lms/${tenantSlug}/login` : '/login'}>
                  Login
                </Link>
              </Button>
            )}
          </div>
          
        </div>
      </div>
    </header>
  );
}

export default Header;
