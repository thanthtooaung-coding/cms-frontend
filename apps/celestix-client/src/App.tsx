import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet, Navigate, useNavigate, useParams, useLocation } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import NotFound from "./pages/NotFound";
import { AddMoviePage } from "./pages/AddMoviePage";
import { AddFoodPage } from "./pages/AddFoodPage";
import { AddShowtimePage } from "./pages/AddShowtimePage";
import { TheaterSeatPricingPage } from "./pages/TheaterSeatPricingPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { EditMoviePage } from "./pages/EditMoviePage";
import { EditFoodPage } from "./pages/EditFoodPage";
import { EditShowtimePage } from "./pages/EditShowtimePage";
import { AddAdminPage } from "./pages/AddAdminPage";
import { EditProfilePage } from "./pages/EditProfilePage";
import { AddFoodCategoryPage } from "./pages/AddFoodCategoryPage";
import { AddMovieGenrePage } from "./pages/AddMovieGenrePage";
import { HomePage } from "./pages/HomePage";
import { DiscoverPage } from "./pages/DiscoverPage";
import { ComingSoonPage } from "./pages/ComingSoonPage";
import { MovieDetailsPage } from "./pages/MovieDetailsPage";
import { BookingPage } from "./pages/BookingPage";
import { FoodComboPage } from "./pages/FoodComboPage";
import { ProfilePage } from "./pages/ProfilePage";
import { LoginForm } from "./components/auth/LoginForm";
import { RegisterForm } from "./components/auth/RegisterForm";
import { ForgotPasswordForm } from "./components/auth/ForgotPasswordForm";
import { MoviesTable } from "./components/movies/MoviesTable";
import { MovieGenreTable } from "./components/admin/MovieGenreTable";
import { FoodTable } from "./components/admin/FoodTable";
import { FoodCategoryTable } from "./components/admin/FoodCategoryTable";
import { ShowtimesTable } from "./components/admin/ShowtimesTable";
import { TheatersTable } from "./components/admin/TheatersTable";
import { BookingsTable } from "./components/admin/BookingsTable";
import { DashboardStats } from "./components/dashboard/DashboardStats";
import React from "react";
import { AdminsTable } from "./components/admin/AdminsTable";
import { AddComboPage } from "./pages/AddComboPage";
import { EditComboPage } from "./pages/EditComboPage";
import { BookingRefundsTable } from "./components/admin/BookingRefundsTable";
import { EditMovieGenrePage } from "./pages/EditMovieGenrePage";
import AboutPage from "./pages/AboutPage";
import ServicePage from "./pages/ServicePage";
import ChatbotPage from "./pages/ChatbotPage";
import { ChangePasswordPage } from "./pages/ChangePasswordPage";
import { TenantProvider } from "./context/TenantContext";
import { useAuthDataStore } from "./store/auth-store";

const queryClient = new QueryClient();

// Function to check if user is authenticated
const isAuthenticated = () => {
  return useAuthDataStore.getState().user !== null;
};

// Component for protected routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    const { tenantSlug } = useParams<{ tenantSlug?: string }>();
    const redirectPath = tenantSlug ? `/bms/${tenantSlug}/login` : '/login';
    return <Navigate to={redirectPath} replace />;
  }
  return <>{children}</>;
};

