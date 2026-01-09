import { GetAllOrdersHandler } from './get-all-orders.handler';
import { GetSingleOrderHandler } from './get-single-order.handler';
import { GetOrderStatisticsHandler } from './get-order-statistics.handler';

const queryHandlers = [
  GetAllOrdersHandler,
  GetSingleOrderHandler,
  GetOrderStatisticsHandler,
];

export default queryHandlers;

