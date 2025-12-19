import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePackageBulkCommand } from '../impl/create-package-bulk.command';
import { InjectRepository } from '@nestjs/typeorm';
import { PackageEntity } from 'src/package/entities/package.entity';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@CommandHandler(CreatePackageBulkCommand)
export class CreatePackagesBulkHandler
  implements ICommandHandler<CreatePackageBulkCommand>
{
  constructor(
    @InjectRepository(PackageEntity)
    private readonly packageRepo: Repository<PackageEntity>,
  ) {}

  async execute(command: CreatePackageBulkCommand): Promise<any> {
    try {
      const { dto } = command;
      const packages = dto.packages;

      if (!packages || !Array.isArray(packages) || packages.length === 0) {
        throw new BadRequestException(
          'Packages array is required and must not be empty',
        );
      }

      // Check for duplicate SKUs in the request
      const skus = packages.map((pkg) => pkg.sku);
      const duplicateSkus = skus.filter(
        (sku, index) => skus.indexOf(sku) !== index,
      );
      if (duplicateSkus.length > 0) {
        throw new BadRequestException(
          `Duplicate SKUs found in request: ${duplicateSkus.join(', ')}`,
        );
      }

      // Check for duplicate UPCs in the request
      const upcs = packages.map((pkg) => pkg.upc);
      const duplicateUpcs = upcs.filter(
        (upc, index) => upcs.indexOf(upc) !== index,
      );
      if (duplicateUpcs.length > 0) {
        throw new BadRequestException(
          `Duplicate UPCs found in request: ${duplicateUpcs.join(', ')}`,
        );
      }

      // Check if any SKU already exists in database
      const existingSkus = await this.packageRepo.find({
        where: skus.map((sku) => ({ sku })),
      });
      if (existingSkus.length > 0) {
        const existingSkuList = existingSkus.map((pkg) => pkg.sku).join(', ');
        throw new ConflictException(
          `Packages with the following SKUs already exist: ${existingSkuList}`,
        );
      }

      // Check if any UPC already exists in database
      const existingUpcs = await this.packageRepo.find({
        where: upcs.map((upc) => ({ upc })),
      });
      if (existingUpcs.length > 0) {
        const existingUpcList = existingUpcs.map((pkg) => pkg.upc).join(', ');
        throw new ConflictException(
          `Packages with the following UPCs already exist: ${existingUpcList}`,
        );
      }

      const entities = this.packageRepo.create(packages);
      const saved = await this.packageRepo.save(entities);

      return {
        message: `Successfully created ${saved.length} package(s)`,
        result: saved,
        count: saved.length,
      };
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to create packages in bulk: ${error.message}`,
      );
    }
  }
}
