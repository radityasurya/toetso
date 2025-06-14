import { IsString, IsNotEmpty, IsOptional, IsEmail, IsArray, ArrayNotEmpty } from 'class-validator';
import { Role } from './user.interface';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsArray()
  @ArrayNotEmpty()
  roles: Role[];
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsArray()
  @IsOptional()
  roles?: Role[];
}
