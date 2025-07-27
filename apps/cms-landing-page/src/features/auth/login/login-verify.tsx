'use client';

import type React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Shield, ArrowLeft, RefreshCw } from 'lucide-react';
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
import { useEffect, useRef, useState } from 'react';

import { VerifyLoginMFA } from '@cms/data';
import { useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { useLoginStore } from '../../../store/login-store';
import useAuthStore from '../../../store/auth-store';

const mfaVerifySchema = z.object({
  mfaCode: z
    .string()
    .min(1, { message: 'Authentication code is required' })
    .length(6, { message: 'Authentication code must be 6 digits' })
    .regex(/^\d+$/, { message: 'Authentication code must contain only numbers' }),
});

type MfaVerifyData = z.infer<typeof mfaVerifySchema>;

const LoginMFAVerify = () => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { data, prevStep, clearState } = useLoginStore();
  const error = useLoginStore((state) => state.error);
  const setError = useLoginStore((state) => state.setError);
  const vefityMfa = useLoginStore((state) => state.setupMFA);

  const { setEmail } = useAuthStore();

  const [isVerified, setIsVerified] = useState(false);

  const navigate = useNavigate();

  const goBack = () => {
    prevStep();
    navigate('/auth');
  };

  const form = useForm<MfaVerifyData>({
    resolver: zodResolver(mfaVerifySchema),
    defaultValues: {
      mfaCode: '',
    },
  });

  useEffect(() => {
    const code = digits.join('');
    form.setValue('mfaCode', code);
    form.clearErrors('mfaCode');
  }, [digits, form]);

  // Auto-submit when all digits are filled
  useEffect(() => {
    const code = digits.join('');
    if (code.length === 6 && /^\d{6}$/.test(code)) {
      handleSubmit(code);
    }
  }, [digits]);

  const handleSubmit = async (code: string) => {
    try {
      await onSubmit(code);
    } catch (error) {}
  };

  const { isPending, mutateAsync } = useMutation({
    mutationFn: VerifyLoginMFA,
    onSuccess: (data) => {
      vefityMfa('');
      setIsVerified(true);
      clearState();
      setEmail(data.data.user.email);
      navigate('/');
    },
  });

  useEffect(() => {
    if (isVerified) {
      const timeout = setTimeout(() => {
        navigate('/');
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [isVerified, navigate]);

  const onSubmit = async (code: string) => {
    try {
      console.log('data', data);
      await mutateAsync({
        userId: data.userId,
        code,
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || 'An error occurred verifying MFA';

      setError(message);
      console.log(message);
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    // Only allow single digits
    if (value.length > 1) {
      value = value.slice(-1);
    }

    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newDigits = [...digits];

      if (newDigits[index]) {
        // Clear current digit
        newDigits[index] = '';
        setDigits(newDigits);
      } else if (index > 0) {
        // Move to previous input and clear it
        newDigits[index - 1] = '';
        setDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
        setFocusedIndex(index - 1);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);

    if (pastedData.length > 0) {
      const newDigits = ['', '', '', '', '', ''];
      for (let i = 0; i < pastedData.length && i < 6; i++) {
        newDigits[i] = pastedData[i];
      }
      setDigits(newDigits);

      // Focus the next empty input or the last input
      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
      setFocusedIndex(nextIndex);
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const clearCode = () => {
    setDigits(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    setFocusedIndex(0);
    form.clearErrors();
  };

  const code = digits.join('');
  const isCodeComplete = code.length === 6;

  if (isVerified) {
    return (
      <div className="w-full max-w-md mx-auto text-center p-6">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
          <Shield className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Verified</h2>
        <p className="text-gray-600">Your account has been successfully created.</p>
        <p className="text-sm text-gray-500 mt-2">Redirecting you to login...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Shield className="w-10 h-10 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Verify Your Code</h1>
        <p className="text-gray-600 leading-relaxed">
          Enter the 6-digit verification code from your authenticator app
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50 animate-in slide-in-from-top-2">
          <AlertDescription className="text-red-700 font-medium">{error}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => handleSubmit(data.mfaCode))}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="mfaCode"
            render={() => (
              <FormItem>
                <FormLabel className="sr-only">Authentication Code</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <div className="flex gap-3 justify-center" onPaste={handlePaste}>
                      {digits.map((digit, index) => (
                        <div key={index} className="relative">
                          <Input
                            ref={(el) => {
                              inputRefs.current[index] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleDigitChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onFocus={() => handleFocus(index)}
                            className={`
                              w-14 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all duration-200
                              ${
                                digit
                                  ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-md'
                                  : focusedIndex === index
                                    ? 'border-blue-400 bg-blue-25 shadow-lg ring-4 ring-blue-100'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                              }
                              ${error ? 'border-red-300 bg-red-50' : ''}
                              disabled:opacity-50 disabled:cursor-not-allowed
                            `}
                            disabled={isPending}
                            autoComplete="off"
                          />
                          {digit && (
                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full animate-in zoom-in-50" />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Progress indicator */}
                  </div>
                </FormControl>
                <FormMessage className="text-center mt-2" />
              </FormItem>
            )}
          />

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={goBack}
                disabled={isPending}
                className="flex-1 h-12 border-gray-300 hover:bg-gray-50 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                type="submit"
                disabled={isPending || !isCodeComplete}
                className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isPending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Code'
                )}
              </Button>
            </div>

            {/* Clear button */}
            {code.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                onClick={clearCode}
                disabled={isPending}
                className="w-full text-gray-600 hover:text-gray-800 animate-in fade-in-50"
              >
                Clear Code
              </Button>
            )}
          </div>

          {/* Help Section */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">
                Open your authenticator app and enter the current 6-digit code
              </p>
            </div>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={prevStep}
                className="text-gray-600 hover:text-gray-800 text-sm"
              >
                Need to see the QR code again?
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoginMFAVerify;
