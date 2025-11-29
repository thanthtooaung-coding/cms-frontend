import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import RootLayout from './components/RootLayout';
import MyLearningPage from './Pages/MyLearningPage';
import ExplorePage from './Pages/Explore';
import HomePage from './Pages/HomePage';
import CourseDetail from './Pages/CourseDetail';
import CourseLesson from './Pages/CourseLesson';
import TeacherDetail from './Pages/TeacherDetail';
import SettingsPage from './Pages/SettingsPage';
import { LoginAuthForm } from './features/auth/components/LoginAuthForm';
import { RegisterForm } from './features/auth/components/RegisterForm';
const About = lazy(() => import('./features/about/app'));
const Client = lazy(() => import('./features/client/app'));
const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<p>Loading...</p>}>
    <Component />
  </Suspense>
);
export const router = createBrowserRouter([
  {
    path : "/lms/:tenantSlug",
    element : <RootLayout/>,
    children: [
      {
        path : "",
        index: true,
        element : <HomePage/>,
        // HomePage will be protected by RootLayout auth check
      },
      {
        path: "my-learning", 
        element: <MyLearningPage />
      },
      {
        path: "courses",
        element: <ExplorePage />
      },
      {
        path : "course/:id",
        element : <CourseDetail/>
      },
      {
        path : "course/:id/lesson",
        element : <CourseLesson/>
      },
      {
        path : "teacher/:id",
        element : <TeacherDetail/>
      },
      {
        path: "settings",
        element: <SettingsPage />
      }
    ]
  },
  {
    path: "/lms/:tenantSlug/login",
    element: <LoginAuthForm />
  },
  {
    path: "/lms/:tenantSlug/register",
    element: <RegisterForm />
  },
  {
    path : "/",
    element : <RootLayout/>,
    children: [
      {
        path : "/",
        element : <HomePage/>,
        // HomePage will be protected by RootLayout auth check
      },
      {
        path: "my-learning", 
        element: <MyLearningPage />
      },
      {
        path: "courses",
        element: <ExplorePage />
      },
      {
        path : "course/:id",
        element : <CourseDetail/>
      },
      {
        path : "course/:id/lesson",
        element : <CourseLesson/>
      },
      {
        path : "teacher/:id",
        element : <TeacherDetail/>
      },
      {
        path: "settings",
        element: <SettingsPage />
      }
    ]
  },
  {
    path: "/login",
    element: <LoginAuthForm />
  },
  {
    path: "/register",
    element: <RegisterForm />
  }
]);
