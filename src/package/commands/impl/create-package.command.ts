import { CreatePackageDto } from 'src/package/dto/create-package.dto';
export class CreatePackageCommand {
  constructor(public readonly dto: CreatePackageDto) {}
}
