import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@cms/ui/components/button';
import { Home, ArrowLeft } from 'lucide-react';
import { Header } from './Layout/Header';
import { Search } from './search';
import { ProfileDropdown } from './profile-dropdown';
import { Main } from './Layout/main';

export const NotFound = () => {
  const navigate = useNavigate();
  const { tenantSlug } = useParams<{ tenantSlug?: string }>();

  const handleGoHome = () => {
    if (tenantSlug) {
      navigate(`/lms/${tenantSlug}`);
    } else {
      navigate('/');
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <Header>
        <Search />
        <div className="ml-auto flex items-center gap-4">
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-6 max-w-md">
            <div className="space-y-2">
              <h1 className="text-9xl font-bold text-slate-200">404</h1>
              <h2 className="text-3xl font-bold text-slate-900">Page Not Found</h2>
              <p className="text-slate-600">
                Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or doesn't exist.
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={handleGoBack} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
              <Button onClick={handleGoHome}>
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </div>
          </div>
        </div>
      </Main>
    </div>
  );
};

