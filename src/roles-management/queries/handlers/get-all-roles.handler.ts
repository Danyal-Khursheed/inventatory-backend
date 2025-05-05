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

  async execute({ pageNumber, pageSize }: GetAllRolesQuery): Promise<any> {
    const isPaginated = !!(pageNumber && pageSize);

    if (isPaginated) {
      const [roles, totalCount] = await this.rolesRepo.findAndCount({
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
        order: { createdAt: 'DESC' },
        relations: ['rolePermissions', 'rolePermissions.permission'],
      });

      const data = roles.map((role) => ({
        id: role.id,
        roleName: role.roleName,
        description: role.description,
        permissions: role.rolePermissions.map((rp) => ({
          permissionName: rp.permission.permission,
          actions: rp.actions,
        })),
      }));

      return { data, totalCount, pageNumber, pageSize };
    }

    const roles = await this.rolesRepo.find({
      order: { createdAt: 'DESC' },
      select: ['id', 'roleName'],
    });

    return { data: roles };
  }
}
