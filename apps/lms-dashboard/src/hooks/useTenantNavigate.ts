import { useNavigate, useParams } from 'react-router-dom';

/**
 * Hook for tenant-aware navigation
 * Automatically prepends /lms/{tenantSlug} to absolute paths
 */
export function useTenantNavigate() {
  const navigate = useNavigate();
  const { tenantSlug } = useParams<{ tenantSlug: string }>();

  const tenantNavigate = (to: string | number, options?: { replace?: boolean }) => {
    if (typeof to === 'number') {
      // For relative navigation like navigate(-1)
      navigate(to);
      return;
    }

    if (!tenantSlug) {
      navigate(to, options);
      return;
    }

    // If path is already tenant-aware, use as is
    if (to.startsWith(`/lms/${tenantSlug}`)) {
      navigate(to, options);
      return;
    }

    // If path is absolute (starts with /), prepend /lms/tenantSlug
    if (to.startsWith('/')) {
      const tenantPath = `/lms/${tenantSlug}${to}`;
      navigate(tenantPath, options);
      return;
    }

    // Relative paths work as-is
    navigate(to, options);
  };

  return tenantNavigate;
}

/**
 * Hook to get tenant-aware URL
 * Useful for Link components
 */
export function useTenantUrl() {
  const { tenantSlug } = useParams<{ tenantSlug: string }>();

  const getTenantUrl = (path: string): string => {
    if (!tenantSlug) {
      // If no tenant slug, ensure path starts with /
      return path.startsWith('/') ? path : `/${path}`;
    }

    // If path is already tenant-aware, return as is
    if (path.startsWith(`/lms/${tenantSlug}`)) {
      return path;
    }

    // If path is absolute (starts with /) but not tenant-aware, prepend tenant prefix
    if (path.startsWith('/')) {
      return `/lms/${tenantSlug}${path}`;
    }

    // For relative paths, prepend tenant prefix with /
    return `/lms/${tenantSlug}/${path}`;
  };

  return getTenantUrl;
}

