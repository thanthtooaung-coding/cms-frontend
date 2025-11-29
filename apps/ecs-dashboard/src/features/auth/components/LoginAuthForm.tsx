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
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginAuthForm = () => {
  const { tenantSlug } = useParams<{ tenantSlug?: string }>();
  const navigate = useNavigate();
  const { setUser } = useAuthDataStore();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tenantId, setTenantId] = useState<number | null>(null);

  useEffect(() => {
    if (tenantSlug) {
      const fetchTenantInfo = async () => {
        try {
          const backendUrl = import.meta.env.VITE_BACKEND_SERVER || 'http://localhost:4001';
          const response = await fetch(`${backendUrl}/api/cms/page-request/tenant/${tenantSlug}`);
          if (response.ok) {
            const result = await response.json();
            if (result.success && result.data) {
              setTenantId(result.data.tenantId);
              localStorage.setItem('tenant_id', result.data.tenantId.toString());
            }
          }
        } catch (err) {
          console.error('Error fetching tenant info:', err);
        }
      };
      fetchTenantInfo();
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
    if (!tenantId) {
      setError('Tenant information not available');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_SERVER || 'http://localhost:4001';
      const response = await fetch(`${backendUrl}/api/ecs/auth/login?tenantId=${tenantId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          tenantId
        }),
      });

      const result = await response.json();

      if (response.ok && result.data) {
        localStorage.setItem('ecs_token', result.data.token);
        setUser({
          id: result.data.userId.toString(),
          name: result.data.name,
          email: result.data.email,
          role: result.data.role?.displayName,
        });
        // Determine base path based on current location
        let basePath = '/ecs-dashboard';
        if (tenantSlug) {
          const currentPath = window.location.pathname;
          if (currentPath.includes('/ecommerce/')) {
            basePath = `/ecommerce/${tenantSlug}/ecs-dashboard`;
          } else {
            basePath = `/ecs-dashboard/${tenantSlug}`;
          }
        }
        navigate(basePath);
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>ECS Dashboard Login</CardTitle>
          <CardDescription>Enter your credentials to access the dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
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

