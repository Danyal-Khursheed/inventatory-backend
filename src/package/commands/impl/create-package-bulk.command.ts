import { CreateBulkPackageDTO } from 'src/package/dto/create-bulk-package';

export class CreatePackageBulkCommand {
  constructor(public readonly dto: CreateBulkPackageDTO) {}
}
