import { CreateShippingCompanyHandler } from './create-shipping-company.handler';
import { DeleteShippingCompanyHandler } from './delete-shipping-company.handler';
import { UpdateShippingCompanyHandler } from './update-shipping-company.handler';

const commandHandlers = [
  CreateShippingCompanyHandler,
  DeleteShippingCompanyHandler,
  UpdateShippingCompanyHandler,
];

export default commandHandlers;

