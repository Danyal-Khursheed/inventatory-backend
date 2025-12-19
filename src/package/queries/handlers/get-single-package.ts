import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetSinglePackageQuery } from '../impl/get-single-package';
import { InjectRepository } from '@nestjs/typeorm';
import { PackageEntity } from 'src/package/entities/package.entity';
import { Repository } from 'typeorm';
import {
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

@QueryHandler(GetSinglePackageQuery)
export class getSinglePackageHandler
  implements IQueryHandler<GetSinglePackageQuery>
{
  constructor(
    @InjectRepository(PackageEntity)
    private packagesRepo: Repository<PackageEntity>,
  ) {}

  async execute({ id }: GetSinglePackageQuery): Promise<any> {
    try {
      if (!id) {
        throw new BadRequestException('Package ID is required');
      }

      const pkg = await this.packagesRepo.findOne({ where: { id } });

      if (!pkg) {
        throw new NotFoundException(`Package with ID "${id}" not found`);
      }

      return { data: pkg };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to retrieve package: ${error.message}`,
      );
    }
  }
}
