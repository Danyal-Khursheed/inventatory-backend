import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllRolesQuery } from '../impl/get-all-roles.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolesEntity } from 'src/roles-management/entities/create-role.entity';

@QueryHandler(GetAllRolesQuery)
export class GetAllRolesQueryHandle implements IQueryHandler<GetAllRolesQuery> {
  constructor(
    @InjectRepository(RolesEntity)
    private rolesRepo: Repository<RolesEntity>,
  ) {}

  async execute(query: GetAllRolesQuery): Promise<any> {
    const { pageNumber, pageSize } = query;

    const [roles, totalCount] = await this.rolesRepo.findAndCount({
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
      relations: ['rolePermissions', 'rolePermissions.permission'],
    });

    const formattedRoles = roles.map((role) => {
      const permissions = role.rolePermissions.map((rp) => ({
        permissionName: rp.permission.permission,
        actions: rp.actions,
      }));

      return {
        id: role.id,
        roleName: role.roleName,
        description: role.description,
        permissions: permissions,
      };
    });

    return {
      data: formattedRoles,
      totalCount,
      pageNumber,
      pageSize,
    };
  }
}