// Layout for user-facing pages
const UserLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { tenantSlug } = useParams<{ tenantSlug?: string }>();
    const { user, clearUser } = useAuthDataStore();
    const [isAuthenticatedState, setIsAuthenticatedState] = React.useState(isAuthenticated());

    const handleLogout = () => {
        clearUser();
        setIsAuthenticatedState(false);
        const redirectPath = tenantSlug ? `/bms/${tenantSlug}` : '/';
        navigate(redirectPath);
    };

    const basePath = tenantSlug ? `/bms/${tenantSlug}` : '';
    
    // Check if current route is an admin route
    const isAdminRoute = location.pathname.includes('/admin');
    
    return (
        <div className="min-h-screen bg-gradient-cinema">
            {!isAdminRoute && (
                <Header
                    currentPage=""
                    onPageChange={()=>{}}
                    onLogout={handleLogout}
                    onLoginClick={() => navigate(`${basePath}/login`)}
                    onRegisterClick={() => navigate(`${basePath}/register`)}
                    isAuthenticated={isAuthenticatedState}
                    userRole={user?.role || localStorage.getItem("role")}
                />
            )}
            <Outlet />
        </div>
    );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Multi-tenant Routes */}
          <Route path="/bms/:tenantSlug" element={<TenantProvider><UserLayout /></TenantProvider>}>
            <Route index element={<HomePage />} />
            <Route path="discover" element={<DiscoverPage onPageChange={() => {}} isAuthenticated={isAuthenticated()} />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="services" element={<ServicePage />} />
            <Route path="chatbot" element={<ChatbotPage />} />
            <Route path="coming-soon" element={<ComingSoonPage onPageChange={() => {}} isAuthenticated={isAuthenticated()} />} />
            <Route path="movies/:id" element={<MovieDetailsPage movieId={null} onPageChange={() => {}} />} />
            <Route path="booking/:id" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
            <Route path="food" element={<ProtectedRoute><FoodComboPage /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="edit-profile" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
            <Route path="admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}>
              <Route index element={<DashboardStats />} />
              <Route path="movies" element={<MoviesTable />} />
              <Route path="movies/add" element={<AddMoviePage />} />
              <Route path="movies/edit/:id" element={<EditMoviePage />} />
              <Route path="movie-genres" element={<MovieGenreTable />} />
              <Route path="movie-genres/add" element={<AddMovieGenrePage />} />
              <Route path="movie-genres/edit/:id" element={<EditMovieGenrePage />} />
              <Route path="food" element={<FoodTable />} />
              <Route path="food/add" element={<AddFoodPage />} />
              <Route path="food/edit/:id" element={<EditFoodPage />} />
              <Route path="food-categories" element={<FoodCategoryTable />} />
              <Route path="food-categories/add" element={<AddFoodCategoryPage />} />
              <Route path="showtimes" element={<ShowtimesTable />} />
              <Route path="showtimes/add" element={<AddShowtimePage />} />
              <Route path="showtimes/edit/:id" element={<EditShowtimePage />} />
              <Route path="theaters" element={<TheatersTable />} />
              <Route path="theaters/:theaterId/pricing" element={<TheaterSeatPricingPage />} />
              <Route path="bookings" element={<BookingsTable />} />
              <Route path="admins" element={<AdminsTable />} />
              <Route path="admins/add" element={<AddAdminPage />} />
              <Route path="change-password" element={<ChangePasswordPage />} />
              <Route path="combo" element={<AddComboPage />} />
              <Route path="combo/edit/:id" element={<EditComboPage />} />
              <Route path="refunds" element={<BookingRefundsTable />} />
            </Route>
          </Route>

          {/* Auth Routes with tenant */}
          <Route path="/bms/:tenantSlug/login" element={<TenantProvider><LoginForm /></TenantProvider>} />
          <Route path="/bms/:tenantSlug/register" element={<TenantProvider><RegisterForm /></TenantProvider>} />
          <Route path="/bms/:tenantSlug/forgot-password" element={<TenantProvider><ForgotPasswordForm /></TenantProvider>} />

          {/* Legacy Routes (without tenant) */}
          <Route element={<UserLayout />}>
            <Route index path="/" element={<HomePage />} />
            <Route path="/discover" element={<DiscoverPage onPageChange={() => {}} isAuthenticated={isAuthenticated()} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicePage />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
            <Route path="/coming-soon" element={<ComingSoonPage onPageChange={() => {}} isAuthenticated={isAuthenticated()} />} />
            <Route path="/movies/:id" element={<MovieDetailsPage movieId={null} onPageChange={() => {}} />} />
            <Route path="/booking/:id" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
            <Route path="/food" element={<ProtectedRoute><FoodComboPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/edit-profile" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
          </Route>

          {/* Legacy Auth Routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />

          {/* Legacy Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}>
            <Route index element={<DashboardStats />} />
            <Route path="movies" element={<MoviesTable />} />
            <Route path="movies/add" element={<AddMoviePage />} />
            <Route path="movies/edit/:id" element={<EditMoviePage />} />
            <Route path="movie-genres" element={<MovieGenreTable />} />
            <Route path="movie-genres/add" element={<AddMovieGenrePage />} />
            <Route path="movie-genres/edit/:id" element={<EditMovieGenrePage />} />
            <Route path="food" element={<FoodTable />} />
            <Route path="food/add" element={<AddFoodPage />} />
            <Route path="food/edit/:id" element={<EditFoodPage />} />
            <Route path="food-categories" element={<FoodCategoryTable />} />
            <Route path="food-categories/add" element={<AddFoodCategoryPage />} />
            <Route path="showtimes" element={<ShowtimesTable />} />
            <Route path="showtimes/add" element={<AddShowtimePage />} />
            <Route path="showtimes/edit/:id" element={<EditShowtimePage />} />
            <Route path="theaters" element={<TheatersTable />} />
            <Route path="theaters/:theaterId/pricing" element={<TheaterSeatPricingPage />} />
            <Route path="bookings" element={<BookingsTable />} />
            <Route path="admins" element={<AdminsTable />} />
            <Route path="admins/add" element={<AddAdminPage />} />
            <Route path="combo" element={<AddComboPage />} />
            <Route path="combo/edit/:id" element={<EditComboPage />} />
            <Route path="refunds" element={<BookingRefundsTable />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
