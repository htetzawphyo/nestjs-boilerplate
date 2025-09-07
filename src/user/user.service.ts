import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { plainToInstance } from 'class-transformer';
import { UserDto } from './dtos/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findUserById(
    id: string,
    includePasswordField = false,
  ): Promise<UserDto> {
    const user = await this.userRepository.findUserById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return !includePasswordField
      ? plainToInstance(UserDto, user, {
          excludeExtraneousValues: true,
        })
      : user;
  }

  async findUserByEmail(
    email: string,
    includePasswordField = false,
  ): Promise<UserDto> {
    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return !includePasswordField
      ? plainToInstance(UserDto, user, {
          excludeExtraneousValues: true,
        })
      : user;
  }
}
