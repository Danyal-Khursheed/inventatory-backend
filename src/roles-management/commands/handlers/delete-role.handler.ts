import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { DeleteRoleCommand } from '../impl/delete-role.command';
import { RolesEntity } from 'src/roles-management/entities/create-role.entity';
import { RolePermissionEntity } from 'src/roles-management/entities/role-permissions.entity';

@CommandHandler(DeleteRoleCommand)
export class DeleteRoleHandler implements ICommandHandler<DeleteRoleCommand> {
  constructor(
    @InjectRepository(RolesEntity)
    private readonly rolesRepo: Repository<RolesEntity>,
    @InjectRepository(RolePermissionEntity)
    private readonly rolePermRepo: Repository<RolePermissionEntity>,
  ) {}

  async execute({
    id,
  }: DeleteRoleCommand): Promise<{ success: boolean; message: string }> {
    const role = await this.rolesRepo.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(`Role with ID "${id}" not found.`);
    }

    await this.rolePermRepo.delete({ role: { id } });
    await this.rolesRepo.delete({ id });

    return { success: true, message: 'Role Deleted Successfully' };
  }
}
