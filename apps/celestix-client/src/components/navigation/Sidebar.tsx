import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTenantPath } from "@/hooks/useTenantPath";
import { TenantContext } from "@/context/TenantContext";
import { useAuthDataStore } from "@/store/auth-store";
import { 
  LayoutDashboard, 
  Users, 
  Film, 
  Newspaper,
  Calendar,
  User,
  Building,
  ClipboardList,
  Tag,
  LogOut,
  Shield,
  Receipt,
  Lock,
} from "lucide-react";

interface SidebarProps {
  onPageChange: (page: string) => void;
}

const getMenuItems = (getPath: (path: string) => string) => [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: getPath("/admin") },
  { id: "movies", label: "Movies", icon: Film, path: getPath("/admin/movies") },
  { id: "movie-genre", label: "Movie Genre", icon: Tag, path: getPath("/admin/movie-genres") },
  { id: "food", label: "Food", icon: Users, path: getPath("/admin/food") },
  // { id: "food-category", label: "Food Category", icon: ClipboardList, path: getPath("/admin/food-categories") },
  { id: "showtimes", label: "Showtimes", icon: Calendar, path: getPath("/admin/showtimes") },
  { id: "theaters", label: "Theaters", icon: Building, path: getPath("/admin/theaters") },
  { id: "bookings", label: "Bookings", icon: Newspaper, path: getPath("/admin/bookings") },
  { id: "refunds", label: "Refunds", icon: Receipt, path: getPath("/admin/refunds") },
  { id: "admins", label: "Admins", icon: Shield, path: getPath("/admin/admins") },
];

const getBottomMenuItems = (getPath: (path: string) => string) => [
  { id: "change-password", label: "Change Password", icon: Lock, path: getPath("/admin/change-password") },
  { id: "logout", label: "Logout", icon: LogOut },
];

export const Sidebar = ({ onPageChange }: SidebarProps) => {
  const location = useLocation();
  const currentPage = location.pathname;
  const { getPath, tenantSlug } = useTenantPath();
  const { user } = useAuthDataStore();
  
  // Get tenant info - safely access context without throwing error
  const tenantContext = useContext(TenantContext);
  const tenantInfo = tenantContext?.tenantInfo || null;

  // Get tenant name or fallback to "CELESTIX"
  const displayName = tenantInfo?.tenantName || tenantInfo?.name || tenantInfo?.pageTitle || 'CELESTIX';
  const logoUrl = tenantInfo?.logoUrl || '/lovable-uploads/CELESTIX.png';

  // Get current user's name and role
  const userName = user?.name || 'Admin';
  const userRole = user?.roleName || user?.role || 'Administrator';

  // Helper function to check if a route is active
  const isActive = (itemPath: string, itemId: string) => {
    // Remove tenant prefix for comparison
    const normalizedCurrent = currentPage.replace(/^\/bms\/[^/]+/, '');
    const normalizedItem = itemPath.replace(/^\/bms\/[^/]+/, '');
    
    // For dashboard (index route), check if we're exactly at /admin or /bms/:tenantSlug/admin
    if (itemId === 'dashboard') {
      return normalizedCurrent === '/admin' || normalizedCurrent === normalizedItem;
    }
    
    // For other routes, check if current path starts with the item path
    // But ensure we don't match parent routes (e.g., /admin/movies shouldn't match /admin/movie-genres)
    if (normalizedCurrent === normalizedItem) {
      return true;
    }
    
    // For nested routes (like /admin/movies/add or /admin/movies/edit/:id)
    // Check if current path starts with the base route
    if (normalizedCurrent.startsWith(normalizedItem + '/')) {
      return true;
    }
    
    return false;
  };

  return (
    <div className="w-64 h-screen bg-secondary/30 glass-card border-r border-border/50 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center space-x-3">
          <img 
            src={logoUrl} 
            alt={`${displayName} Logo`} 
            className="w-8 h-8 object-contain"
            onError={(e) => {
              // Fallback to default logo if tenant logo fails to load
              e.currentTarget.src = '/lovable-uploads/CELESTIX.png';
            }}
          />
          <span className="text-xl font-bold gradient-text">{displayName}</span>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-accent rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-background" />
          </div>
          <div>
            <p className="font-medium text-foreground">{userName}</p>
            <p className="text-sm text-muted-foreground">{userRole}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2 flex-1">
        {getMenuItems(getPath).map((item) => {
          const active = isActive(item.path, item.id);
          return (
            <Link to={item.path} key={item.id}>
                <Button
                    variant={active ? "default" : "ghost"}
                    className={cn(
                    "w-full justify-start space-x-3 h-12",
                    active
                        ? "bg-gradient-accent text-background shadow-glow" 
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    )}
                >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                </Button>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <nav className="p-4 space-y-2 border-t border-border/50">
        {getBottomMenuItems(getPath).map((item) => {
          if (item.path) {
            // For items with paths (like change password), use Link
            const active = isActive(item.path, item.id);
            return (
              <Link to={item.path} key={item.id}>
                <Button
                  variant={active ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start space-x-3 h-12",
                    active
                      ? "bg-gradient-accent text-background shadow-glow"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            );
          } else {
            // For items without paths (like logout), use onClick
            return (
              <Button
                key={item.id}
                variant={"ghost"}
                className={cn(
                  "w-full justify-start space-x-3 h-12",
                  "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
                onClick={() => onPageChange(item.id)}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Button>
            );
          }
        })}
      </nav>
    </div>
  );
};