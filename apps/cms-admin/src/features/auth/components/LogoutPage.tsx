import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthDataStore } from '../../../store/auth-store';

const LogoutPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuthDataStore();

  useEffect(() => {
    logout();
    navigate('/login');
  }, [navigate, logout]);

  return null;
};

export default LogoutPage;









