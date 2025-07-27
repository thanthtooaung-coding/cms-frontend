import { useState, useEffect } from 'react';
import { Button } from '@cms/ui/components/button';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { cn } from '@cms/ui/lib/utils';

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

  const handleClick = (id: string) => {
    setActiveLink(id);
    setMobileOpen(false);
  };


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!activeLink) return;
    const element = document.getElementById(activeLink);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeLink]);

 

  return (
    <nav
      className="
        sticky top-0 w-full z-50
        bg-transparent backdrop-blur
        px-6 md:px-8 py-3
        scroll-smooth
      "

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
        <div className="hidden md:block">
          <Button
            onClick={() => navigate('/onboarding')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Get Started
          </Button>
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
            <div className="pt-3 border-t border-slate-200">
              <Button
                onClick={() => navigate('/onboarding')}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
