export type Role = 'admin' | 'user';

export interface User {
  id: string;
  username: string;
  password: string;
  email?: string;
  roles: Role[];
  createdAt?: Date;
  updatedAt?: Date;
}
