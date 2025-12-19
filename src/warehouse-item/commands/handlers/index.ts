import { CreateWarehouseItemHandler } from './create-warehouse-item.handler';
import { DeleteWarehouseItemHandler } from './delete-warehouse-item.handler';
import { UpdateWarehouseItemHandler } from './update-warehouse-item.handler';

const commandHandlers = [
  CreateWarehouseItemHandler,
  DeleteWarehouseItemHandler,
  UpdateWarehouseItemHandler,
];

export default commandHandlers;

