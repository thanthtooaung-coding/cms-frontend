import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Sparkles, ArrowRight } from 'lucide-react';
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
import { useNavigate } from 'react-router';
import { cn } from '@cms/ui/lib/utils';
import { useEffect } from 'react';
import { useRegistrationStore } from '../../../store/register-store';
import { Card, CardContent } from '@cms/ui/components/card';

const registerStepOneSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .min(2, { message: 'Name must be at least 2 characters' }),
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),
});

type RegisterStepOneData = z.infer<typeof registerStepOneSchema>;

const RegisterStepOne = () => {
  const navigate = useNavigate();
  const { data, isLoading, error, submitStepOne, setError } = useRegistrationStore();

  const form = useForm<RegisterStepOneData>({
    resolver: zodResolver(registerStepOneSchema),
    defaultValues: {
      name: data.name,
      email: data.email,
    },
  });

  useEffect(() => {
    if (error && form.formState.isDirty) {
      setError(null);
    }
  }, [form.watch('name'), form.watch('email'), error, setError, form.formState.isDirty]);

  const onSubmit = async (formData: RegisterStepOneData) => {
    await submitStepOne(formData);
    if (!error && !isLoading) {
      navigate('/onboarding/create-account');
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 ">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-2 rounded-full mb-4">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span className="text-sm font-medium text-indigo-700">Step 1 of 5</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-3">Welcome to ContentFlow</h1>
        <p className="text-slate-600 text-lg">Let's start by getting to know you better</p>
      </div>

      {/* Main Form Card */}
      <Card className="border-none border-slate-200  ">
        <CardContent className="space-y-6">
          {/* Error Alert */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Input
                          type="text"
                          placeholder="Enter your full name"
                          className={cn(
                            'h-12 pl-4 pr-4 border-2 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl transition-all duration-200',
                            'group-hover:border-slate-300',
                            form.formState.errors.name &&
                              'border-red-300 focus:border-red-500 focus:ring-red-100'
                          )}
                          disabled={isLoading}
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
                    <FormLabel className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          className={cn(
                            'h-12 pl-4 pr-4 border-2 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl transition-all duration-200',
                            'group-hover:border-slate-300',
                            form.formState.errors.email &&
                              'border-red-300 focus:border-red-500 focus:ring-red-100'
                          )}
                          disabled={isLoading}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12  text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 group"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Continue
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                )}
              </Button>
            </form>
          </Form>

          {/* Additional Info */}
          <div className="bg-gradient-to-r from-slate-50 to-indigo-50 rounded-xl p-4 border border-slate-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 text-sm mb-1">Why do we need this?</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We use your email to send important account updates and your name to personalize
                  your experience. Your information is secure and never shared.
                </p>
              </div>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="text-center pt-4 border-t border-slate-200">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <Button
                type="button"
                variant="link"
                className="text-indigo-600 hover:text-indigo-700 font-semibold p-0 h-auto"
                onClick={() => navigate('/auth')}
              >
                Sign In Here
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Trust Indicators */}
      <div className="flex items-center justify-center gap-6 mt-8 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span>Secure & Encrypted</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
          <span>GDPR Compliant</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-purple-500 rounded-full" />
          <span>No Spam</span>
        </div>
      </div>
    </div>
  );
};

export default RegisterStepOne;
