import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserWithRoleAndPermission } from './types/user.types';

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
