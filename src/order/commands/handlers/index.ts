import { CreateOrderHandler } from './create-order.handler';
import { SubmitOrderHandler } from './submit-order.handler';
import { UpdateOrderHandler } from './update-order.handler';
import { DeleteOrderHandler } from './delete-order.handler';

const commandHandlers = [
  CreateOrderHandler,
  SubmitOrderHandler,
  UpdateOrderHandler,
  DeleteOrderHandler,
];

export default commandHandlers;

