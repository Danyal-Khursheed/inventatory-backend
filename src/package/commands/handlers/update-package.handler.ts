import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PackageEntity } from '../../entities/package.entity';

import { UpdatePackageCommand } from '../impl/update-package.command';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(UpdatePackageCommand)
export class UpdatePackageHandler
  implements ICommandHandler<UpdatePackageCommand>
{
  constructor(
    @InjectRepository(PackageEntity)
    private readonly packageRepo: Repository<PackageEntity>,
  ) {}

  async execute(command: UpdatePackageCommand) {
    const { id, dto } = command;

    const pkg = await this.packageRepo.findOne({
      where: { id },
    });

    if (!pkg) {
      throw new NotFoundException('Package not found');
    }

    Object.assign(pkg, dto);

    const updatedPackage = await this.packageRepo.save(pkg);

    return {
      message: 'Package updated successfully',
      result: updatedPackage,
    };
  }
}
