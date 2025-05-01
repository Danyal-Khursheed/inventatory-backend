import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateRoleCommand } from '../impl/update-role.command';
import { RolesEntity } from 'src/roles-management/entities/create-role.entity';
import { RolePermissionEntity } from 'src/roles-management/entities/role-permissions.entity';
import { PermissionEntity } from 'src/permissions-management/entity/permissions.entity';
import { PermissionGroup } from 'src/roles-management/dtos/create-role.dto';

@CommandHandler(UpdateRoleCommand)
export class UpdateRoleHandler implements ICommandHandler<UpdateRoleCommand> {
  constructor(
    @InjectRepository(RolesEntity)
    private readonly rolesRepo: Repository<RolesEntity>,
    @InjectRepository(PermissionEntity)
    private readonly permissionRepo: Repository<PermissionEntity>,
    @InjectRepository(RolePermissionEntity)
    private readonly rolePermRepo: Repository<RolePermissionEntity>,
  ) {}

  async execute({
    roleId,
    roleName,
    description,
    permissions,
  }: UpdateRoleCommand) {
    const role = await this.rolesRepo.findOne({ where: { id: roleId } });
    if (!role)
      throw new NotFoundException(`Role with ID "${roleId}" not found.`);

    role.roleName = roleName;
    role.description = description;
    const updatedRole = await this.rolesRepo.save(role);

    await this.rolePermRepo.delete({ role: { id: roleId } });

    const rolePermissions = await this.buildRolePermissions(
      updatedRole,
      permissions,
    );
    if (rolePermissions.length) await this.rolePermRepo.save(rolePermissions);

    return { success: true, message: 'Role Updated Successfully' };
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
