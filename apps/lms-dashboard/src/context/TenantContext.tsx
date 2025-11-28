import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useParams } from 'react-router-dom';

interface TenantInfo {
  tenantId: number;
  tenantName: string;
  pageId: number;
  pageTitle: string;
  pageUrl: string;
  logoUrl: string;
  ownerId: number;
  ownerEmail: string;
}

interface TenantContextType {
  tenantInfo: TenantInfo | null;
  loading: boolean;
  error: string | null;
  tenantSlug: string | undefined;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider');
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
          setTenantInfo(result.data);
          // Store tenant info in localStorage for API calls
          localStorage.setItem('tenant_id', result.data.tenantId.toString());
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

