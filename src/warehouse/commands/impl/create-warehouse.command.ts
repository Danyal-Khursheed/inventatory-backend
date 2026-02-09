import { CreateWarehouseDto } from '../../dto/create-warehouse.dto';

export class CreateWarehouseCommand {
  constructor(public readonly dto: CreateWarehouseDto) {}
}

