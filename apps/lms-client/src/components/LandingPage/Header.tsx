import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, User, BookOpen, Settings, LogOut, Menu } from 'lucide-react'
import { Button } from '@cms/ui/components/button'
import { Input } from '@cms/ui/components/input'
import { Avatar, AvatarFallback, AvatarImage } from '@cms/ui/components/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@cms/ui/components/dropdown-menu';
import { useWishlistStore } from '../../store/wishlistStore';
import { Badge } from 'lucide-react';
function Header() {

    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const getWishlistCount = useWishlistStore((state) => state.getWishlistCount);
    const wishlistCount = getWishlistCount();


      const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
          navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
        }
      };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
            <span className="text-lg sm:text-2xl font-bold text-purple-600">LearnHub</span>
          </Link>

          {/* Navigation - Desktop */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-8">
            <Link
              to="/courses"
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

            <Button variant="ghost" className="text-gray-700 hover:text-purple-600">
              Teach on LearnHub
            </Button>

            <Link
              to="/my-learning"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              My Learning
            </Link>

            {/* Wishlist */}
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5 text-gray-700 hover:text-purple-600 transition-colors" />
              {wishlistCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {wishlistCount}
                </Badge>
              )}
            </Button>

            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop&crop=faces" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
        </div>
      </div>
    </header>
  );
}

export default Header;
