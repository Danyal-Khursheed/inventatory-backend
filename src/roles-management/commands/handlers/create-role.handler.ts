import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import { CreateRoleCommand } from '../impl/create-role.command';
import { RolesEntity } from 'src/roles-management/entities/create-role.entity';
import { RolesPermsMappingEntity } from 'src/roles-management/entities/roles-perms-mapping.entity';

@CommandHandler(CreateRoleCommand)
export class CreateRoleHandler implements ICommandHandler<CreateRoleCommand> {
  constructor(
    @InjectRepository(RolesEntity)
    private readonly rolesRepository: Repository<RolesEntity>,

    @InjectRepository(RolesPermsMappingEntity)
    private readonly rolePermRepo: Repository<RolesPermsMappingEntity>,
  ) {}

  async execute(command: CreateRoleCommand): Promise<any> {
    const { roleName, description, permissions } = command;

    const existingRole = await this.rolesRepository.findOne({
      where: { roleName },
    });
    if (existingRole) {
      throw new ConflictException(`Role "${roleName}" already exists.`);
    }

    const role = this.rolesRepository.create({ roleName, description });
    const savedRole = await this.rolesRepository.save(role);

    const rolePermissions = this.rolePermRepo.create({
      roleId: savedRole.id,
      roleName,
      description,
      permissions,
    });

    await this.rolePermRepo.save(rolePermissions);

    return { success: true, message: 'Role created Successfully' };
  }
}
