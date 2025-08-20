import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { log } from 'console';
import { RegisterDto } from './dto/register.dto';
import { use } from 'passport';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) throw new UnauthorizedException('Invalid credentials');

        return user;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);

        return this.getTokens(user.id, user.role);
    }

    async register(registerDto: RegisterDto) {
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                name: registerDto.name,
                email: registerDto.email,
                password: hashedPassword,
                role: registerDto.role as any || 'User',
            },
        });

        return this.getTokens(user.id, user.role);
    }

    async refreshToken(token: string) {
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_REFRESH_SECRET || 'rt-secret',
            });

            return this.getTokens(payload.sub, payload.role);
        } catch (e) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async getTokens(userId: number, role: string) {
        const accessToken = await this.jwtService.signAsync(
            { sub: userId, role },
            {
                secret: process.env.JWT_ACCESS_SECRET || 'at-secret',
                expiresIn: '15m',
            },
        );

        const refreshToken = await this.jwtService.signAsync(
            { sub: userId, role },
            {
                secret: process.env.JWT_REFRESH_SECRET || 'rt-secret',
                expiresIn: '7d',
            },
        );

        return { accessToken, refreshToken };
    }
}
