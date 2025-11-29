// API client utility for ECS dashboard
// All ECS API calls go through the gateway at localhost:4001 with /api/ecs prefix

const getTenantId = (): string | null => {
  return localStorage.getItem('tenant_id');
};

const getEcsToken = (): string | null => {
  return localStorage.getItem('ecs_token');
};

const getUserId = (): string | null => {
  try {
    const authStorage = sessionStorage.getItem('auth-storage');
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      if (parsed?.state?.user?.id) {
        return parsed.state.user.id;
      }
    }
  } catch (e) {
    // Ignore parsing errors
  }
  return null;
};

export const ecsApiFetch = async (
  endpoint: string,
  options: RequestInit = {},
  skipAuthHeaders: boolean = false
): Promise<Response> => {
  const gatewayUrl = import.meta.env.VITE_BACKEND_SERVER || 'http://localhost:4001';
  const tenantId = getTenantId();
  const token = getEcsToken();
  const userId = getUserId();

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const fullUrl = endpoint.startsWith('http') 
    ? endpoint 
    : `${gatewayUrl}/api/ecs${cleanEndpoint}`;
  
  const urlWithTenant = tenantId 
    ? `${fullUrl}${fullUrl.includes('?') ? '&' : '?'}tenantId=${tenantId}`
    : fullUrl;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (!skipAuthHeaders) {
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (userId) {
      headers['X-User-Id'] = userId;
    }
  }

  return fetch(urlWithTenant, {
    ...options,
    headers,
  });
};

