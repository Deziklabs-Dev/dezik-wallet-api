import { IsEmail, IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsStrongPassword } from '../../auth/validators/strong-password.validator';

export class CreateUserDto {
  @ApiProperty({ example: 'usuario@dezik.com', description: 'Email del usuario' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'MiPass123!', description: 'Contraseña segura (mín. 8 chars, 1 mayúscula, 1 número, 1 especial)' })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @ApiPropertyOptional({ enum: Role, example: Role.USER, description: 'Rol del usuario (por defecto USER)' })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiPropertyOptional({ example: 'uuid', description: 'ID de la empresa a la que se asocia el usuario' })
  @IsString()
  @IsOptional()
  companyId?: string;
}
