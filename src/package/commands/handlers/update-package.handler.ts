import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PackageEntity } from '../../entities/package.entity';
import { UpdatePackageCommand } from '../impl/update-package.command';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

@CommandHandler(UpdatePackageCommand)
export class UpdatePackageHandler
  implements ICommandHandler<UpdatePackageCommand>
{
  constructor(
    @InjectRepository(PackageEntity)
    private readonly packageRepo: Repository<PackageEntity>,
  ) {}

  async execute(command: UpdatePackageCommand) {
    try {
      const { id, dto } = command;

      if (!id) {
        throw new BadRequestException('Package ID is required');
      }

      const pkg = await this.packageRepo.findOne({
        where: { id },
      });

      if (!pkg) {
        throw new NotFoundException(`Package with ID "${id}" not found`);
      }

      // Check if SKU is being updated and if it conflicts with existing package
      if (dto.sku && dto.sku !== pkg.sku) {
        const existingSku = await this.packageRepo.findOne({
          where: { sku: dto.sku },
        });
        if (existingSku) {
          throw new ConflictException(
            `Package with SKU "${dto.sku}" already exists`,
          );
        }
      }

      // Check if UPC is being updated and if it conflicts with existing package
      if (dto.upc && dto.upc !== pkg.upc) {
        const existingUpc = await this.packageRepo.findOne({
          where: { upc: dto.upc },
        });
        if (existingUpc) {
          throw new ConflictException(
            `Package with UPC "${dto.upc}" already exists`,
          );
        }
      }

      Object.assign(pkg, dto);
      const updatedPackage = await this.packageRepo.save(pkg);

      return {
        message: 'Package updated successfully',
        result: updatedPackage,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to update package: ${error.message}`,
      );
    }
  }
}
