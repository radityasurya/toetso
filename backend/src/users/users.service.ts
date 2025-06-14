import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { User, Role } from './user.interface';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { mockUsers } from './users.mock';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private users: User[] = [...mockUsers];

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User {
    const user = this.users.find((u) => u.id === id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  findByUsername(username: string): User | undefined {
    return this.users.find((u) => u.username === username);
  }

  async create(body: CreateUserDto): Promise<User> {
    if (this.findByUsername(body.username)) {
      throw new BadRequestException('Username already exists');
    }
    const now = new Date();
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const newUser: User = {
      id: uuidv4(),
      ...body,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    };
    this.users.push(newUser);
    return newUser;
  }

  async update(id: string, body: UpdateUserDto): Promise<User> {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) throw new NotFoundException('User not found');
    // Only hash the password if a new password is provided:
    let password = this.users[idx].password;
    if (body.password) {
      password = await bcrypt.hash(body.password, 10);
    }
    this.users[idx] = {
      ...this.users[idx],
      ...body,
      password,
      updatedAt: new Date(),
    };
    return this.users[idx];
  }

  remove(id: string) {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) throw new NotFoundException('User not found');
    const deleted = this.users.splice(idx, 1);
    return { message: 'Deleted', deleted: deleted[0] };
  }
}
