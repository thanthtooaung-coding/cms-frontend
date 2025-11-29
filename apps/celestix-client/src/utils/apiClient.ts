// API client utility for Celestix (BMS) client
// All BMS API calls go through the gateway at localhost:4001 with /api/bms prefix

const getTenantId = (): string | null => {
  return localStorage.getItem('tenant_id');
};

const getBmsToken = (): string | null => {
  return localStorage.getItem('bms_token');
};

const getUserId = (): string | null => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.id?.toString() || null;
    }
  } catch (e) {
    // Ignore parsing errors
  }
  return null;
};

const getUserRole = (): string | null => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.role || user.roleName || null;
    }
  } catch (e) {
    // Ignore parsing errors
  }
  return null;
};

export const bmsApiFetch = async (
  endpoint: string,
  options: RequestInit = {},
  skipAuthHeaders: boolean = false
): Promise<Response> => {
  const gatewayUrl = import.meta.env.VITE_BACKEND_SERVER || 'http://localhost:4001';
  const tenantId = getTenantId();
  const token = getBmsToken();
  const userId = getUserId();
  const userRole = getUserRole();

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const fullUrl = endpoint.startsWith('http') 
    ? endpoint 
    : `${gatewayUrl}/api/bms${cleanEndpoint}`;
  
  const urlWithTenant = tenantId 
    ? `${fullUrl}${fullUrl.includes('?') ? '&' : '?'}tenantId=${tenantId}`
    : fullUrl;

  // Check if body is FormData - if so, don't set Content-Type (browser will set it with boundary)
  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = {
    ...options.headers,
  };

  // Only set Content-Type if not FormData and not already set in options.headers
  if (!isFormData && !headers['Content-Type'] && !headers['content-type']) {
    headers['Content-Type'] = 'application/json';
  }

  // Only add auth headers if not skipping (e.g., for login/register endpoints)
  if (!skipAuthHeaders) {
    if (token && token.trim() !== '') {
      headers['Authorization'] = `Bearer ${token.trim()}`;
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

// Legacy API functions for backward compatibility
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  return bmsApiFetch(url, options, false);
};

export const fetchApi = async (url: string, options: RequestInit = {}) => {
  // Public endpoints still need tenantId, but don't need auth token
  return bmsApiFetch(url, options, true);
};


