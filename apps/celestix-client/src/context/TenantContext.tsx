import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useParams } from 'react-router-dom';

interface TenantInfo {
  id: number;
  name: string;
  slug: string;
  tenantId: number;
  tenantName: string;
  logoUrl: string;
  pageTitle: string;
  isActive: boolean;
}

interface TenantContextType {
  tenantInfo: TenantInfo | null;
  loading: boolean;
  error: string | null;
  tenantSlug: string | undefined;
}

export const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider = ({ children }: TenantProviderProps) => {
  const { tenantSlug } = useParams<{ tenantSlug: string }>();
  const [tenantInfo, setTenantInfo] = useState<TenantInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tenantSlug) {
      setTenantInfo(null);
      return;
    }

    const fetchTenantInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_SERVER || 'http://localhost:4001';
        const response = await fetch(`${backendUrl}/api/cms/page-request/tenant/${tenantSlug}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch tenant info');
        }

        const result = await response.json();
        if (result.success && result.data) {
          // Map the API response to TenantInfo format
          const mappedTenantInfo = {
            id: result.data.tenantId || result.data.id || 0,
            name: result.data.tenantName || result.data.name || '',
            slug: tenantSlug || '',
            tenantId: result.data.tenantId || 0,
            tenantName: result.data.tenantName || result.data.pageTitle || '',
            logoUrl: result.data.logoUrl || '',
            pageTitle: result.data.pageTitle || '',
            isActive: true,
          };
          setTenantInfo(mappedTenantInfo);
          localStorage.setItem('tenant_id', mappedTenantInfo.tenantId.toString());
          localStorage.setItem('tenant_slug', tenantSlug);
        } else {
          throw new Error(result.message || 'Failed to fetch tenant info');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tenant info');
        console.error('Error fetching tenant info:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTenantInfo();
  }, [tenantSlug]);

  return (
    <TenantContext.Provider value={{ tenantInfo, loading, error, tenantSlug }}>
      {children}
    </TenantContext.Provider>
  );
};

