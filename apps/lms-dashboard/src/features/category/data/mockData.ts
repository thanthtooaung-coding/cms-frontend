import type { CategoryType } from './schema';

export const mockCategory: CategoryType[] = [
  //Name | Description | Created At | Actions
  {
    id: '1',
    name: 'Programming',
    description: 'Test Description1',
    createdAt: '1 June 2025',
  },
  {
    id: '2',
    name: 'Data Science',
    description: 'Test Description2',
    createdAt: '10 June 2025',
  },
  {
    id: '3',
    name: 'Marketing',
    description: 'Test Description3',
    createdAt: '10 March 2025',
  },
  // {
  //   id: '4',
  //   name: 'Cloud Computing',
  //   description: 'Test Description 4',
  //   createdAt: '10 February 2025',
  // },
  // {
  //   id: '5',
  //   name: 'Frontend Development',
  //   description: 'Test Description 5',
  //   createdAt: '10 March 2025',
  // },
];
