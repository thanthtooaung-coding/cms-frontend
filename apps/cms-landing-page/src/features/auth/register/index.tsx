'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { Button } from '@cms/ui/components/button';
import { Input } from '@cms/ui/components/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@cms/ui/components/form';
import { Mail, Lock, User } from 'lucide-react';
import { Link } from 'react-router';

const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, { message: 'Username is required' })
      .min(3, { message: 'Username must be at least 3 characters' })
      .max(20, { message: 'Username must not exceed 20 characters' })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: 'Username can only contain letters, numbers, and underscores',
      }),
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Please enter a valid email address' }),
    password: z
      .string()
      .min(1, { message: 'Password is required' })
      .min(8, { message: 'Password must be at least 8 characters' })
      .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
      .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' })
      .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character' }),
    confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const [step, setStep] = useState(1);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onSubmit',
  });

  const validateStep1 = async () => {
    const result = await form.trigger(['username', 'email']);
    if (result) {
      setStep(2);
    }
  };

  const validateStep2AndSubmit = async () => {
    const result = await form.trigger(['password', 'confirmPassword']);
    if (result) {
      onSubmit(form.getValues());
    }
  };

  const onSubmit = (data: RegisterFormData) => {
    console.log('Register Form Data:', data);
    // Do registration logic here
  };

  return (
    <div className="space-y-4 w-full  ">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-700">Create Account</h1>
        <p className="text-gray-600 text-sm md:text-base">
          Join us and start managing your content
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {step === 1 && (
            <>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          type="text"
                          placeholder="Enter your username"
                          className="pl-10 h-10 sm:h-12 border-gray-100 focus:border-gray-900 focus:ring-gray-900 rounded-lg w-full text-xs sm:text-sm"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10 h-10 sm:h-12 border-gray-100 focus:border-gray-900 focus:ring-gray-900 rounded-lg w-full text-xs sm:text-sm"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                onClick={validateStep1}
                className="w-full h-9 sm:h-10 md:h-11 text-sm sm:text-base bg-gray-600 backdrop-blur-sm hover:bg-gray-700 text-white font-lg rounded-lg border border-white/30 shadow transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                Next
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          type="password"
                          placeholder="Create your password"
                          className="pl-10 h-10 sm:h-12 border-gray-100 focus:border-gray-900 focus:ring-gray-900 rounded-lg w-full text-xs sm:text-sm"
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
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          type="password"
                          placeholder="Confirm your password"
                          className="pl-10 h-10 sm:h-12 border-gray-100 focus:border-gray-900 focus:ring-gray-900 rounded-lg w-full text-xs sm:text-sm"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <div className="flex items-start">
                <input
                  type="checkbox"
                  required
                  className="rounded border-gray-100 text-gray-900 focus:ring-gray-900 mt-1"
                />
                <span className="ml-2 text-sm text-gray-600">
                  I agree to the{' '}
                  <Button
                    variant="link"
                    className="text-gray-700 hover:text-gray-800 p-0 h-auto text-sm"
                  >
                    Terms of Service
                  </Button>{' '}
                  and{' '}
                  <Button
                    variant="link"
                    className="text-gray-700 hover:text-gray-800 p-0 h-auto text-sm"
                  >
                    Privacy Policy
                  </Button>
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="w-1/3  h-9 sm:h-10 md:h-11  backdrop-blur-lg hover:bg-gray-200 text-black font-lg rounded-lg border border-white/30 shadow-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  onClick={validateStep2AndSubmit}
                  className="w-2/3 h-9 sm:h-10 md:h-11 bg-gray-600 backdrop-blur-sm hover:bg-gray-700 text-white font-lg rounded-lg border border-white/30 shadow transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  Create an account
                </Button>
              </div>
            </>
          )}
        </form>
      </Form>

      <div className="text-center pt-2 border-t border-gray-100">
        <p className="text-xs sm:text-sm text-gray-600">
          Already have an account?{' '}
          <Button
            asChild
            type="button"
            variant="link"
            className="text-gray-700 text-sm font-medium hover:text-gray-800 p-0 h-auto"
          >
            <Link to="/login">Sign In Here</Link>
          </Button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
