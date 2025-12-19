import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePackageBulkCommand } from '../impl/create-package-bulk.command';
import { InjectRepository } from '@nestjs/typeorm';
import { PackageEntity } from 'src/package/entities/package.entity';
import { Repository } from 'typeorm';

@CommandHandler(CreatePackageBulkCommand)
export class CreatePackagesBulkHandler
  implements ICommandHandler<CreatePackageBulkCommand>
{
  constructor(
    @InjectRepository(PackageEntity)
    private readonly packageRepo: Repository<PackageEntity>,
  ) {}
  async execute(command: CreatePackageBulkCommand): Promise<any> {
    const { dto } = command;
    const packages = dto.packages;

    const entities = this.packageRepo.create(packages);

    // 2️⃣ Save all in bulk
    const saved = await this.packageRepo.save(entities);

    return saved;
  }
}
