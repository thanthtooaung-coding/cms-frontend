import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, RefreshCw } from 'lucide-react';
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
import { Alert, AlertDescription } from '@cms/ui/components/alert';
import { Link, useNavigate } from 'react-router';

import { useEffect, useState } from 'react';
import { useRegistrationStore } from '../../../store/register-store';

const verifyEmailSchema = z.object({
  verificationCode: z
    .string()
    .min(1, { message: 'Verification code is required' })
    .length(6, { message: 'Verification code must be 6 digits' }),
});

type VerifyEmailData = z.infer<typeof verifyEmailSchema>;

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { data, isLoading, error, verifyEmail, setCurrentStep, prevStep, setError } =
    useRegistrationStore();
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const form = useForm<VerifyEmailData>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      verificationCode: data.verificationCode,
    },
  });

  useEffect(() => {
    setCurrentStep(3);
  }, [setCurrentStep]);

  // Clear error when form values change
  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [form.watch(), error, setError]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // const {isPending , mutateAsync, isError} = useMutation({
  //   mutationKey: ['verifyEmail'],
  //   mutationFn: verifyEmail,
  //   onSuccess: () => {
  //     // toast.success('Email verified successfully!');
  //     form.reset();
  //   },
  //   onError: (error) => {
  //     setError(error.message);
  //   },
  // });

  const onSubmit = async (formData: VerifyEmailData) => {
    await verifyEmail(formData.verificationCode);

    if (!error && !isLoading) {
      navigate('/onboarding/mfa-setup');
    }
  };

  const goBack = () => {
    prevStep();
    navigate('/onboarding/create-account');
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setResendCooldown(60); // 60 second cooldown
    } catch (error) {
      setError('Failed to resend verification code');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Verify Your Email</h2>
        <p className="text-gray-600 mb-2">We've sent a verification code to</p>
        <p className="text-gray-900 font-medium">{data.email}</p>
      </div>

      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="verificationCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Verification Code
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter 6-digit code"
                    className="h-12 text-center text-lg font-mono tracking-widest border-gray-200 focus:border-gray-900 focus:ring-gray-900 rounded-lg"
                    maxLength={6}
                    disabled={isLoading}
                    {...field}
                    onChange={(e) => {
                      // Only allow numbers
                      const value = e.target.value.replace(/\D/g, '');
                      field.onChange(value);
                    }}
                  />
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
              disabled={isLoading}
              className="flex-1 h-12 bg-transparent"
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={isLoading || form.watch('verificationCode')?.length !== 6}
              className="flex-1 h-12 bg-slate-700 hover:bg-slate-800 text-white font-medium rounded-lg disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </Button>
          </div>

          {/* Resend Code */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
            <Button
              type="button"
              variant="link"
              onClick={handleResendCode}
              disabled={resendLoading || resendCooldown > 0}
              className="text-slate-700 hover:text-slate-800 font-medium p-0 h-auto"
            >
              {resendLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : resendCooldown > 0 ? (
                `Resend in ${resendCooldown}s`
              ) : (
                'Resend Code'
              )}
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

export default VerifyEmail;
