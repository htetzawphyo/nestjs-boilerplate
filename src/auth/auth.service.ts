import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginResponseDto } from './dtos/login-response.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { cookieConstants, jwtConstants } from './constant';
import { Response } from 'express';
import { RefreshResponseDto } from './dtos/refresh-response.dto';
import { LogoutResponseDto } from './dtos/logout-response.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtUser } from './decorator/current.decorator';

@ApiTags('Auth')
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    email: string,
    password: string,
    res: Response,
  ): Promise<LoginResponseDto> {
    const user = await this.userService.findUserByEmail(email, true);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      id: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: jwtConstants.accessTokenSecret,
      expiresIn: jwtConstants.accessTokenExpiresIn,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: jwtConstants.refreshTokenSecret,
      expiresIn: jwtConstants.refreshTokenExpiresIn,
    });

    res.cookie(
      cookieConstants.accessTokenName,
      accessToken,
      cookieConstants.accessTokenOptions,
    );

    res.cookie(
      cookieConstants.refreshTokenName,
      refreshToken,
      cookieConstants.refreshTokenOptions,
    );

    return {
      success: true,
      message: 'Login successful',
      User: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async refresh(
    refreshToken: string,
    res: Response,
  ): Promise<RefreshResponseDto> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtUser>(refreshToken, {
        secret: jwtConstants.refreshTokenSecret,
      });

      const newAccessToken = await this.jwtService.signAsync(
        { id: payload.id, email: payload.email },
        {
          secret: jwtConstants.accessTokenSecret,
          expiresIn: jwtConstants.accessTokenExpiresIn,
        },
      );

      res.cookie(
        cookieConstants.accessTokenName,
        newAccessToken,
        cookieConstants.accessTokenOptions,
      );

      return {
        success: true,
        message: 'Token refreshed successfully',
      };
    } catch (error: any) {
      Logger.error('Refresh token validation error:', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  logout(res: Response): LogoutResponseDto {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return {
      success: true,
      message: 'Logout successful',
    };
  }
}
