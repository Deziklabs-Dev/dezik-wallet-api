import { IsString, IsNotEmpty, IsUrl, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCompanyDto {
    @ApiProperty({ example: 'Inkafarma', description: 'Nombre de la empresa' })
    @IsString()
    @IsNotEmpty({ message: 'El nombre de la empresa no puede estar vacío' })
    name: string;

    @ApiProperty({ example: 'https://api.digitalwallet.cards', description: 'URL base de la API de Digital Wallet' })
    @IsString()
    @IsNotEmpty({ message: 'La URL de la API no puede estar vacía' })
    @IsUrl({}, { message: 'La URL de la API tiene un formato inválido' })
    apiUrl: string;

    @ApiProperty({ example: 'Bearer eyJhbGci...', description: 'API Key / Bearer token de autenticación' })
    @IsString()
    @IsNotEmpty({ message: 'La API Key no puede estar vacía' })
    apiKey: string;

    @ApiPropertyOptional({ example: true, description: 'Si la empresa está activa en el sistema', default: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
