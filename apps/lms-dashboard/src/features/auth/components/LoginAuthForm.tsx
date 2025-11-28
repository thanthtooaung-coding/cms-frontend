import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@cms/ui/components/button';
import { Input } from '@cms/ui/components/input';
import { Label } from '@cms/ui/components/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@cms/ui/components/card';
import { Alert, AlertDescription } from '@cms/ui/components/alert';
import { useAuthDataStore } from '../../../store/auth-store';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginAuthForm = () => {
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
      // Try to get tenant from localStorage
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
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setLoading(true);

    try {
      // Get tenant ID from context or localStorage
      const tenantId = tenantInfo?.tenantId || localStorage.getItem('tenant_id');
      
      if (!tenantId) {
        throw new Error('Tenant information not available. Please access via tenant URL.');
      }

      // Call LMS Java backend login endpoint through gateway
      const gatewayUrl = import.meta.env.VITE_BACKEND_SERVER || 'http://localhost:4001';
      const response = await fetch(`${gatewayUrl}/api/lms/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
          tenantId: parseInt(tenantId.toString()),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
        throw new Error(errorData.message || 'Invalid username or password');
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

      // Store token if provided
      if (result.token) {
        localStorage.setItem('lms_token', result.token);
      }
      localStorage.setItem('tenant_id', tenantId.toString());

      // Navigate to dashboard
      if (tenantSlug) {
        navigate(`/lms/${tenantSlug}`);
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login to LMS Dashboard</CardTitle>
          <CardDescription>
            {tenantInfo ? `Access your ${tenantInfo.tenantName} dashboard` : 'Enter your credentials to continue'}
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
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                {...register('username')}
                disabled={loading}
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register('password')}
                disabled={loading}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
