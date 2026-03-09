import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.company.findMany({
            orderBy: { createdAt: 'asc' },
            select: {
                id: true,
                name: true,
                apiUrl: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
                // apiKey is intentionally excluded from list for security
            },
        });
    }

    async findOne(id: string) {
        const company = await this.prisma.company.findUnique({ where: { id } });
        if (!company) {
            throw new NotFoundException(`Empresa con id "${id}" no encontrada`);
        }
        return company;
    }

    async create(createCompanyDto: CreateCompanyDto) {
        return this.prisma.company.create({
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
    }

    async update(id: string, updateCompanyDto: UpdateCompanyDto) {
        await this.findOne(id);
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

    async remove(id: string) {
        await this.findOne(id);
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
