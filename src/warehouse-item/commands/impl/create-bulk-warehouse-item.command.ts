import { CreateBulkWarehouseItemDto } from '../../dto/create-bulk-warehouse-item.dto';

export class CreateBulkWarehouseItemCommand {
  constructor(public readonly dto: CreateBulkWarehouseItemDto) {}
}

