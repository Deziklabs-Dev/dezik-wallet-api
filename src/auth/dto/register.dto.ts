import { IsEmail, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';
import { IsStrongPassword } from '../validators/strong-password.validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}
