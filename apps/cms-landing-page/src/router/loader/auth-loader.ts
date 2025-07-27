import { authApi } from '../action/auth-action';
import { redirect } from 'react-router';
import { useRegistrationStore } from '../../store/register-store';
import { queryClient } from '../../lib/queryclient';
import { getMfaSetup } from '@cms/data';

export const fetchMFAQuery = () => ({
  queryKey: ['mfaSetup', useRegistrationStore.getState().data.userId],
  queryFn: () => getMfaSetup(useRegistrationStore.getState().data.userId),
});

export const loginLoader = async () => {
  const clearState = useRegistrationStore.getState().clearState;
  const { email } = useRegistrationStore.getState().data;
  if (!email) {
    return redirect('onboarding/register');
  }
  try {
    const response = await authApi.post('cms/auth/me', { email });
    if (response.status !== 200) {
      return null;
    }
    return redirect('onboarding/register');
  } catch (error: any) {
    if (error) {
      clearState();
      return redirect('onboarding/register');
    }
    console.log('Loader error:', error);
  }
};

export const MfaLoader = async () => {
  const { userId } = useRegistrationStore.getState().data;
  const clearState = useRegistrationStore.getState().clearState;

  if (!userId) {
    clearState();
    return redirect('onboarding/register');
  }

  await queryClient.ensureQueryData(fetchMFAQuery());
};
