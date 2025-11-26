import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router';

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
import { PasswordInput } from '../../../components/utils/password-input';
import { signup } from '../../../api/authApi';
import { useAuthDataStore } from '../../../store/auth-store';

export const SignupFormSchema = z.object({
  username: z
    .string()
    .min(1, { message: 'Please enter a username' })
    .min(3, { message: 'Username must be at least 3 characters long' }),
  password: z
    .string()
    .min(1, { message: 'Please enter a password' })
    .min(7, { message: 'Password must be at least 7 characters long' }),
  email: z
    .string()
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
  name: z.string().optional(),
  address: z.string().optional(),
  phone_number: z.string().optional(),
});

export function SignupForm() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser } = useAuthDataStore();

  const form = useForm<z.infer<typeof SignupFormSchema>>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      username: '',
      password: '',
      email: '',
      name: '',
      address: '',
      phone_number: '',
    },
  });

  async function onSubmit(data: z.infer<typeof SignupFormSchema>) {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await signup({
        username: data.username,
        password: data.password,
        email: data.email,
        name: data.name || undefined,
        address: data.address || undefined,
        phone_number: data.phone_number || undefined,
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
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6">
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
                    <Input placeholder="Enter username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="name@example.com" {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Address (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Phone Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Error Message */}
            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" className="mt-2 w-full cursor-pointer" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Sign Up'}
            </Button>

            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

