import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@cms/ui/components/button';
import { Input } from '@cms/ui/components/input';
import { Label } from '@cms/ui/components/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@cms/ui/components/card';
import { Alert, AlertDescription } from '@cms/ui/components/alert';
import { useAuthDataStore } from '../../../store/auth-store';
import { lmsApiFetch } from '../../../utils/apiClient';

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required'),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const { tenantSlug } = useParams<{ tenantSlug?: string }>();
  const navigate = useNavigate();
  const { setUser } = useAuthDataStore();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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
              localStorage.setItem('tenant_slug', tenantSlug);
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
        setTenantInfo({ tenantId: parseInt(storedTenantId) });
      }
    }
  }, [tenantSlug]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    setLoading(true);

    try {
      const tenantId = tenantInfo?.tenantId || localStorage.getItem('tenant_id');
      
      if (!tenantId) {
        throw new Error('Tenant information not available. Please access via tenant URL.');
      }

      const response = await lmsApiFetch('/users/register', {
        method: 'POST',
        body: JSON.stringify({
          username: data.username,
          password: data.password,
          email: data.email,
          name: data.name,
          address: data.address || '',
          phoneNumber: data.phoneNumber || '',
          tenantId: parseInt(tenantId.toString()),
        }),
      }, true); // Skip auth headers for registration

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Registration failed' }));
        throw new Error(errorData.message || 'Registration failed');
      }

      const result = await response.json();
      
      // Store user info
      setUser({
        id: result.id?.toString() || '',
        name: result.name || result.username,
        email: result.email,
        tenantId: result.tenant?.id?.toString() || tenantId.toString(),
        role: result.role?.name || '',
        roleName: result.role?.name || '',
      });

      // Navigate to home or my-learning
      const redirectPath = tenantSlug ? `/lms/${tenantSlug}` : '/';
      navigate(redirectPath);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const basePath = tenantSlug ? `/lms/${tenantSlug}` : '';

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Student Account</CardTitle>
          <CardDescription>
            Register as a student to access courses and start learning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Enter your full name"
                disabled={loading}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                {...register('username')}
                placeholder="Choose a username"
                disabled={loading}
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="Enter your email"
                disabled={loading}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                placeholder="Create a password"
                disabled={loading}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
              <Input
                id="phoneNumber"
                {...register('phoneNumber')}
                placeholder="Enter your phone number"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address (Optional)</Label>
              <Input
                id="address"
                {...register('address')}
                placeholder="Enter your address"
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Registering...' : 'Register as Student'}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to={`${basePath}/login`} className="text-primary hover:underline">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

