// API functions for authentication

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001/api';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  password: string;
  email: string;
  name?: string;
  address?: string;
  phone_number?: string;
  role_id?: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  name?: string;
  role_id?: number;
  role?: {
    id: number;
    name: string;
  };
  address?: string;
  phone_number?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

/**
 * Login with username and password
 */
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/cms/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Login failed' }));
    throw new Error(error.message || 'Login failed');
  }

  const result = await response.json();
  return result.data as AuthResponse;
}

/**
 * Signup with username, password, and other details
 */
export async function signup(data: SignupRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/cms/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Signup failed' }));
    throw new Error(error.message || 'Signup failed');
  }

  const result = await response.json();
  return result.data as AuthResponse;
}

/**
 * Get current user information
 */
export async function getCurrentUser(): Promise<User> {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_BASE_URL}/cms/auth/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      throw new Error('Session expired. Please login again.');
    }
    const error = await response.json().catch(() => ({ message: 'Failed to get user' }));
    throw new Error(error.message || 'Failed to get user');
  }

  const result = await response.json();
  return result.data;
}

export interface PageRequest {
  id: number;
  ownerId: number;
  requestType: string;
  title: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  pageUrl: string;
  logoUrl: string;
  createdAt: string;
  userName?: string;
  userEmail?: string;
}

export interface ProfileStats {
  totalRequests: number;
  approvedRequests: number;
  pendingRequests: number;
  rejectedRequests: number;
}

export interface Profile {
  user: User;
  pageRequests: PageRequest[];
  stats: ProfileStats;
}

/**
 * Get user profile with page requests
 */
export async function getProfile(): Promise<Profile> {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_BASE_URL}/cms/auth/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('auth_token');
      throw new Error('Session expired. Please login again.');
    }
    const error = await response.json().catch(() => ({ message: 'Failed to get profile' }));
    throw new Error(error.message || 'Failed to get profile');
  }

  const result = await response.json();
  return result.data;
}

