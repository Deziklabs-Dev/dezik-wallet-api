import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsStrongPassword } from '../validators/strong-password.validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
