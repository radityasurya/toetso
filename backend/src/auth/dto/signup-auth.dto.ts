import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class SignupAuthDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}
