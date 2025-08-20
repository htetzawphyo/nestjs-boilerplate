import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Roles } from './decorator/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './guard/roles.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('refresh')
    async refresh(@Body() body: { refreshToken: string }) {
        return this.authService.refreshToken(body.refreshToken);
    }

    @Get('test_admin_role')
    @Roles('Admin')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    getAdminData() {
        return { message: 'Only admins can see this!' };
    }

    @Get('test_user_only')
    @Roles('User')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    getUserData() {
        return { message: 'Only users can see this!' };
    }
}
