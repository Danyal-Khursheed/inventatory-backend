import { CreateOrderHandler } from './create-order.handler';
import { DeleteOrderHandler } from './delete-order.handler';
import { UpdateOrderHandler } from './update-order.handler';

const commandHandlers = [
  CreateOrderHandler,
  DeleteOrderHandler,
  UpdateOrderHandler,
];

export default commandHandlers;

