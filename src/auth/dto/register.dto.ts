import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterDto {
    @ApiProperty({ example: 'User One' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'user_one@example.com' })
    @IsNotEmpty()
    @IsString()
    email: string;

    @ApiProperty({ example: 'password123' })
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({ example: 'User' })
    @IsOptional()
    @IsEnum(Role)
    role?: Role
}
