import { FetchOwnerQuery, fetchPageRequestsQuery, fetchPagesQuery } from '@cms/data';
import { createApiClient, setApiClient } from '@cms/data';

import { queryClient } from '../../lib/queryClient';

setApiClient(createApiClient(import.meta.env.VITE_BACKEND_SERVER));

export const OwnerLoader = async () => {
  await queryClient.ensureQueryData(FetchOwnerQuery());
};

export const PageLoader = async () => {
  await queryClient.ensureQueryData(fetchPagesQuery());
};

export const PageRequestLoader = async () => {
  await queryClient.ensureQueryData(fetchPageRequestsQuery());
};
