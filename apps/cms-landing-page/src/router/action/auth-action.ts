import { getApiClient } from '@cms/data';
import axios, { AxiosError } from 'axios';
import { ActionFunctionArgs, redirect } from 'react-router';

const AuthApi = import.meta.env.VITE_BACKEND_SERVER;

export const authApi = axios.create({
  baseURL: AuthApi,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const LoginAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const credentials = Object.fromEntries(formData);

  try {
    const response = await authApi.post('/auth/login', credentials);

    if (response.status !== 200) {
      return { error: response.data.error || 'Login Failed' };
    }
    const redirectTo = new URL(request.url).searchParams.get('redirect') || '/';
    return redirect(redirectTo);
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: 'Login Failed' };
    } else throw error;
  }
};

export const logoutAction = async () => {
  try {
    const api = getApiClient();
    await api.post('logout');
    return redirect('/login');
  } catch (error) {
    console.error('logout failed!', error);
  }
};
