import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionEntity } from 'src/permissions-management/entity/permissions.entity';
import { GetAllPermissionsQuery } from '../impl/get-all-permissions.query';

@QueryHandler(GetAllPermissionsQuery)
export class GetAllPermissionsQueryHandler
  implements IQueryHandler<GetAllPermissionsQuery>
{
  constructor(
    @InjectRepository(PermissionEntity)
    private readonly permissionRepo: Repository<PermissionEntity>,
  ) {}

  async execute(query: GetAllPermissionsQuery): Promise<any> {
    const { pageNumber, pageSize } = query;

    if (pageNumber && pageSize) {
      const [data, totalCount] = await this.permissionRepo.findAndCount({
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
      });

      return {
        data: data.map((perm) => ({
          permissionName: perm.permission,
          actions: perm.actions,
        })),
        totalCount,
        pageNumber,
        pageSize,
      };
    }

    const permissions = await this.permissionRepo.find();
    return permissions.map((perm) => ({
      permissionName: perm.permission,
      actions: perm.actions,
    }));
  }
}
