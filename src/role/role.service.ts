import { Injectable } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { RoleDto } from './dtos/role.dto';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async createRole(payload: CreateRoleDto): Promise<RoleDto> {
    return this.roleRepository.createRole(payload);
  }

  async updateRole(id: string, payload: UpdateRoleDto): Promise<RoleDto> {
    return this.roleRepository.updateRole(id, payload);
  }

  async findRoleById(id: string): Promise<RoleDto | null> {
    return this.roleRepository.findRoleById(id);
  }
}
