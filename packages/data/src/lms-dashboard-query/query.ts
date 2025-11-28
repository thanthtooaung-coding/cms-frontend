import { getApiClient } from "./../api/index"

export const getEnrollments = async () => {
  const api = getApiClient();
  const tenantId = typeof window !== 'undefined' ? localStorage.getItem('tenant_id') : null;
  const url = tenantId ? `/api/lms/enrollments?tenantId=${tenantId}` : '/api/lms/enrollments';
  return (await api.get(url)).data
}

export const FetchEnrollmentQuery = () => ({
  queryKey : ['enrollments'] as const,
  queryFn: getEnrollments,
})

export const getCourses = async () => {
  const api = getApiClient();
  const tenantId = typeof window !== 'undefined' ? localStorage.getItem('tenant_id') : null;
  const url = tenantId ? `/api/lms/courses?tenantId=${tenantId}` : '/api/lms/courses';
  return (await api.get(url)).data;
};
export const FetchCourseQuery = () => ({
  queryKey: ['courses'] as const,
  queryFn: getCourses,
});

