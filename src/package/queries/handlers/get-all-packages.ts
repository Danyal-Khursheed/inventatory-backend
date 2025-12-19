import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllPackagesQuery } from '../impl/get-all-packages.query';
import { InjectRepository } from '@nestjs/typeorm';
import { PackageEntity } from 'src/package/entities/package.entity';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

@QueryHandler(GetAllPackagesQuery)
export class GetAllPackagesHandler
  implements IQueryHandler<GetAllPackagesQuery>
{
  constructor(
    @InjectRepository(PackageEntity)
    private packagesRepo: Repository<PackageEntity>,
  ) {}

  async execute({ pageNumber, pageSize }: GetAllPackagesQuery): Promise<any> {
    try {
      const isPaginated = !!(pageNumber && pageSize);

      // Validate pagination parameters
      if (isPaginated) {
        if (pageNumber < 1) {
          throw new BadRequestException(
            'pageNumber must be greater than or equal to 1',
          );
        }
        if (pageSize < 1) {
          throw new BadRequestException(
            'pageSize must be greater than or equal to 1',
          );
        }
        if (pageSize > 100) {
          throw new BadRequestException('pageSize cannot exceed 100');
        }

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
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to retrieve packages: ${error.message}`,
      );
    }
  }
}
