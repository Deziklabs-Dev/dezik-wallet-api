import { IsEmail, IsString, IsEnum, IsOptional } from 'class-validator';
import { Role } from '@prisma/client';
import { IsStrongPassword } from '../../auth/validators/strong-password.validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsStrongPassword()
  @IsOptional()
  password?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
