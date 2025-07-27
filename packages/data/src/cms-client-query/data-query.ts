import { PageRequestPayload } from 'src/types/page-request.js';
import { getApiClient } from '../api/index.js';

export const getPost = async () => {
  const api = getApiClient();
  return (await api.get('posts')).data;
};

export const FetchPostQuery = () => ({
  queryKey: ['post'] as const,
  queryFn: getPost,
});

export const createPageRequest = async (data: PageRequestPayload) => {
  const client = getApiClient();
  const formData = new FormData();
  formData.append('ownerId', '1');
  formData.append('requestType', data.requestType);
  formData.append('title', data.title);
  formData.append('pageDescription', data.pageDescription);
  formData.append('pageUrl', data.pageUrl);
  formData.append('logoUrl', data.logoUrl);

  return (
    await client.post('/cms/page-request', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  ).data;
};

export const uploadFile = async (file: File) => {
  const client = getApiClient();
  const formData = new FormData();

  formData.append('file', file); 

  return (
    await client.post('/file/file/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  ).data;
};