import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
    constructor(private prisma: PrismaService) { }

    async findAll(userRole?: string, userId?: string) {
        let whereCondition = {};
        if (userRole === 'ADMIN' && userId) {
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            if (!user?.companyId) return []; // Un ADMIN sin empresa no ve nada
            whereCondition = { id: user.companyId };
        }

        return this.prisma.company.findMany({
            where: whereCondition,
            orderBy: { createdAt: 'asc' },
            select: {
                id: true,
                name: true,
                apiUrl: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async findOne(id: string, userRole?: string, userId?: string) {
        if (userRole === 'ADMIN' && userId) {
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            if (user?.companyId !== id) {
                throw new ForbiddenException('No tienes permisos para ver esta empresa');
            }
        }

        const company = await this.prisma.company.findUnique({ where: { id } });
        if (!company) {
            throw new NotFoundException(`Empresa con id "${id}" no encontrada`);
        }
        return company;
    }

    async create(createCompanyDto: CreateCompanyDto, userRole?: string, userId?: string) {
        if (userRole === 'ADMIN' && userId) {
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            if (user?.companyId) {
                throw new ForbiddenException('Ya tienes una empresa asignada. No puedes crear otra.');
            }
        }

        const company = await this.prisma.company.create({
            data: createCompanyDto,
            select: {
                id: true,
                name: true,
                apiUrl: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (userRole === 'ADMIN' && userId) {
            await this.prisma.user.update({
                where: { id: userId },
                data: { companyId: company.id },
            });
        }

        return company;
    }

    async update(id: string, updateCompanyDto: UpdateCompanyDto, userRole?: string, userId?: string) {
        await this.findOne(id, userRole, userId); // findOne validates ADMIN access
        return this.prisma.company.update({
            where: { id },
            data: updateCompanyDto,
            select: {
                id: true,
                name: true,
                apiUrl: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async remove(id: string, userRole?: string, userId?: string) {
        await this.findOne(id, userRole, userId);
        return this.prisma.company.delete({ where: { id } });
    }

    /**
     * Gets apiUrl + apiKey for a specific company.
     * Only called server-side (by the Next.js proxy) — apiKey is never sent to the browser.
     */
    async getCredentials(id: string): Promise<{ apiUrl: string; apiKey: string }> {
        const company = await this.prisma.company.findUnique({
            where: { id },
            select: { apiUrl: true, apiKey: true },
        });
        if (!company) {
            throw new NotFoundException(`Empresa con id "${id}" no encontrada`);
        }
        return company;
    }
}
