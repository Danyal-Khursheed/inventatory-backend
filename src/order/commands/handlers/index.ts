import { CreateOrderHandler } from './create-order.handler';
import { SubmitOrderHandler } from './submit-order.handler';

const commandHandlers = [CreateOrderHandler, SubmitOrderHandler];

export default commandHandlers;

