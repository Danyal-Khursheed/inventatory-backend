import { UpdateWarehouseItemDto } from '../../dto/update-warehouse-item.dto';

export class UpdateWarehouseItemCommand {
  constructor(
    public readonly id: string,
    public readonly dto: UpdateWarehouseItemDto,
  ) {}
}

