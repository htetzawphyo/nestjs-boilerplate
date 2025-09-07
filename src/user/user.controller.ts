import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserResponseDto, UsersResponseDto } from './dtos/user-response.dto';
import { UserService } from './user.service';
import { CurrentUser, JwtUser } from 'src/auth/decorator/current.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guard/permissions.guard';
import { Permissions } from 'src/auth/decorator/permissions.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions({ action: 'create', subject: 'user' })
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    const result = await this.userService.createUser(createUserDto);
    return {
      success: true,
      message: 'User created successfully',
      user: result,
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions({ action: 'update', subject: 'user' })
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const result = await this.userService.updateUser(id, updateUserDto);
    return {
      success: true,
      message: 'User updated successfully',
      user: result,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions({ action: 'delete', subject: 'user' })
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    type: UserResponseDto,
  })
  async deleteUser(@Param('id') id: string): Promise<UserResponseDto> {
    const result = await this.userService.deleteUser(id);
    return {
      success: true,
      message: 'User deleted successfully',
      user: result,
    };
  }

  @Get('')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions({ action: 'view', subject: 'user' })
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'All users fetched successfully',
    type: UsersResponseDto,
  })
  async getAllUsers(): Promise<UsersResponseDto> {
    const result = await this.userService.findAllUsers();
    return {
      success: true,
      message: 'All users fetched successfully',
      users: result,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions({ action: 'view', subject: 'user' })
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiResponse({
    status: 200,
    description: 'User fetched successfully',
    type: UserResponseDto,
  })
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    const result = await this.userService.findUserById(id);
    return {
      success: true,
      message: 'User fetched successfully',
      user: result,
    };
  }

  @Get('/me')
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({
    status: 200,
    description: 'Current user fetched successfully',
    type: UserResponseDto,
  })
  async getCurrentUser(@CurrentUser() user: JwtUser): Promise<UserResponseDto> {
    const result = await this.userService.findUserByEmail(user.email);
    return {
      success: true,
      message: 'Current user fetched successfully',
      user: result,
    };
  }
}
