import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router';
import { AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import { Input } from '@cms/ui/components/input';
import { Textarea } from '@cms/ui/components/textarea';
import { Button } from '@cms/ui/components/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@cms/ui/components/select';
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormField,
  FormMessage,
} from '@cms/ui/components/form';
import { ImageUploader } from '@cms/ui/components/ImageUploader';
import { useMutation } from '@tanstack/react-query';
import { uploadFile } from '@cms/data';
import { Alert, AlertTitle, AlertDescription } from '@cms/ui/components/alert';
import { useEffect, useState } from 'react';
import { useAuthDataStore } from '../../store/auth-store';

const schema = z.object({
  requestType: z.enum([
    'LMS',
    'E-Commerce System',
    'Booking System',
    'Agency Management System',
  ]),
  title: z.string().min(1, 'Page title is required'),
  pageDescription: z.string().min(1, 'Page description is required'),
  pageUrl: z.string().url('Must be a valid URL'),
  pageLogo: z
    .instanceof(File, { message: 'Logo image is required' })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: 'Logo must be under 5MB',
    }),
});

type PageRequestFormData = z.infer<typeof schema>;

export default function PageRequestForm() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthDataStore();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const form = useForm<PageRequestFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      requestType: 'LMS',
      title: '',
      pageDescription: '',
      pageUrl: '',
      pageLogo: undefined as any,
    },
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  const watchedTitle = form.watch('title');
  const watchedRequestType = form.watch('requestType');

  useEffect(() => {
    if (watchedRequestType === 'LMS') {
      const sanitizedTitle = watchedTitle.trim().toLowerCase().replace(/\s+/g, '-');
      form.setValue('pageUrl', `http://localhost:5176/lms/${sanitizedTitle}`, {
        shouldValidate: true,
      });
    } else if (watchedRequestType === 'E-Commerce System') {
      const sanitizedTitle = watchedTitle.replace(/\s+/g, '');
      form.setValue('pageUrl', `http://localhost:5178/ecommerce/${sanitizedTitle}`, {
        shouldValidate: true,
      });
    } else if (watchedRequestType === 'Booking System') {
      const sanitizedTitle = watchedTitle.replace(/\s+/g, '');
      form.setValue('pageUrl', `http://localhost:5180/booking/${sanitizedTitle}`, {
        shouldValidate: true,
      });
    } else if (watchedRequestType === 'Agency Management System') {
      const sanitizedTitle = watchedTitle.replace(/\s+/g, '');
      form.setValue('pageUrl', `http://localhost:5182/agency/${sanitizedTitle}`, {
        shouldValidate: true,
      });
    }
  }, [watchedTitle, watchedRequestType, form.setValue]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: PageRequestFormData) => {
      if (!user || !isAuthenticated()) {
        throw new Error('You must be logged in to submit a page request');
      }

      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Upload logo file
      const uploadResponse = await uploadFile(data.pageLogo);
      const logoUrl = uploadResponse.url;

      if (!logoUrl) {
        throw new Error('File upload succeeded, but no URL was returned.');
      }

      // Create form data for page request
      const formData = new FormData();
      formData.append('ownerId', user.id);
      formData.append('requestType', data.requestType);
      formData.append('title', data.title);
      formData.append('pageDescription', data.pageDescription);
      formData.append('pageUrl', data.pageUrl);
      formData.append('logoUrl', logoUrl);

      // Submit page request with authentication
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001/api';
      const response = await fetch(`${API_BASE_URL}/cms/page-request`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to submit page request' }));
        throw new Error(error.message || 'Failed to submit page request');
      }

      const result = await response.json();
      return result;
    },
    onSuccess: (data: any) => {
      setErrorMessage(null);
      setSuccessMessage(data.message || 'Page request submitted successfully!');
      form.reset();
    },
    onError: (error: any) => {
      setSuccessMessage(null);
      const message = error?.message || 'An unexpected error occurred. Please try again.';
      setErrorMessage(message);
    },
  });

  const onSubmit = (data: PageRequestFormData) => {
    setErrorMessage(null);
    mutate(data);
  };

  return (
    <section className="min-h-screen  py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Request Your Custom Page</h1>
            <p className="text-gray-600">
              Tell us about your project and we'll get back to you within 24 hours
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {successMessage && (
                <Alert variant="success">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}
              {errorMessage && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Submission Failed</AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
              {/* Page Type */}
              <FormField
                control={form.control}
                name="requestType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page Type</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isPending}
                      >
                        <SelectTrigger className="w-full h-12 border rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500">
                          <SelectValue placeholder="Select a page type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LMS">Learning Management System</SelectItem>
                          <SelectItem value="E-Commerce System">E-Commerce System</SelectItem>
                          <SelectItem value="Booking System">Booking System</SelectItem>
                          <SelectItem value="Agency Management System">Agency Management System</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Page Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter the title" disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Page Description */}
              <FormField
                control={form.control}
                name="pageDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Describe your page..." rows={4} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Page Link */}
              <FormField
                control={form.control}
                name="pageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page Link</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://example.com" disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ImageUploader */}
              <Controller
                name="pageLogo"
                control={form.control}
                render={({ field }) => {
                  const handleChange = (file: File | string | null) => {
                    field.onChange(file ?? null);
                    field.onBlur();
                  };

                  return (
                    <FormItem>
                      <FormLabel>Page Logo</FormLabel>
                      <ImageUploader value={field.value ?? null} onChange={handleChange} />
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* Submit */}
              <Button type="submit" className="w-full h-12" disabled={isPending}>
                {isPending ? 'Submitting...' : 'Submit Request'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
