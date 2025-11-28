import { Navigate, useLocation } from 'react-router-dom';
import { useAuthDataStore } from '../store/auth-store';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

/**
 * Component to protect routes based on user role
 * If user doesn't have required role, redirect to dashboard
 */
export function RoleProtectedRoute({ children, allowedRoles }: RoleProtectedRouteProps) {
  const { user } = useAuthDataStore();
  const location = useLocation();

  // If no user, redirect to login (should be handled by AuthenticatedLayout, but safety check)
  if (!user) {
    const tenantSlug = location.pathname.match(/\/lms\/([^/]+)/)?.[1];
    return <Navigate to={tenantSlug ? `/lms/${tenantSlug}/login` : '/login'} replace />;
  }

  // If no allowed roles specified, allow all authenticated users
  if (!allowedRoles || allowedRoles.length === 0) {
    return <>{children}</>;
  }

  const userRole = user.roleName || user.role;

  // Check if user has required role (case-insensitive comparison for safety)
  if (userRole && allowedRoles.some(role => role.toLowerCase() === userRole.toLowerCase())) {
    return <>{children}</>;
  }

  // If user doesn't have required role, redirect to dashboard
  const tenantSlug = location.pathname.match(/\/lms\/([^/]+)/)?.[1];
  const dashboardPath = tenantSlug ? `/lms/${tenantSlug}` : '/';
  return <Navigate to={dashboardPath} replace />;
}

