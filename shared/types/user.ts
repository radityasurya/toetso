export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  username: string; // Unique
  name: string;
  email: string; // Unique
  roles: UserRole[];
  passwordHash?: string; // Backend only
  // other profile fields...
}
