import { useParams } from 'react-router-dom';

/**
 * Hook to get tenant-aware base path
 * Returns the base path with /bms/:tenantSlug prefix if tenantSlug exists
 */
export const useTenantPath = () => {
  const { tenantSlug } = useParams<{ tenantSlug?: string }>();
  const basePath = tenantSlug ? `/bms/${tenantSlug}` : '';

  /**
   * Get a tenant-aware path
   * @param path - The path to append (should start with /)
   * @returns The full path with tenant prefix if applicable
   */
  const getPath = (path: string): string => {
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    return basePath + path;
  };

  return {
    basePath,
    tenantSlug,
    getPath,
  };
};

