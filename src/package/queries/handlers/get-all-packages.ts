import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllPackagesQuery } from '../impl/get-all-packages.query';
import { InjectRepository } from '@nestjs/typeorm';
import { PackageEntity } from 'src/package/entities/package.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetAllPackagesQuery)
export class GetAllPackagesHandler
  implements IQueryHandler<GetAllPackagesQuery>
{
  constructor(
    @InjectRepository(PackageEntity)
    private packagesRepo: Repository<PackageEntity>,
  ) {}
  async execute({ pageNumber, pageSize }: GetAllPackagesQuery): Promise<any> {
    const isPaginated = !!(pageNumber && pageSize);

    if (isPaginated) {
      const [packages, totalCount] = await this.packagesRepo.findAndCount({
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
      });

      return {
        data: packages,
        totalCount,
        pageNumber: Number(pageNumber),
        pageSize: Number(pageSize),
      };
    }

    const packages = await this.packagesRepo.find();

    return { data: packages };
  }
}
