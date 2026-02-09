import { GetAllWarehousesHandler } from './get-all-warehouses.handler';
import { GetSingleWarehouseHandler } from './get-single-warehouse.handler';

const queryHandlers = [
  GetAllWarehousesHandler,
  GetSingleWarehouseHandler,
];

export default queryHandlers;

