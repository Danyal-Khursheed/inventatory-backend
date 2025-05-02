import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserPermissionsQuery } from '../impl/get-user-permissions.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolesEntity } from 'src/roles-management/entities/create-role.entity';

@QueryHandler(GetUserPermissionsQuery)
export class GetUserPermissionsQueryHandler
  implements IQueryHandler<GetUserPermissionsQuery>
{
  constructor(
    @InjectRepository(RolesEntity)
    private rolesRepo: Repository<RolesEntity>,
  ) {}

  async execute(query: GetUserPermissionsQuery): Promise<any> {
    const role = await this.rolesRepo.findOne({
      where: { roleName: query.role },
      relations: ['rolePermissions', 'rolePermissions.permission'],
    });

    if (!role) {
      throw new Error('Role not found');
    }

    const permissions = role.rolePermissions.map((rp) => ({
      permissionName: rp.permission.permission,
      actions: rp.actions,
    }));

    return { permissions };
  }
}
