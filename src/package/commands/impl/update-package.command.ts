import { UpdatePackageDto } from 'src/package/dto/update-package.dto';
export class UpdatePackageCommand {
  constructor(
    public readonly id: string,
    public readonly dto: UpdatePackageDto,
  ) {}
}
