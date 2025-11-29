import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthenticatedLayout } from './components/Layout/authenticated-layout';
import { LoginAuthForm } from './features/auth/components/LoginAuthForm';
import { EnrollmentLoader } from './router/loader/data-loader';
import { CourseLoader } from './router/loader/data-loader';
import CreateInstructor from './features/instructor/components/CreateInstructor';
import { RoleProtectedRoute } from './components/RoleProtectedRoute';
import { NotFound } from './components/NotFound';

const Dashboard = lazy(() => import('./features/dashboard/app'));
const CourseApp = lazy(() => import('./features/course/app'));
const Category = lazy(() => import('./features/category/app'));
const Instructor = lazy(() => import('./features/instructor/app'));
const Enrollment = lazy(() => import('./features/enrollment/app'));
const Settings = lazy(() => import('./features/settings/app'));
const CourseDetail = lazy(() => import('./features/course/components/CourseDetail'));
const CreateCategory = lazy(() => import('./features/category/components/CreateCategory'));
const EditCategory = lazy(() => import('./features/category/components/EditCategory'));
const CreateCourse = lazy(() => import('./features/course/form/CreateCourse'));
const EditCourse = lazy(() => import('./features/course/form/EditCourse'));
const InstructorDetail = lazy(() => import('./features/instructor/components/InstructorDetail'));
const EditInstructor = lazy(() => import('./features/instructor/components/EditInstructor'));

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<p>Loading...</p>}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/lms/:tenantSlug',
    element: <AuthenticatedLayout />,
    children: [
      {
        index: true,
        element: withSuspense(Dashboard),
      },
      {
        path: 'course',
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<p>Loading...</p>}>
                <CourseApp />
              </Suspense>
            ),
            // loader : CourseLoader
          },
          {
            path: 'create',
            element: withSuspense(CreateCourse),
          },
          {
            path: ':id',
            element: withSuspense(CourseDetail),
          },
          {
            path: ':id/edit',
            element: withSuspense(EditCourse),
          },
        ],
      },
      {
        path: 'category',
        children: [
          {
            index: true,
            element: (
              <RoleProtectedRoute allowedRoles={['Owner', 'Admin']}>
                {withSuspense(Category)}
              </RoleProtectedRoute>
            ),
          },
          {
            path: 'create',
            element: (
              <RoleProtectedRoute allowedRoles={['Owner', 'Admin']}>
                {withSuspense(CreateCategory)}
              </RoleProtectedRoute>
            ),
          },
          {
            path: ':id/edit',
            element: (
              <RoleProtectedRoute allowedRoles={['Owner', 'Admin']}>
                {withSuspense(EditCategory)}
              </RoleProtectedRoute>
            ),
          },
        ],
      },
      {
        path: 'instructor',
        children: [
          {
            index: true,
            element: (
              <RoleProtectedRoute allowedRoles={['Owner', 'Admin']}>
                {withSuspense(Instructor)}
              </RoleProtectedRoute>
            ),
          },
          {
            path: 'create',
            element: (
              <RoleProtectedRoute allowedRoles={['Owner', 'Admin']}>
                {withSuspense(CreateInstructor)}
              </RoleProtectedRoute>
            ),
          },
          {
            path: ':id',
            element: (
              <RoleProtectedRoute allowedRoles={['Owner', 'Admin']}>
                {withSuspense(InstructorDetail)}
              </RoleProtectedRoute>
            ),
          },
          {
            path: ':id/edit',
            element: (
              <RoleProtectedRoute allowedRoles={['Owner', 'Admin']}>
                {withSuspense(EditInstructor)}
              </RoleProtectedRoute>
            ),
          },
        ],
      },
      {
        path: 'enrollment',
        children: [
          {
            index: true,
            element: withSuspense(Enrollment),
            loader: EnrollmentLoader,
          },
          {
            path: 'create',
            element: <p>New Enrollment</p>,
          },
          {
            path: ':id/edit',
            element: <p>Edit Enrollment</p>,
          },
        ],
      },
      {
        path: 'settings',
        element: withSuspense(Settings),
      },
      {
        path: 'help-center',
        element: <NotFound />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
  {
    path: '/lms/:tenantSlug/login',
    element: <LoginAuthForm />,
  },
  {
    path: '/login',
    element: <LoginAuthForm />,
  },
  {
    path: '/logout',
  },
]);