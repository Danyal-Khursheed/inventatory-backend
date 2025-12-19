import { GetAllOrdersHandler } from './get-all-orders.handler';
import { GetSingleOrderHandler } from './get-single-order.handler';

const queryHandlers = [GetAllOrdersHandler, GetSingleOrderHandler];

export default queryHandlers;

