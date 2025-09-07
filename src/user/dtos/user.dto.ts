import { ApiProperty } from '@nestjs/swagger';
import { type AccountStatus, accountStatus } from '../enums/enums';
import { Exclude, Expose } from 'class-transformer';

export class PermissionDto {
  @ApiProperty({
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: 'create',
  })
  @Expose()
  action: string;

  @ApiProperty({
    example: 'user',
  })
  @Expose()
  subject: string;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
  })
  @Expose()
  created_at: Date;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
  })
  @Expose()
  updated_at: Date;

  @ApiProperty({
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  roleId: string;
}

export class RoleDto {
  @ApiProperty({
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: 'admin',
  })
  @Expose()
  name: string;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
  })
  @Expose()
  created_at: Date;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
  })
  @Expose()
  updated_at: Date;

  @ApiProperty({
    type: [PermissionDto],
    description: 'List of permissions associated with this role',
  })
  @Expose()
  permissions: PermissionDto[];
}

export class UserDto {
  @ApiProperty({
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: 'John Doe',
  })
  @Expose()
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    example: true,
  })
  @Expose()
  isActive: boolean;

  @ApiProperty({
    enum: accountStatus,
    example: accountStatus.ACTIVE,
  })
  @Expose()
  accountStatus: AccountStatus;

  @ApiProperty({
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  roleId: string;

  @ApiProperty({
    type: RoleDto,
  })
  @Expose()
  role: RoleDto;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
  })
  @Expose()
  created_at: Date;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
  })
  @Expose()
  updated_at: Date;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
