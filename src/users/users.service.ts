import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto, currentUserId: string, currentUserRole: string, activeCompanyId?: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    let companyIdToAssign: string | null = null;

    if (currentUserRole === 'ADMIN') {
      // Un ADMIN crea usuarios en su propia empresa
      const adminUser = await this.prisma.user.findUnique({ where: { id: currentUserId } });
      if (!adminUser?.companyId) {
        throw new ConflictException('El administrador no tiene una empresa asignada');
      }
      companyIdToAssign = adminUser.companyId;
    } else if (currentUserRole === 'SUPER_ADMIN') {
      // El SUPER_ADMIN puede crear admins y users en la empresa seleccionada
      // Si la petición no tiene un activeCompanyId (ej: crea a otro SUPER_ADMIN), companyIdToAssign se queda nulo
      // Un SUPER_ADMIN no está amarrado estructuralmente a una sola empresa.
      if (createUserDto.role !== 'SUPER_ADMIN') {
        if (!activeCompanyId) {
          throw new ConflictException('El Super Admin debe seleccionar una empresa para crear este tipo de cuenta');
        }
        companyIdToAssign = activeCompanyId;
      }
    }

    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        role: createUserDto.role || 'USER',
        companyId: companyIdToAssign,
      },
    });

    const { password, ...result } = user;
    return result;
  }

  async findAll(currentUserId: string, currentUserRole: string, activeCompanyId?: string) {
    let whereClause: any = {};

    if (currentUserRole === 'ADMIN') {
      // Un ADMIN lista a los de su misma empresa, EXCLUYENDO a los SUPER_ADMINs
      const adminUser = await this.prisma.user.findUnique({ where: { id: currentUserId } });
      if (!adminUser?.companyId) return [];

      whereClause = {
        companyId: adminUser.companyId,
        role: { not: 'SUPER_ADMIN' }, // IMPORTANTE: El ADMIN no puede ver correos SUPER_ADMIN
      };
    } else if (currentUserRole === 'SUPER_ADMIN') {
      // Un SUPER_ADMIN ve a los de la empresa actualmente seleccionada,
      // MÁS a los demás SUPER_ADMINs que no tienen empresa específica asignada (para que los pueda ver si no selecciona empresa)
      if (activeCompanyId) {
        whereClause = {
          OR: [
            { companyId: activeCompanyId },
            { role: 'SUPER_ADMIN' }
          ]
        };
      } else {
        // Si no tiene empresa activa seleccionada en el menú superior, ver solo SUPER_ADMINs (comportamiento de aislamiento seguro)
        whereClause = { role: 'SUPER_ADMIN' };
      }
    }

    const users = await this.prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        role: true,
        companyId: true,
        company: {
          select: { name: true }
        },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    return users;
  }

  async findOne(id: string, currentUserId: string, currentUserRole: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        companyId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (currentUserRole === 'ADMIN') {
      const adminUser = await this.prisma.user.findUnique({ where: { id: currentUserId } });
      if (!adminUser?.companyId || user.companyId !== adminUser.companyId || user.role === 'SUPER_ADMIN') {
        throw new NotFoundException('User not found (Oculto por permisos)');
      }
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto, currentUserId: string, currentUserRole: string) {
    // Check permission logic
    await this.findOne(id, currentUserId, currentUserRole);

    const updateData: any = {};

    if (updateUserDto.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email already exists');
      }

      updateData.email = updateUserDto.email;
    }

    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    if (updateUserDto.role) {
      updateData.role = updateUserDto.role;
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        role: true,
        companyId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  async remove(id: string, currentUserId: string, currentUserRole: string) {
    // Check permission logic using findOne
    await this.findOne(id, currentUserId, currentUserRole);

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'User deleted successfully' };
  }
}
