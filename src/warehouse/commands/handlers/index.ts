import { CreateWarehouseHandler } from './create-warehouse.handler';
import { DeleteWarehouseHandler } from './delete-warehouse.handler';
import { UpdateWarehouseHandler } from './update-warehouse.handler';

const commandHandlers = [
  CreateWarehouseHandler,
  DeleteWarehouseHandler,
  UpdateWarehouseHandler,
];

export default commandHandlers;

