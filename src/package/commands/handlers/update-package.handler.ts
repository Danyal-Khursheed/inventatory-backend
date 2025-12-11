import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PackageEntity } from '../../entities/package.entity';

import { UpdatePackageCommand } from '../impl/update-package.command';

@CommandHandler(UpdatePackageCommand)
export class CreatePackageHandler
  implements ICommandHandler<UpdatePackageCommand>
{
  constructor(
    @InjectRepository(PackageEntity)
    private readonly packageRepo: Repository<PackageEntity>,
  ) {}

  async execute(command: UpdatePackageCommand) {
    const { id, dto } = command;
    console.log(id);
    console.log(dto);

    // const pkg = this.packageRepo.create(dto);
    // await this.packageRepo.save(pkg);

    // return { message: 'Package created', result: pkg };
  }
}
