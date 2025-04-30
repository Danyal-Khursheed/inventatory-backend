import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleCommand } from '../impl/create-role.command';
import { RolesEntity } from 'src/roles-management/entities/create-role.entity';
import { PermissionEntity } from 'src/permissions-management/entity/permissions.entity';
import { RolePermissionEntity } from 'src/roles-management/entities/role-permissions.entity';
import { PermissionGroup } from 'src/roles-management/dtos/create-role.dto';

@CommandHandler(CreateRoleCommand)
export class CreateRoleHandler implements ICommandHandler<CreateRoleCommand> {
  constructor(
    @InjectRepository(RolesEntity)
    private readonly rolesRepo: Repository<RolesEntity>,
    @InjectRepository(PermissionEntity)
    private readonly permissionRepo: Repository<PermissionEntity>,
    @InjectRepository(RolePermissionEntity)
    private readonly rolePermRepo: Repository<RolePermissionEntity>,
  ) {}

  async execute({ roleName, description, permissions }: CreateRoleCommand) {
    const existing = await this.rolesRepo.findOne({ where: { roleName } });
    if (existing)
      throw new ConflictException(`Role "${roleName}" already exists.`);

    const savedRole = await this.rolesRepo.save(
      this.rolesRepo.create({ roleName, description }),
    );

    const rolePermissions = await this.buildRolePermissions(
      savedRole,
      permissions,
    );

    if (rolePermissions.length) await this.rolePermRepo.save(rolePermissions);

    return { success: true, message: 'Role Created Successfully' };
  }

  private async buildRolePermissions(
    role: RolesEntity,
    permissions: PermissionGroup[],
  ) {
    const result: RolePermissionEntity[] = [];

    for (const group of permissions) {
      for (const [permName, actions] of Object.entries(group)) {
        const permission = await this.permissionRepo.findOne({
          where: { permission: permName },
        });
        if (!permission)
          throw new NotFoundException(`Permission "${permName}" not found.`);

        const invalid = actions.filter((a) => !permission.actions.includes(a));
        if (invalid.length) {
          throw new BadRequestException(
            `Invalid actions [${invalid.join(', ')}] for "${permName}". Valid: [${permission.actions.join(', ')}]`,
          );
        }

        result.push(this.rolePermRepo.create({ role, permission, actions }));
      }
    }

    return result;
  }
}
