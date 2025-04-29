import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UpdateRoleCommand } from '../impl/update-role.command';
import { RolesEntity } from 'src/roles-management/entities/create-role.entity';
import { RolesPermsMappingEntity } from 'src/roles-management/entities/roles-perms-mapping.entity';

@CommandHandler(UpdateRoleCommand)
export class UpdateRoleHandler implements ICommandHandler<UpdateRoleCommand> {
  constructor(
    @InjectRepository(RolesEntity)
    private readonly rolesRepository: Repository<RolesEntity>,

    @InjectRepository(RolesPermsMappingEntity)
    private readonly rolePermRepo: Repository<RolesPermsMappingEntity>,
  ) {}

  async execute(command: UpdateRoleCommand): Promise<any> {
    const { roleId, roleName, description, permissions } = command;

    const existingRole = await this.rolesRepository.findOne({
      where: { id: roleId },
    });
    if (!existingRole) {
      throw new NotFoundException(`Role with ID "${roleId}" not found.`);
    }

    existingRole.roleName = roleName;
    existingRole.description = description;
    await this.rolesRepository.save(existingRole);

    const existingMapping = await this.rolePermRepo.findOne({
      where: { roleId },
    });
    if (existingMapping) {
      existingMapping.roleName = roleName;
      existingMapping.description = description;
      existingMapping.permissions = permissions;
      await this.rolePermRepo.save(existingMapping);
    }

    return { success: true, message: 'Role Updated Successfully' };
  }
}
