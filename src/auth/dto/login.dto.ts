import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword } from '../validators/strong-password.validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@dezik.com', description: 'Correo electrónico del usuario' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'MiPass123!', description: 'Contraseña (mín. 8 chars, 1 mayúscula, 1 número, 1 especial)' })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
