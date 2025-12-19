import { GetAllWarehouseItemsHandler } from './get-all-warehouse-items.handler';
import { GetSingleWarehouseItemHandler } from './get-single-warehouse-item.handler';

const queryHandlers = [
  GetAllWarehouseItemsHandler,
  GetSingleWarehouseItemHandler,
];

export default queryHandlers;

