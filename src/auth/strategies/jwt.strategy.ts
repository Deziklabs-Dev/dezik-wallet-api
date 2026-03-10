import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.access_token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const superAdminEmail = this.configService.get<string>('SUPER_ADMIN_EMAIL');
    const effectiveRole =
      superAdminEmail && payload.email === superAdminEmail
        ? Role.SUPER_ADMIN
        : payload.role;

    // Fetch the latest user from DB to get the most recent companyId
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { companyId: true },
    });

    return {
      id: payload.sub,
      email: payload.email,
      role: effectiveRole,
      companyId: user?.companyId || null,
    };
  }
}
