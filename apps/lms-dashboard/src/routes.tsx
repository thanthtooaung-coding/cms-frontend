import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthenticatedLayout } from './components/Layout/authenticated-layout';
import { LoginAuthForm } from './features/auth/components/LoginAuthForm';
import { EnrollmentLoader } from './router/loader/data-loader';
import { CourseLoader } from './router/loader/data-loader';
import CreateInstructor from './features/instructor/components/CreateInstructor';

const Dashboard = lazy(() => import('./features/dashboard/app'));
const CourseApp = lazy(() => import('./features/course/app'));
const Category = lazy(() => import('./features/category/app'));
const Instructor = lazy(() => import('./features/instructor/app'));
const Enrollment = lazy(() => import('./features/enrollment/app'));
const CourseDetail = lazy(() => import('./features/course/components/CourseDetail'));
const CreateCategory = lazy(() => import('./features/category/components/CreateCategory'));
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
    path: '/',
    element: <AuthenticatedLayout />,
    children: [
      {
        path: '/',
        index: true,
        element: withSuspense(Dashboard),
      },
      {
        path: '/course',
        children: [
          {
            path: '',
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
        path: '/category',
        children: [
          {
            path: '',
            index: true,
            element: withSuspense(Category),
          },
          {
            path: 'create',
            element: withSuspense(CreateCategory),
          },
          {
            path: ':id/edit',
            element: <p>Edit Category</p>,
          },
        ],
      },
      {
        path: '/instructor',
        children: [
          {
            path: '',
            index: true,
            element: withSuspense(Instructor),
          },
          {
            path: 'create',
            element: withSuspense(CreateInstructor),
          },
          {
            path: ':id',
            element: withSuspense(InstructorDetail),
          },
          {
            path: ':id/edit',
            element: withSuspense(EditInstructor),
          },
        ],
      },
      {
        path: '/enrollment',
        children: [
          {
            path: '',
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
    ],
  },
  {
    path: '/login',
    element: <LoginAuthForm />,
  },
  {
    path: '/logout',
  },
]);