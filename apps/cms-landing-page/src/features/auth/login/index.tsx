import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Lock } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@cms/ui/components/form';
import { Button } from '@cms/ui/components/button';
import { Input } from '@cms/ui/components/input';
import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import { login } from '../../../api/authApi';
import { useAuthDataStore } from '../../../store/auth-store';
import { Alert, AlertDescription } from '@cms/ui/components/alert';

const loginSchema = z.object({
  username: z
    .string()
    .min(1, { message: 'Username is required' })
    .min(3, { message: 'Username must be at least 3 characters' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(7, { message: 'Password must be at least 7 characters' }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser, setToken } = useAuthDataStore();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await login({
        username: data.username,
        password: data.password,
      });

      // Store token and user
      setToken(response.token);
      setUser({
        id: response.user.id.toString(),
        name: response.user.name || response.user.username,
        email: response.user.email,
      });

      // Navigate to home page
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Username</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Enter your username"
                        className="pl-10 h-12 border-gray-200 focus:border-gray-900 focus:ring-gray-900 rounded-lg"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        className="pl-10 h-12 border-gray-200 focus:border-gray-900 focus:ring-gray-900 rounded-lg"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-gray-900 focus:ring-gray-900 h-4 w-4"
                />
                <span className="text-sm text-gray-700">Remember me</span>
              </label>
              <Button
                variant="link"
                className="text-sm text-gray-500 hover:text-gray-700 p-0 h-auto"
              >
                Forgot password?
              </Button>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-slate-700 hover:bg-slate-800 text-white font-medium rounded-lg"
            >
              {isSubmitting ? 'Logging in...' : 'Log In'}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-6 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Button
              asChild
              variant="link"
              className="text-slate-700 hover:text-slate-800 font-medium p-0 h-auto"
            >
              <Link to="/onboarding/register">Create one here</Link>
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
