import { User } from 'shared/types/user';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'superadmin',
    name: 'Admin User',
    email: 'admin@example.com',
    roles: ['admin'],
    passwordHash: '',
  },
  {
    id: '2',
    username: 'teachalice',
    name: 'Alice Teacher',
    email: 'alice@school.com',
    roles: ['teacher'],
    passwordHash: '',
  },
  {
    id: '3',
    username: 'bobby',
    name: 'Bob Student',
    email: 'bob@student.com',
    roles: ['student'],
    passwordHash: '',
  }
];
