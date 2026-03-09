import {
    Controller, Get, Post, Put, Delete, Body, Param,
    UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import {
    ApiTags, ApiOperation, ApiResponse, ApiParam, ApiCookieAuth,
} from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('companies')
@ApiCookieAuth('access_token')
@Controller('companies')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN)
export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) { }

    @Get()
    @ApiOperation({ summary: 'Listar todas las empresas registradas' })
    @ApiResponse({ status: 200, description: 'Lista de empresas (sin apiKey por seguridad)' })
    @ApiResponse({ status: 403, description: 'Solo SUPER_ADMIN' })
    findAll() {
        return this.companiesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener una empresa por ID' })
    @ApiParam({ name: 'id', description: 'UUID de la empresa' })
    @ApiResponse({ status: 200, description: 'Datos de la empresa' })
    @ApiResponse({ status: 404, description: 'Empresa no encontrada' })
    findOne(@Param('id') id: string) {
        return this.companiesService.findOne(id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Crear una nueva empresa' })
    @ApiResponse({ status: 201, description: 'Empresa creada exitosamente' })
    @ApiResponse({ status: 409, description: 'Ya existe una empresa con ese nombre' })
    create(@Body() createCompanyDto: CreateCompanyDto) {
        return this.companiesService.create(createCompanyDto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Actualizar datos de una empresa' })
    @ApiParam({ name: 'id', description: 'UUID de la empresa' })
    @ApiResponse({ status: 200, description: 'Empresa actualizada' })
    @ApiResponse({ status: 404, description: 'Empresa no encontrada' })
    update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
        return this.companiesService.update(id, updateCompanyDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Eliminar una empresa' })
    @ApiParam({ name: 'id', description: 'UUID de la empresa' })
    @ApiResponse({ status: 204, description: 'Empresa eliminada' })
    @ApiResponse({ status: 404, description: 'Empresa no encontrada' })
    remove(@Param('id') id: string) {
        return this.companiesService.remove(id);
    }

    @Get(':id/credentials')
    @ApiOperation({
        summary: 'Obtener credenciales de una empresa (uso server-side)',
        description: 'Retorna apiUrl y apiKey. Llamado solo por el proxy de Next.js, nunca por el cliente.',
    })
    @ApiParam({ name: 'id', description: 'UUID de la empresa' })
    @ApiResponse({ status: 200, description: 'Credenciales de la empresa' })
    getCredentials(@Param('id') id: string) {
        return this.companiesService.getCredentials(id);
    }
}
