import { getApiClient } from '../api/index.js';

export const getPost = async () => {
  const api = getApiClient();
  return (await api.get('posts')).data;
};

export const FetchPostQuery = () => ({
  queryKey: ['post'] as const,
  queryFn: getPost,
});
