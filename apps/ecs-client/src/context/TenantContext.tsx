import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useParams } from 'react-router-dom';

interface TenantContextType {
  tenantId: number | null;
  tenantSlug: string | null;
  tenantInfo: any | null;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider = ({ children }: { children: ReactNode }) => {
  const { tenantSlug } = useParams<{ tenantSlug?: string }>();
  const [tenantId, setTenantId] = useState<number | null>(null);
  const [tenantInfo, setTenantInfo] = useState<any | null>(null);

  useEffect(() => {
    if (tenantSlug) {
      const fetchTenantInfo = async () => {
        try {
          const backendUrl = import.meta.env.VITE_BACKEND_SERVER || 'http://localhost:4001';
          const response = await fetch(`${backendUrl}/api/cms/page-request/tenant/${tenantSlug}`);
          if (response.ok) {
            const result = await response.json();
            if (result.success && result.data) {
              setTenantInfo(result.data);
              setTenantId(result.data.tenantId);
              localStorage.setItem('tenant_id', result.data.tenantId.toString());
            }
          }
        } catch (err) {
          console.error('Error fetching tenant info:', err);
        }
      };
      fetchTenantInfo();
    } else {
      const storedTenantId = localStorage.getItem('tenant_id');
      if (storedTenantId) {
        setTenantId(parseInt(storedTenantId));
      }
    }
  }, [tenantSlug]);

  return (
    <TenantContext.Provider value={{ tenantId, tenantSlug: tenantSlug || null, tenantInfo }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
};

