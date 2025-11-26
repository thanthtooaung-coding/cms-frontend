import { useState, useEffect } from 'react';
import { Button } from '@cms/ui/components/button';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router';
import { cn } from '@cms/ui/lib/utils';
import { useAuthDataStore } from '../../store/auth-store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@cms/ui/components/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@cms/ui/components/avatar';

const navItems = [
  { label: 'Home', href: '#home', id: 'home' },
  { label: 'Services', href: '#services', id: 'services' },
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Contact', href: '#contact', id: 'contact' },
];

const Header = () => {
  const [activeLink, setActiveLink] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthDataStore();

  const handleClick = (id: string) => {
    setActiveLink(id);
    setMobileOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      setScrolled(window.scrollY > 20);

      for (const item of navItems) {
        const element = document.getElementById(item.id);
        if (element) {
          if (element.offsetTop <= scrollPosition && element.offsetTop + element.offsetHeight > scrollPosition) {
            setActiveLink(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

 

  return (
    <nav
      className={cn(
        'sticky top-0 w-full z-50 px-6 md:px-8 py-3 transition-all duration-300',
        scrolled ? 'bg-transparent backdrop-blur-sm' : 'bg-transparent'
      )}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="text-xl font-bold text-slate-800">CMS</span>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-8 text-slate-700 font-medium">
          {navItems.map(({ label, href, id }) => (
            <li key={id}>
              <a
                href={href}
                onClick={() => handleClick(id)}
                className={cn(
                  'relative transition-colors duration-200 hover:text-blue-600 py-2',
                  activeLink === id && 'text-blue-600'
                )}
              >
                {label}
                {activeLink === id && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                )}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex gap-3 items-center">
          {isAuthenticated() && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full cursor-pointer hover:bg-slate-100"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                      {user.name?.slice(0, 2).toUpperCase() || 'U'}
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
                <DropdownMenuItem
                  onClick={() => navigate('/profile')}
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate('/page-request')}
                  className="cursor-pointer"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Submit Page Request</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                onClick={() => navigate('/auth')}
                variant="outline"
                className="border border-slate-300 text-slate-700 hover:border-blue-600 hover:text-blue-600 px-6 py-2 rounded-lg transition-all duration-200 cursor-pointer"
              >
                Login
              </Button>
              <Button
                onClick={() => navigate('/onboarding')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
              >
                Register
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          className={cn(
            'md:hidden p-2 rounded-lg transition-all duration-200',
            mobileOpen
              ? 'bg-slate-100 text-slate-700'
              : 'bg-transparent text-slate-700 hover:bg-slate-100'
          )}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden mt-4 bg-white/95 backdrop-blur-md border border-slate-200/60 rounded-xl shadow-lg mx-4 overflow-hidden">
          <div className="p-4 space-y-4">
            <ul className="space-y-3">
              {navItems.map(({ label, href, id }) => (
                <li key={id}>
                  <a
                    href={href}
                    onClick={() => handleClick(id)}
                    className={cn(
                      'block py-2 px-3 rounded-lg transition-colors duration-200 hover:bg-slate-100',
                      activeLink === id && 'text-blue-600 bg-blue-50'
                    )}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="pt-3 border-t border-slate-200 space-y-2">
              {isAuthenticated() && user ? (
                <>
                  <div className="px-3 py-2 border-b border-slate-200 mb-2">
                    <p className="text-sm font-medium text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                  <Button
                    onClick={() => {
                      navigate('/profile');
                      setMobileOpen(false);
                    }}
                    variant="outline"
                    className="w-full border border-slate-300 text-slate-700 hover:border-blue-600 hover:text-blue-600 px-4 py-2 rounded-lg transition-all duration-200"
                  >
                    <User className="mr-2 h-4 w-4" />
                    My Profile
                  </Button>
                  <Button
                    onClick={() => {
                      navigate('/page-request');
                      setMobileOpen(false);
                    }}
                    variant="outline"
                    className="w-full border border-slate-300 text-slate-700 hover:border-blue-600 hover:text-blue-600 px-4 py-2 rounded-lg transition-all duration-200"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Submit Page Request
                  </Button>
                  <Button
                    onClick={() => {
                      logout();
                      navigate('/');
                      setMobileOpen(false);
                    }}
                    variant="outline"
                    className="w-full border border-red-300 text-red-600 hover:border-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-all duration-200"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      navigate('/auth');
                      setMobileOpen(false);
                    }}
                    variant="outline"
                    className="w-full border border-slate-300 text-slate-700 hover:border-blue-600 hover:text-blue-600 px-4 py-2 rounded-lg transition-all duration-200"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => {
                      navigate('/onboarding');
                      setMobileOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
                  >
                    Register
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
