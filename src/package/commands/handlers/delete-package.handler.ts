import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeletePackageCommand } from '../impl/delete-package.command';
import { InjectRepository } from '@nestjs/typeorm';
import { PackageEntity } from 'src/package/entities/package.entity';
import { Repository } from 'typeorm';
import {
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

@CommandHandler(DeletePackageCommand)
export class DeletePackageHandler
  implements ICommandHandler<DeletePackageCommand>
{
  constructor(
    @InjectRepository(PackageEntity)
    private readonly packageRepo: Repository<PackageEntity>,
  ) {}

  async execute({ id }: DeletePackageCommand): Promise<any> {
    try {
      if (!id) {
        throw new BadRequestException('Package ID is required');
      }

      const pkg = await this.packageRepo.findOne({ where: { id } });

      if (!pkg) {
        throw new NotFoundException(`Package with ID "${id}" not found`);
      }

      await this.packageRepo.remove(pkg);
      return { message: 'Package deleted successfully' };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to delete package: ${error.message}`,
      );
    }
  }
}
