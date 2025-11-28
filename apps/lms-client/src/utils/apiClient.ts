// API client utility for LMS client
// All LMS API calls go through the gateway at localhost:4001 with /api/lms prefix

const getTenantId = (): string | null => {
  return localStorage.getItem('tenant_id');
};

const getLmsToken = (): string | null => {
  return localStorage.getItem('lms_token');
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

const getUserRole = (): string | null => {
  try {
    const authStorage = sessionStorage.getItem('auth-storage');
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      if (parsed?.state?.user?.roleName) {
        return parsed.state.user.roleName;
      }
    }
  } catch (e) {
    // Ignore parsing errors
  }
  return null;
};

export const lmsApiFetch = async (
  endpoint: string,
  options: RequestInit = {},
  skipAuthHeaders: boolean = false
): Promise<Response> => {
  const gatewayUrl = import.meta.env.VITE_BACKEND_SERVER || 'http://localhost:4001';
  const tenantId = getTenantId();
  const token = getLmsToken();
  const userId = getUserId();
  const userRole = getUserRole();

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const fullUrl = endpoint.startsWith('http') 
    ? endpoint 
    : `${gatewayUrl}/api/lms${cleanEndpoint}`;
  
  const urlWithTenant = tenantId 
    ? `${fullUrl}${fullUrl.includes('?') ? '&' : '?'}tenantId=${tenantId}`
    : fullUrl;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Only add auth headers if not skipping (e.g., for login/register endpoints)
  if (!skipAuthHeaders) {
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (userId) {
      headers['X-User-Id'] = userId;
    }

    if (userRole) {
      headers['X-User-Role'] = userRole;
    }
  }

  return fetch(urlWithTenant, {
    ...options,
    headers,
  });
};

