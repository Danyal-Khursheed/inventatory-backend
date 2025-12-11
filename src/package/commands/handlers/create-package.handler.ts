import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PackageEntity } from '../../entities/package.entity';
import { CreatePackageCommand } from '../impl/create-package.command';

@CommandHandler(CreatePackageCommand)
export class CreatePackageHandler
  implements ICommandHandler<CreatePackageCommand>
{
  constructor(
    @InjectRepository(PackageEntity)
    private readonly packageRepo: Repository<PackageEntity>,
  ) {}

  async execute(command: CreatePackageCommand) {
    const { dto } = command;

    const pkg = this.packageRepo.create(dto);
    await this.packageRepo.save(pkg);

    return { message: 'Package created', result: pkg };
  }
}
