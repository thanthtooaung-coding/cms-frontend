import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuthDataStore } from '../store/auth-store';
import { fetchUserProfile, updateProfile, changePassword, type UserProfile, type UpdateProfileRequest, type ChangePasswordRequest } from '../api/settingsApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@cms/ui/components/card';
import { Button } from '@cms/ui/components/button';
import { Input } from '@cms/ui/components/input';
import { Label } from '@cms/ui/components/label';
import { Avatar, AvatarFallback, AvatarImage } from '@cms/ui/components/avatar';
import { Mail, User, MapPin, Phone, Lock, ArrowLeft, Save, CheckCircle2, XCircle } from 'lucide-react';

const SettingsPage = () => {
  const { tenantSlug } = useParams<{ tenantSlug?: string }>();
  const navigate = useNavigate();
  const { user, setUser } = useAuthDataStore();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState<UpdateProfileRequest>({
    name: '',
    address: '',
    phoneNumber: '',
  });
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState<ChangePasswordRequest>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  } as ChangePasswordRequest & { confirmPassword: string });

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) {
        setError('Please log in to view your profile');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const userId = parseInt(user.id, 10);
        const profileData = await fetchUserProfile(userId);
        setProfile(profileData);
        setProfileForm({
          name: profileData.name || '',
          address: profileData.address || '',
          phoneNumber: profileData.phoneNumber || '',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user?.id]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      setSaving(true);
      setError(null);
      const userId = parseInt(user.id, 10);
      const updatedProfile = await updateProfile(userId, profileForm);
      setProfile(updatedProfile);
      
      // Update auth store with new name
      if (user) {
        setUser({
          ...user,
          name: updatedProfile.name,
        });
      }
      
      setSuccessMessage('Profile updated successfully!');
      setError(null);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      setSuccessMessage(null);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    // Validate passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      setSuccessMessage(null);
      return;
    }

    // Validate password length
    if (passwordForm.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      setSuccessMessage(null);
      return;
    }

    try {
      setChangingPassword(true);
      setError(null);
      const userId = parseInt(user.id, 10);
      await changePassword(userId, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      
      // Clear password form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      setSuccessMessage('Password changed successfully!');
      setError(null);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to change password';
      setError(errorMessage);
      setSuccessMessage(null);
    } finally {
      setChangingPassword(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const names = name.trim().split(/\s+/);
    if (names.length >= 2) {
      // First letter of first name + first letter of last name
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    // If single name, take first 2 letters
    return name.substring(0, 2).toUpperCase();
  };

  const getBackPath = () => {
    return tenantSlug ? `/lms/${tenantSlug}` : '/';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md px-4">
          <p className="text-red-600 dark:text-red-400 mb-4 text-lg">{error}</p>
          <Button onClick={() => navigate(getBackPath())} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <Button
            variant="ghost"
            onClick={() => navigate(getBackPath())}
            className="mb-6 hover:bg-purple-50 dark:hover:bg-purple-900/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">Manage your account settings and preferences</p>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-8 p-5 bg-green-50 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3 shadow-sm">
            <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
            <p className="text-base font-medium text-green-600 dark:text-green-400">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-5 bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 shadow-sm">
            <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
            <p className="text-base font-medium text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Profile View Card */}
          <div className="xl:col-span-4">
            <Card className="shadow-xl border-2 border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300 h-full">
              <CardHeader className="text-center pb-6 pt-8 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800 rounded-t-lg">
                <div className="flex justify-center mb-6">
                  <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-700 shadow-lg ring-4 ring-purple-100 dark:ring-purple-900/50">
                    <AvatarFallback className="text-3xl bg-gradient-to-br from-purple-600 to-purple-700 text-white font-bold">
                      {getInitials(profile.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-2xl font-bold mb-2">{profile.name}</CardTitle>
                <CardDescription className="text-base">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium">
                    {profile.role.name}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Email</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 break-all">{profile.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <User className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Username</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{profile.username}</p>
                  </div>
                </div>
                {profile.address && (
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Address</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{profile.address}</p>
                    </div>
                  </div>
                )}
                {profile.phoneNumber && (
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Phone</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{profile.phoneNumber}</p>
                    </div>
                  </div>
                )}
                {profile.tenant && (
                  <div className="pt-5 mt-5 border-t-2 border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Tenant</p>
                    <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">{profile.tenant.name}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Edit Forms */}
          <div className="xl:col-span-8 space-y-8">
            {/* Edit Profile Form */}
            <Card className="shadow-xl border-2 border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300">
              <CardHeader className="pb-6 bg-gradient-to-r from-purple-50 to-transparent dark:from-purple-900/20 dark:to-transparent border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="text-2xl font-bold">Edit Profile</CardTitle>
                <CardDescription className="text-base mt-2">Update your profile information. Email and username cannot be changed.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-base font-semibold">Name</Label>
                    <Input
                      id="name"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      placeholder="Your full name"
                      required
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="address" className="text-base font-semibold">Address</Label>
                    <Input
                      id="address"
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      placeholder="Your address"
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="phoneNumber" className="text-base font-semibold">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      value={profileForm.phoneNumber}
                      onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
                      placeholder="Your phone number"
                      className="h-12 text-base"
                    />
                  </div>
                  <Button type="submit" disabled={saving} className="w-full h-12 text-base font-semibold mt-6 bg-purple-600 hover:bg-purple-700">
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Change Password Form */}
            <Card className="shadow-xl border-2 border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300">
              <CardHeader className="pb-6 bg-gradient-to-r from-purple-50 to-transparent dark:from-purple-900/20 dark:to-transparent border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="text-2xl font-bold">Change Password</CardTitle>
                <CardDescription className="text-base mt-2">Update your password to keep your account secure.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="currentPassword" className="text-base font-semibold">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      placeholder="Enter your current password"
                      required
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="newPassword" className="text-base font-semibold">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      placeholder="Enter your new password (min. 6 characters)"
                      required
                      minLength={6}
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="confirmPassword" className="text-base font-semibold">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      placeholder="Confirm your new password"
                      required
                      minLength={6}
                      className="h-12 text-base"
                    />
                  </div>
                  <Button type="submit" disabled={changingPassword} variant="outline" className="w-full h-12 text-base font-semibold mt-6 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    {changingPassword ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600 mr-2"></div>
                        Changing...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5 mr-2" />
                        Change Password
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

