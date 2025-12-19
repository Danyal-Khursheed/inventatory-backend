import { CreateWarehouseItemDto } from '../../dto/create-warehouse-item.dto';

export class CreateWarehouseItemCommand {
  constructor(public readonly dto: CreateWarehouseItemDto) {}
}

