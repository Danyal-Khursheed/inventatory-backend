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

  async execute(): Promise<any[]> {
    const permissions = await this.permissionRepo.find();

    return permissions.map((perm) => ({
      permissionName: perm.permission,
      actions: perm.actions,
    }));
  }
}
