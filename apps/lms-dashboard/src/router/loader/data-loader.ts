
import { FetchEnrollmentQuery } from './../../../../../packages/data/src/lms-dashboard-query/query';
import { queryClient } from '../../lib/queryClient';
import { createApiClient, setApiClient } from './../../../../../packages/data/src/api/index';
import { FetchCourseQuery } from './../../../../../packages/data/src/lms-dashboard-query/query';
setApiClient(createApiClient(import.meta.env.VITE_BACKEND_SERVER))

export const EnrollmentLoader = async () => {
  await queryClient.ensureQueryData(FetchEnrollmentQuery())
}

export const CourseLoader = async () => {
  await queryClient.ensureQueryData(FetchCourseQuery());
};
