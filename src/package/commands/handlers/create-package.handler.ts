import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PackageEntity } from '../../entities/package.entity';
import { CreatePackageCommand } from '../impl/create-package.command';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@CommandHandler(CreatePackageCommand)
export class CreatePackageHandler
  implements ICommandHandler<CreatePackageCommand>
{
  constructor(
    @InjectRepository(PackageEntity)
    private readonly packageRepo: Repository<PackageEntity>,
  ) {}

  async execute(command: CreatePackageCommand) {
    try {
      const { dto } = command;

      // Check if SKU already exists
      const existingSku = await this.packageRepo.findOne({
        where: { sku: dto.sku },
      });
      if (existingSku) {
        throw new ConflictException(
          `Package with SKU "${dto.sku}" already exists`,
        );
      }

      // Check if UPC already exists
      const existingUpc = await this.packageRepo.findOne({
        where: { upc: dto.upc },
      });
      if (existingUpc) {
        throw new ConflictException(
          `Package with UPC "${dto.upc}" already exists`,
        );
      }

      const pkg = this.packageRepo.create(dto);
      const savedPackage = await this.packageRepo.save(pkg);

      return { message: 'Package created successfully', result: savedPackage };
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to create package: ${error.message}`,
      );
    }
  }
}
