import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from './dtos/user-response.dto';
import { UserService } from './user.service';
import { CurrentUser, JwtUser } from 'src/auth/decorator/current.decorator';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
