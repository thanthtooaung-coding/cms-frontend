// API client utility for LMS dashboard with tenant context
// All LMS API calls go through the gateway at localhost:4001 with /api/lms prefix
const getTenantId = (): string | null => {
  return localStorage.getItem('tenant_id');
};

const getLmsToken = (): string | null => {
  return localStorage.getItem('lms_token');
};

export const lmsApiFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  // Use gateway URL (localhost:4001) with /api/lms prefix
  const gatewayUrl = import.meta.env.VITE_BACKEND_SERVER || 'http://localhost:4001';
  const tenantId = getTenantId();
  const token = getLmsToken();

  // Ensure endpoint starts with / and add /api/lms prefix
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const fullUrl = endpoint.startsWith('http') 
    ? endpoint 
    : `${gatewayUrl}/api/lms${cleanEndpoint}`;
  
  // Add tenant ID as query parameter
  const urlWithTenant = tenantId 
    ? `${fullUrl}${fullUrl.includes('?') ? '&' : '?'}tenantId=${tenantId}`
    : fullUrl;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(urlWithTenant, {
    ...options,
    headers,
  });
};

