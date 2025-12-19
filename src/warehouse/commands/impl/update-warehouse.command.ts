import { UpdateWarehouseDto } from '../../dto/update-warehouse.dto';

export class UpdateWarehouseCommand {
  constructor(
    public readonly id: string,
    public readonly dto: UpdateWarehouseDto,
  ) {}
}

