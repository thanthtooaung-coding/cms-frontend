// API functions for settings/profile management
import { lmsApiFetch } from '../utils/apiClient';

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  name: string;
  address?: string;
  phoneNumber?: string;
  role: {
    id: number;
    name: string;
  };
  tenant: {
    id: number;
    name: string;
  };
  totalCourses?: number;
  totalStudents?: number;
}

export interface UpdateProfileRequest {
  name?: string;
  address?: string;
  phoneNumber?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/**
 * Fetch current user profile
 */
export async function fetchUserProfile(userId: number): Promise<UserProfile> {
  const response = await lmsApiFetch(`/users/${userId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user profile: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Update user profile (name, address, phoneNumber only - no email/username)
 */
export async function updateProfile(userId: number, request: UpdateProfileRequest): Promise<UserProfile> {
  const response = await lmsApiFetch(`/users/${userId}/profile`, {
    method: 'PUT',
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `Failed to update profile: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Change user password
 */
export async function changePassword(userId: number, request: ChangePasswordRequest): Promise<void> {
  const response = await lmsApiFetch(`/users/${userId}/password`, {
    method: 'PUT',
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `Failed to change password: ${response.statusText}`);
  }
}

