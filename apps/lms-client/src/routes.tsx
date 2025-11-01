import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import RootLayout from './components/RootLayout';
import MyLearningPage from './Pages/MyLearningPage';
import ExplorePage from './Pages/Explore';
import HomePage from './Pages/HomePage';
import CourseDetail from './Pages/CourseDetail';
import CourseLesson from './Pages/CourseLesson';
//import { LoginAuthForm } from './features/auth/components/LoginAuthForm';
const About = lazy(() => import('./features/about/app'));
const Client = lazy(() => import('./features/client/app'));
const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<p>Loading...</p>}>
    <Component />
  </Suspense>
);
export const router = createBrowserRouter([
  {
    path : "/",
    element : <RootLayout/>,
    children: [
      {
        path : "/",
        element : <HomePage/>
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
        path : "course-detail",
        element : <CourseDetail/>
      },
      {
        path : "course-lesson",
        element : <CourseLesson/>
        
      }
    ]
  }
]);
