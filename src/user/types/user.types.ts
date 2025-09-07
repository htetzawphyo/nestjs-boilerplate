import { Permission, Role, User as UserModel } from '@prisma/client';

export type User = UserModel;

export type UserWithRoleAndPermission = User & {
  role: Role & {
    permissions: Permission[];
  };
};
