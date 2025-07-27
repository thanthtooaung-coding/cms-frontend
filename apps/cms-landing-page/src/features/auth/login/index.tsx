import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock } from 'lucide-react';
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
import { useMutation } from '@tanstack/react-query';
import { LoginCMSAccount } from '@cms/data';
import { useLoginStore } from '../../../store/login-store';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const { Login, setError } = useLoginStore();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { isPending, mutateAsync } = useMutation({
    mutationFn: LoginCMSAccount,
    onSuccess: (data) => {
      console.log('Login successful:', data.data.user.id);
      Login({
        userId: data.data.user.id,
      });

      navigate('/auth/mfa');
    },
    onError: (error) => {
      console.error('Login failed:', error);
      // Handle login error, e.g., show error message
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await mutateAsync({
        email: data.email,
        password: data.password,
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'An error occurred while creating the account';

      setError(message);
      console.log(message);
      // Handle form submission error
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

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 h-12 border-gray-200 focus:border-gray-900 focus:ring-gray-900 rounded-lg"
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
              disabled={isPending}
              className="w-full h-12 bg-slate-700 hover:bg-slate-800 text-white font-medium rounded-lg"
            >
              {isPending ? 'Logging in...' : 'Log In'}
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
