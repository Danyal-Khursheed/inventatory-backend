import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetSinglePackageQuery } from '../impl/get-single-package';
import { InjectRepository } from '@nestjs/typeorm';
import { PackageEntity } from 'src/package/entities/package.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetSinglePackageQuery)
export class getSinglePackageHandler
  implements IQueryHandler<GetSinglePackageQuery>
{
  constructor(
    @InjectRepository(PackageEntity)
    private packagesRepo: Repository<PackageEntity>,
  ) {}
  async execute({ id }: GetSinglePackageQuery): Promise<any> {
    const pkg = await this.packagesRepo.findOne({ where: { id } });

    if (!pkg) {
      throw new NotFoundException('Package not found');
    }

    return { data: pkg };
  }
}
