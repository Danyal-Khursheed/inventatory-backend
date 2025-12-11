import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeletePackageCommand } from '../impl/delete-package.command';
import { InjectRepository } from '@nestjs/typeorm';
import { PackageEntity } from 'src/package/entities/package.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(DeletePackageCommand)
export class DeletePackageHandler
  implements ICommandHandler<DeletePackageCommand>
{
  constructor(
    @InjectRepository(PackageEntity)
    private readonly packageRepo: Repository<PackageEntity>,
  ) {}

  async execute({ id }: DeletePackageCommand): Promise<any> {
    const pkg = await this.packageRepo.findOne({ where: { id } });

    if (!pkg) {
      throw new NotFoundException('Package not found');
    }
    await this.packageRepo.remove(pkg);
    return { message: 'Package deleted successfully' };
  }
}
