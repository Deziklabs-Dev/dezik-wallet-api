import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ForbiddenException, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiCookieAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('users')
@ApiCookieAuth('access_token')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  /**
   * Create a user with role USER or ADMIN.
   * SUPER_ADMIN can also create SUPER_ADMIN users via this endpoint
   * (the role field in the body will be accepted).
   * ADMIN can only create USER or ADMIN, not SUPER_ADMIN.
   */
  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Crear usuario (ADMIN crea USER/ADMIN, SUPER_ADMIN puede crear SUPER_ADMIN)' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 403, description: 'ADMIN intentó crear SUPER_ADMIN' })
  @ApiResponse({ status: 409, description: 'El email ya existe' })
  create(@Body() createUserDto: CreateUserDto, @Req() req: any) {
    // An ADMIN cannot promote someone to SUPER_ADMIN
    if (req.user.role !== Role.SUPER_ADMIN && createUserDto.role === Role.SUPER_ADMIN) {
      throw new ForbiddenException('Solo un Super Administrador puede crear otros Super Administradores');
    }
    let activeCompanyId = req.cookies?.['active_company_id'];
    if (activeCompanyId === 'null' || activeCompanyId === 'undefined' || activeCompanyId === '') {
      activeCompanyId = undefined;
    }
    const finalCompanyId = createUserDto.companyId || activeCompanyId;
    return this.usersService.create(createUserDto, req.user.id, req.user.role, finalCompanyId);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Listar todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  findAll(@Req() req: any) {
    let activeCompanyId = req.cookies?.['active_company_id'];
    if (activeCompanyId === 'null' || activeCompanyId === 'undefined' || activeCompanyId === '') {
      activeCompanyId = undefined;
    }
    return this.usersService.findAll(req.user.id, req.user.role, activeCompanyId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiParam({ name: 'id', description: 'UUID del usuario' })
  @ApiResponse({ status: 200, description: 'Datos del usuario' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.usersService.findOne(id, req.user.id, req.user.role);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Actualizar usuario' })
  @ApiParam({ name: 'id', description: 'UUID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado' })
  @ApiResponse({ status: 403, description: 'ADMIN intentó asignar rol SUPER_ADMIN' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req: any) {
    // An ADMIN cannot promote someone to SUPER_ADMIN
    if (req.user.role !== Role.SUPER_ADMIN && updateUserDto.role === Role.SUPER_ADMIN) {
      throw new ForbiddenException('Solo un Super Administrador puede asignar el rol de Super Administrador');
    }
    return this.usersService.update(id, updateUserDto, req.user.id, req.user.role);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Eliminar usuario' })
  @ApiParam({ name: 'id', description: 'UUID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.usersService.remove(id, req.user.id, req.user.role);
  }
}
