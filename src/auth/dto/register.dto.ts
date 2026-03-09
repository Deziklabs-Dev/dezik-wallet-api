import { IsEmail, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsStrongPassword } from '../validators/strong-password.validator';

export class RegisterDto {
  @ApiProperty({ example: 'nuevo@dezik.com', description: 'Correo electrónico del nuevo usuario' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'MiPass123!', description: 'Contraseña segura' })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @ApiProperty({ enum: Role, example: Role.USER, description: 'Rol del nuevo usuario' })
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}
