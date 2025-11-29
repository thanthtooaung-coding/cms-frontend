import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@cms/ui/components/button';
import { useAuthDataStore } from '../../store/auth-store';
import { useState, useEffect } from 'react';

function Header() {
  const { tenantSlug } = useParams<{ tenantSlug?: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuthDataStore();
  const [tenantInfo, setTenantInfo] = useState<any>(null);

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
              localStorage.setItem('tenant_id', result.data.tenantId.toString());
            }
          }
        } catch (err) {
          console.error('Error fetching tenant info:', err);
        }
      };
      fetchTenantInfo();
    }
  }, [tenantSlug]);

  // Determine base path based on current location
  let basePath = '/ecs-client';
  if (tenantSlug) {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/ecommerce/')) {
      basePath = `/ecommerce/${tenantSlug}/ecs-client`;
    } else {
      basePath = `/ecs-client/${tenantSlug}`;
    }
  }

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to={basePath} className="text-2xl font-bold">
          {tenantInfo?.tenantName || 'ECS Store'}
        </Link>
        <nav className="flex items-center gap-4">
          <Link to={`${basePath}/products`}>Products</Link>
          {user ? (
            <>
              <Link to={`${basePath}/cart`}>Cart</Link>
              <Link to={`${basePath}/orders`}>Orders</Link>
              <Link to={`${basePath}/profile`}>Profile</Link>
              <Button onClick={() => { logout(); navigate(`${basePath}/login`); }}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to={`${basePath}/login`}>
                <Button variant="outline">Login</Button>
              </Link>
              <Link to={`${basePath}/register`}>
                <Button>Register</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;

