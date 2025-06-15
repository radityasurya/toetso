import { IsString, IsNotEmpty, IsEmail, IsIn } from 'class-validator';

export class SignupAuthDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsIn(['teacher', 'student'])
  role: 'teacher' | 'student';
}
