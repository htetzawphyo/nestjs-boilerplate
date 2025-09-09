import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Permissions } from 'src/auth/decorator/permissions.decorator';
import { RoleResponseDto } from './dtos/role-response.dto';
import { CreateRoleDto } from './dtos/create-role.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guard/permissions.guard';
import { UpdateRoleDto } from './dtos/update-role.dto';

@ApiTags('roles')
@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('')
  @Permissions({ action: 'create', subject: 'role' })
  @ApiOperation({ summary: 'Create a role' })
  @ApiResponse({
    status: 201,
    description: 'Role created successfully',
    type: RoleResponseDto,
  })
  async createRole(
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<RoleResponseDto> {
    const result = await this.roleService.createRole(createRoleDto);

    return {
      success: true,
      message: 'Role created successfully',
      role: result,
    };
  }

  @Put(':id')
  @Permissions({ action: 'update', subject: 'role' })
  @ApiOperation({ summary: 'Update a role' })
  @ApiResponse({
    status: 200,
    description: 'Role updated successfully',
    type: RoleResponseDto,
  })
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<RoleResponseDto> {
    const result = await this.roleService.updateRole(id, updateRoleDto);

    return {
      success: true,
      message: 'Role updated successfully',
      role: result,
    };
  }

  @Get(':id')
  @Permissions({ action: 'view', subject: 'role' })
  @ApiOperation({ summary: 'Get role by id' })
  @ApiResponse({
    status: 200,
    description: 'Role fetched successfully',
    type: RoleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  async findRoleById(@Param('id') id: string): Promise<RoleResponseDto> {
    const result = await this.roleService.findRoleById(id);

    if (!result) throw new NotFoundException('Role not found');

    return {
      success: true,
      message: 'Role fetched successfully',
      role: result,
    };
  }
}
