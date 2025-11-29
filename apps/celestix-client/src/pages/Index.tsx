import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { Header } from "@/components/layout/Header";
import { HomePage } from "@/pages/HomePage";
import { DiscoverPage } from "@/pages/DiscoverPage";
import { BookingPage } from "@/pages/BookingPage";
import { AdminDashboard } from "@/pages/AdminDashboard";
import { MovieDetailsPage } from "@/pages/MovieDetailsPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { FoodComboPage } from "@/pages/FoodComboPage";
import { ComingSoonPage } from "@/pages/ComingSoonPage";
import { EditProfilePage } from "@/pages/EditProfilePage";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState("home");
  const [authMode, setAuthMode] = useState<"login" | "register" | "forgot">("login");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);

  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/") {
      setCurrentPage("home");
      setSelectedMovieId(null);
    }
  }, [location.pathname]);

  const handlePageChange = (page: string, movieId?: string) => {
    if ((page === "booking" || page === "food") && !isAuthenticated) {
      setShowAuthModal(true);
      setCurrentPage(page);
      if (movieId) setSelectedMovieId(movieId);
      return;
    }
    setCurrentPage(page);
    if (movieId) setSelectedMovieId(movieId);
  };

  const handleAuthSuccess = (role: string) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setShowAuthModal(false);
    if (role === 'ADMIN') {
      setCurrentPage('admin');
    } else {
      if (currentPage === 'login' || currentPage === 'register' || currentPage === 'forgot') {
        setCurrentPage('home');
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setCurrentPage('home');
    setAuthMode("login");
    setShowAuthModal(true);
  };

  const handleLoginClick = () => {
    setAuthMode("login");
    setShowAuthModal(true);
  };

  const handleRegisterClick = () => {
    setAuthMode("register");
    setShowAuthModal(true);
  };

  if (showAuthModal && !isAuthenticated) {
    if (authMode === "register") {
      return (
        <RegisterForm
          onSwitchToLogin={() => setAuthMode("login")}
          onSuccess={() => handleAuthSuccess("CUSTOMER")}
        />
      );
    }
    if (authMode === "forgot") {
      return <ForgotPasswordForm onBack={() => setAuthMode("login")} />;
    }
    return (
      <LoginForm
        onSwitchToRegister={() => setAuthMode("register")}
        onForgotPassword={() => setAuthMode("forgot")}
        onLogin={handleAuthSuccess}
        onClose={() => setShowAuthModal(false)}
      />
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case "discover":
        return (
          <DiscoverPage
            onPageChange={handlePageChange}
            isAuthenticated={isAuthenticated}
          />
        );
      case "coming-soon":
        return (
          <ComingSoonPage
            onPageChange={handlePageChange}
            isAuthenticated={isAuthenticated}
          />
        );
      case "booking":
        return (
          <BookingPage
            movieId={selectedMovieId}
            onBack={() => setCurrentPage("home")}
          />
        );
      case "details":
        return (
          <MovieDetailsPage
            movieId={selectedMovieId}
            onPageChange={handlePageChange}
          />
        );
      case "profile":
        return <ProfilePage />;
      case "edit-profile":
        return <EditProfilePage />;
      case "food":
        return <FoodComboPage />;
      case "admin":
        return <AdminDashboard onLogout={handleLogout} />;
      default:
        return (
          <HomePage
            onPageChange={handlePageChange}
            isAuthenticated={isAuthenticated}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-cinema">
      {currentPage !== 'admin' && (
        <Header
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onLogout={handleLogout}
          onLoginClick={handleLoginClick}
          onRegisterClick={handleRegisterClick}
          isAuthenticated={isAuthenticated}
          userRole={userRole}
        />
      )}
      {renderPage()}
    </div>
  );
};

export default Index;
