import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@cms/ui/components/button';
import { Input } from '@cms/ui/components/input';
import { Label } from '@cms/ui/components/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@cms/ui/components/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@cms/ui/components/select';
import { ecsApiFetch } from '../../../utils/apiClient';

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  roleId: z.string().min(1, 'Role is required'),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  profileUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type UserFormData = z.infer<typeof userSchema>;

interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  roleId?: number;
  address?: string;
  phoneNumber?: string;
  profileUrl?: string;
}

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  tenantId: number | null;
  onSuccess: () => void;
}

const roles = [
  { id: 1, name: 'Owner' },
  { id: 2, name: 'Admin' },
  { id: 3, name: 'Staff' },
  { id: 4, name: 'Customer' },
];

export function UserForm({ open, onOpenChange, user, tenantId, onSuccess }: UserFormProps) {
  const [loading, setLoading] = useState(false);
  const isEdit = !!user;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      roleId: '',
      address: '',
      phoneNumber: '',
      profileUrl: '',
    },
  });

  useEffect(() => {
    if (open) {
      if (user) {
        reset({
          name: user.name,
          email: user.email,
          password: '', // Don't pre-fill password
          roleId: user.roleId?.toString() || '',
          address: user.address || '',
          phoneNumber: user.phoneNumber || '',
          profileUrl: user.profileUrl || '',
        });
      } else {
        reset({
          name: '',
          email: '',
          password: '',
          roleId: '',
          address: '',
          phoneNumber: '',
          profileUrl: '',
        });
      }
    }
  }, [open, user, reset]);

  const onSubmit = async (data: UserFormData) => {
    if (!tenantId) return;
    setLoading(true);
    try {
      if (isEdit) {
        // Update user (password optional)
        const payload: any = {
          name: data.name,
          email: data.email,
          roleId: parseInt(data.roleId),
          address: data.address || null,
          phoneNumber: data.phoneNumber || null,
          profileUrl: data.profileUrl || null,
        };

        const response = await ecsApiFetch(`/users/${user.id}?tenantId=${tenantId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          onSuccess();
          onOpenChange(false);
          reset();
        } else {
          const error = await response.json();
          alert(error.message || 'Failed to update user');
        }
      } else {
        // Create user (password required)
        if (!data.password || data.password.length < 6) {
          alert('Password is required and must be at least 6 characters');
          setLoading(false);
          return;
        }

        const payload = {
          name: data.name,
          email: data.email,
          password: data.password,
          roleId: parseInt(data.roleId),
          address: data.address || null,
          phoneNumber: data.phoneNumber || null,
        };

        const response = await ecsApiFetch(`/users?tenantId=${tenantId}`, {
          method: 'POST',
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          onSuccess();
          onOpenChange(false);
          reset();
        } else {
          const error = await response.json();
          alert(error.message || 'Failed to create user');
        }
      }
    } catch (error) {
      console.error('Error saving user:', error);
      alert('An error occurred while saving the user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update user information' : 'Create a new user account'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>

          {!isEdit && (
            <div>
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                placeholder="At least 6 characters"
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>
          )}

          <div>
            <Label htmlFor="roleId">Role *</Label>
            <Select
              value={watch('roleId') || ''}
              onValueChange={(value) => setValue('roleId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.roleId && (
              <p className="text-sm text-red-500 mt-1">{errors.roleId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                {...register('address')}
                placeholder="123 Main St"
              />
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                {...register('phoneNumber')}
                placeholder="+1234567890"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="profileUrl">Profile Image URL</Label>
            <Input
              id="profileUrl"
              type="url"
              {...register('profileUrl')}
              placeholder="https://example.com/profile.jpg"
            />
            {errors.profileUrl && (
              <p className="text-sm text-red-500 mt-1">{errors.profileUrl.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update User' : 'Create User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

