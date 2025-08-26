import { getApiClient } from "./../api/index"

export const getEnrollments = async () => {
  const api = getApiClient();
  return (await api.get('/enrollments')).data
}

export const FetchEnrollmentQuery = () => ({
  queryKey : ['enrollments'] as const,
  queryFn: getEnrollments,
})

export const getCourses = async () => {
  const api = getApiClient();
  console.log(api);
  return (await api.get('lms/courses')).data;
};
export const FetchCourseQuery = () => ({
  queryKey: ['courses'] as const,
  queryFn: getCourses,
});

