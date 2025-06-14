import { User } from './user.interface';
// bcrypt hash for 'admin123'
const adminHash = '$2b$10$jRtuI1h13k61zkI0vE1Iki8uzzdJvjgW6J3bOE1pESw/rvClgp7py';
// bcrypt hash for 'test123'
const userHash = '$2b$10$SwrMO2zPxVtnA18neIzE2.IrfEXZOT5uxTnMYxBimnGGYoA43qcb.';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    password: adminHash,
    email: 'admin@example.com',
    roles: ['admin'],
    createdAt: new Date('2024-01-20T09:00:00'),
    updatedAt: new Date('2024-01-20T09:00:00'),
  },
  {
    id: '2',
    username: 'testuser',
    password: userHash,
    email: 'testuser@example.com',
    roles: ['user'],
    createdAt: new Date('2024-01-21T10:00:00'),
    updatedAt: new Date('2024-01-21T10:00:00'),
  },
];
