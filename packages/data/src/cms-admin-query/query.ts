import { getApiClient } from '../api/index.js';

// owners
export const getOwners = async () => {
  const api = getApiClient();
  return (await api.get('/owners', {})).data;
};

export const FetchOwnerQuery = () => ({
  queryKey: ['owners'] as const,
  queryFn: getOwners,
});

//pages

export const getPages = async () => {
  const api = getApiClient();
  return (await api.get('/pages')).data;
};

export const fetchPagesQuery = () => ({
  queryKey: ['pages'] as const,
  queryFn: getPages,
});

//page-requests

export const getPageRequests = async () => {
  const api = getApiClient();
  return (await api.get('/page-request')).data;
};
export const fetchPageRequestsQuery = () => ({
  queryKey: ['page-requests'] as const,
  queryFn: getPageRequests,
});
