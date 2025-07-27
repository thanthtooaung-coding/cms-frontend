import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Lock, Shield, Sparkles } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@cms/ui/components/select';
import { Alert, AlertDescription } from '@cms/ui/components/alert';
import { Link, useNavigate } from 'react-router';

import { useRegistrationStore } from '../../../store/register-store';
import { useMutation } from '@tanstack/react-query';
import { RegisterCMSAccount } from '@cms/data';
import { generateVerificationCode } from '../../../utils/generate-email-code';

const registerStepTwoSchema = z
  .object({
    username: z
      .string()
      .min(1, { message: 'Username is required' })
      .min(3, { message: 'Username must be at least 3 characters' }),
    role: z.string().min(1, { message: 'Please select a role' }),
    password: z
      .string()
      .min(1, { message: 'Password is required' })
      .min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterStepTwoData = z.infer<typeof registerStepTwoSchema>;

const RegisterStepTwo = () => {
  const navigate = useNavigate();
  const error = useRegistrationStore((state) => state.error);
  const setError = useRegistrationStore((state) => state.setError);
  const data = useRegistrationStore((state) => state.data);
  const prevStep = useRegistrationStore((state) => state.prevStep);
  const submitStepTwo = useRegistrationStore((state) => state.submitStepTwo);

  const form = useForm<RegisterStepTwoData>({
    resolver: zodResolver(registerStepTwoSchema),
    defaultValues: {
      username: data.username,
      role: data.role,
      password: data.password,
      confirmPassword: data.confirmPassword,
    },
  });

  const { isPending, mutateAsync } = useMutation({
    mutationFn: RegisterCMSAccount,
    onSuccess: (data) => {
      console.log(data);
      submitStepTwo({
        username: form.getValues('username'),
        role: form.getValues('role'),
        password: form.getValues('password'),
        confirmPassword: form.getValues('confirmPassword'),
        userId: data.data.user.id,
      });

      const verificationCode = generateVerificationCode();
      data.verificationCode = verificationCode;

      navigate('/onboarding/verify-email');
    },
  });

  const onSubmit = async (formData: RegisterStepTwoData) => {
    try {
      console.log('data', data);
      await mutateAsync({
        name: formData.username,
        role: formData.role,
        password: formData.password,
        email: data.email,
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'An error occurred while creating the account';

      setError(message);
      console.log(message);
    }
  };

  const goBack = () => {
    prevStep(); // Update Zustand store

    navigate('/onboarding/register'); // Navigate to the previous route
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-2 rounded-full mb-4">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span className="text-sm font-medium text-indigo-700">Step 2 of 5</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-3">Welcome to ContentFlow</h1>
        <p className="text-slate-600 text-lg">Let's start by getting to know you better</p>
      </div>
      {/* Error Alert */}

      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
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
                      disabled={isPending}
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
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Role</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isPending}
                    >
                      <SelectTrigger className="pl-10 h-12 w-full border-gray-200 focus:border-gray-900 focus:ring-gray-900 rounded-lg">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Available Roles</SelectLabel>
                          <SelectItem value="CMS_CUSTOMER">ROOT_ADMIN</SelectItem>
                          <SelectItem value="ROOT_ADMIN">CMS_CUSTOMER</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
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
                      disabled={isPending}
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
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      className="pl-10 h-12 border-gray-200 focus:border-gray-900 focus:ring-gray-900 rounded-lg"
                      disabled={isPending}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              disabled={isPending}
              className="flex-1 h-12 bg-transparent cursor-pointer"
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 h-12 cursor-pointer bg-slate-700 hover:bg-slate-800 text-white font-medium rounded-lg disabled:opacity-50"
            >
              {isPending ? 'Creating...' : 'Create Account'}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Button
                asChild
                variant="link"
                className="text-slate-700 hover:text-slate-800 font-medium p-0 h-auto"
              >
                <Link to="/login">Sign In Here</Link>
              </Button>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RegisterStepTwo;
