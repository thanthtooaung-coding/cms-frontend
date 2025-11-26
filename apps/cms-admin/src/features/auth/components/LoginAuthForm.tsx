import type { HTMLAttributes } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '@cms/ui/components/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@cms/ui/components/form';

import { Input } from '@cms/ui/components/input';

import { Link } from 'react-router';
import { PasswordInput } from '../../../components/utils/password-input';
import { login } from '../../../api/authApi';
import { useAuthDataStore } from '../../../store/auth-store';

type UserAuthFormProps = HTMLAttributes<HTMLDivElement>;

export const LoginformSchema = z.object({
  username: z
    .string()
    .min(1, { message: 'Please enter your username' })
    .min(3, { message: 'Username must be at least 3 characters long' }),
  password: z
    .string()
    .min(1, {
      message: 'Please enter your password',
    })
    .min(7, {
      message: 'Password must be at least 7 characters long',
    }),
});

export function LoginAuthForm({ className, ...props }: UserAuthFormProps) {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser } = useAuthDataStore();

  const form = useForm<z.infer<typeof LoginformSchema>>({
    resolver: zodResolver(LoginformSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(data: z.infer<typeof LoginformSchema>) {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await login({
        username: data.username,
        password: data.password,
      });

      // Store token and user
      localStorage.setItem('auth_token', response.token);
      const { setToken } = useAuthDataStore.getState();
      setToken(response.token);
      setUser({
        id: response.user.id.toString(),
        name: response.user.name || response.user.username,
        email: response.user.email,
      });

      // Navigate to dashboard
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={'grid gap-6'} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-muted-foreground hover:opacity-75"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Error Message */}
            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" className="mt-2 w-full cursor-pointer" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
