import { IsEmail, IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { Role } from '@prisma/client';
import { IsStrongPassword } from '../../auth/validators/strong-password.validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
