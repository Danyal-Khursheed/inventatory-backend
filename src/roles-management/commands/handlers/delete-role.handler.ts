import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { DeleteRoleCommand } from '../impl/delete-role.command';
import { RolesEntity } from 'src/roles-management/entities/create-role.entity';
import { RolesPermsMappingEntity } from 'src/roles-management/entities/roles-perms-mapping.entity';

@CommandHandler(DeleteRoleCommand)
export class DeleteRoleHandler implements ICommandHandler<DeleteRoleCommand> {
  constructor(
    @InjectRepository(RolesEntity)
    private readonly rolesRepository: Repository<RolesEntity>,

    @InjectRepository(RolesPermsMappingEntity)
    private readonly rolePermRepo: Repository<RolesPermsMappingEntity>,
  ) {}

  async execute(command: DeleteRoleCommand): Promise<any> {
    const { roleId } = command;

    const existingRole = await this.rolesRepository.findOne({
      where: { id: roleId },
    });
    if (!existingRole) {
      throw new NotFoundException(`Role with ID "${roleId}" not found.`);
    }

    await this.rolePermRepo.delete({ roleId });
    await this.rolesRepository.delete({ id: roleId });

    return { success: true, message: 'Role Deleted Successfully' };
  }
}
