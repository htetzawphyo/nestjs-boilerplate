import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserWithRoleAndPermission } from './types/user.types';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

const userValidator = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    role: {
      include: {
        permissions: true,
      },
    },
  },
});

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(payload: CreateUserDto): Promise<UserWithRoleAndPermission> {
    return this.prismaService.user.create({
      data: {
        ...payload,
      },
      ...userValidator,
    });
  }

  async updateUser(
    id: string,
    payload: UpdateUserDto,
  ): Promise<UserWithRoleAndPermission> {
    return this.prismaService.user.update({
      where: { id },
      data: { ...payload },
      ...userValidator,
    });
  }

  async deleteUser(id: string): Promise<UserWithRoleAndPermission> {
    return this.prismaService.user.delete({
      where: { id },
      ...userValidator,
    });
  }

  async findAllUsers(): Promise<UserWithRoleAndPermission[]> {
    return this.prismaService.user.findMany({
      ...userValidator,
    });
  }

  async findUserById(id: string): Promise<UserWithRoleAndPermission | null> {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
      ...userValidator,
    });
  }

  async findUserByEmail(
    email: string,
  ): Promise<UserWithRoleAndPermission | null> {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
      ...userValidator,
    });
  }
}
