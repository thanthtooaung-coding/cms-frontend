import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Menu, LogOut, UserCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchWithAuth } from "@/lib/api";
import { useTenantPath } from "@/hooks/useTenantPath";
import { TenantContext } from "@/context/TenantContext";


interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string, movieId?: string) => void;
  onLogout: () => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  isAuthenticated?: boolean;
  userRole?: string | null;
}

export const Header = ({ onLogout, onLoginClick, onRegisterClick, isAuthenticated, userRole }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getPath } = useTenantPath();
  const [user, setUser] = useState<{ name?: string; email?: string; profileUrl?: string }>({});
  
  // Get tenant info from context
  const tenantContext = useContext(TenantContext);
  const tenantInfo = tenantContext?.tenantInfo || null;
  
  // Get tenant name and logo with fallback to CELESTIX
  const displayName = tenantInfo?.tenantName || tenantInfo?.name || tenantInfo?.pageTitle || 'CELESTIX';
  const logoUrl = tenantInfo?.logoUrl || '/lovable-uploads/CELESTIX.png';

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUserData = async () => {
        try {
          const response = await fetchWithAuth("/auth/me");
          if (response.ok) {
            const data = await response.json();
            setUser(data.data);
          } else {
            console.error("Failed to fetch user data for header");
          }
        } catch (error) {
          console.error("An error occurred while fetching user data for header:", error);
        }
      };
      fetchUserData();
    }
  }, [isAuthenticated]);

  const navItems = [
    { id: "home", label: "HOME", path: getPath("/"), exact: true },
    { id: "discover", label: "DISCOVER", path: getPath("/discover") },
    { id: "about", label: "ABOUT", path: getPath("/about") },
    { id: "services", label: "SERVICES", path: getPath("/services") },
    { id: "profile", label: "PROFILE", path: getPath("/profile"), requiresAuth: true },
    { id: "food", label: "FOOD", path: getPath("/food"), requiresAuth: true },
    ...(isAuthenticated && userRole === 'ADMIN' ? [{ id: "admin", label: "ADMIN", path: getPath("/admin") }] : [])
  ];

  // Helper function to check if a route is active
  const isRouteActive = (itemPath: string, exact: boolean = false) => {
    const currentPath = location.pathname;
    // Remove tenant prefix for comparison
    const normalizedCurrent = currentPath.replace(/^\/bms\/[^/]+/, '') || '/';
    const normalizedItem = itemPath.replace(/^\/bms\/[^/]+/, '') || '/';
    
    if (exact) {
      // For exact match (home), check if current path is exactly "/" or the base tenant path
      return normalizedCurrent === normalizedItem || (normalizedItem === '/' && normalizedCurrent === '/');
    }
    // For non-exact matches, check if current path starts with item path
    // But ensure we don't match parent routes incorrectly
    if (normalizedItem === '/') {
      return false; // Home should only match exactly
    }
    return normalizedCurrent === normalizedItem || normalizedCurrent.startsWith(normalizedItem + '/');
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate(getPath('/'))}>
          <img
            src={logoUrl}
            alt={`${displayName} Logo`}
            className="w-10 h-10 object-contain"
            onError={(e) => {
              // Fallback to default logo if tenant logo fails to load
              e.currentTarget.src = '/lovable-uploads/CELESTIX.png';
            }}
          />
          <span className="text-xl font-bold gradient-text">{displayName}</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => {
            if (item.requiresAuth && !isAuthenticated) {
              return null;
            }
            const isActive = isRouteActive(item.path, item.exact);
            return (
                <NavLink
                    key={item.id}
                    to={item.path}
                    className={`text-sm font-medium transition-colors ${
                        isActive
                            ? "text-primary border-b-2 border-primary pb-4"
                            : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                    {item.label}
                </NavLink>
            )
          })}
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.profileUrl} alt="User Profile" />
                    <AvatarFallback>
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => navigate(getPath('/profile'))}>
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={onLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="outline" onClick={onLoginClick}>Login</Button>
              <Button onClick={onRegisterClick}>Register</Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
