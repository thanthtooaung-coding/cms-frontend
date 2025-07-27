import { createApiClient, setApiClient, FetchPostQuery } from '@cms/data';
import { queryClient } from '../../lib/queryclient';

setApiClient(createApiClient(import.meta.env.VITE_BACKEND_SERVER));

export const HomeLoader = async () => {
  await queryClient.ensureQueryData(FetchPostQuery());
};
