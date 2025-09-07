import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  async onModuleInit() {
    await this.createSuperAdminUserIfNotExists();
  }

  private async createSuperAdminUserIfNotExists() {
    try {
      const superAdminUserName = this.configService.get<string>(
        'SUPER_ADMIN_USERNAME',
        'superadmin',
      );
      const superAdminUserEmail = this.configService.get<string>(
        'SUPER_ADMIN_USER_EMAIL',
        'superadmin@example.com',
      );
      const superAdminUserPassword = this.configService.get<string>(
        'SUPER_ADMIN_USER_PASSWORD',
        'securepassword12!@',
      );

      if (!superAdminUserEmail || !superAdminUserPassword) {
        this.logger.warn('Super admin user credentials are not configured');
        return;
      }

      const existingSuperAdminUser = await this.prismaService.user.findUnique({
        where: {
          email: superAdminUserEmail,
        },
      });

      if (existingSuperAdminUser) {
        this.logger.warn('Super admin user already exists, skipping creation');
        return;
      }

      const hashedPassword = await bcrypt.hash(superAdminUserPassword, 10);

      const superAdminRole = await this.prismaService.role.create({
        data: {
          name: 'SuperAdmin',
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
      this.logger.log('Super admin role created successfully');

      const permissions = [
        { action: 'create', subject: 'user' },
        { action: 'view', subject: 'user' },
        { action: 'update', subject: 'user' },
        { action: 'delete', subject: 'user' },
        { action: 'upload_image', subject: 'user' },
        //... add more permissions as you needed
      ];

      await this.prismaService.permission.createMany({
        data: permissions.map((permission) => ({
          ...permission,
          roleId: superAdminRole.id,
          created_at: new Date(),
        })),
      });
      this.logger.log('Premissions created successfully for super admin role.');

      const superAdminUser = await this.prismaService.user.create({
        data: {
          name: superAdminUserName,
          email: superAdminUserEmail,
          password: hashedPassword,
          accountStatus: 'ACTIVE',
          roleId: superAdminRole.id,
          isActive: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
      this.logger.log(
        `Super admin user created successfully: ${superAdminUser.email}`,
      );
    } catch (error) {
      this.logger.error('Failed to create super admin user:', error);
      throw error;
    }
  }
}
