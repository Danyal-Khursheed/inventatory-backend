import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllRolesQuery } from '../impl/get-all-roles.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolesPermsMappingEntity } from 'src/roles-management/entities/roles-perms-mapping.entity';

@QueryHandler(GetAllRolesQuery)
export class GetAllRolesQueryHandle implements IQueryHandler<GetAllRolesQuery> {
  constructor(
    @InjectRepository(RolesPermsMappingEntity)
    private rolePermRepo: Repository<RolesPermsMappingEntity>,
  ) {}

  async execute(query: GetAllRolesQuery): Promise<any> {
    const { pageNumber, pageSize } = query;

    const [roles, totalCount] = await this.rolePermRepo.findAndCount({
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });

    return {
      data: roles,
      totalCount,
      pageNumber,
      pageSize,
    };
  }
}
