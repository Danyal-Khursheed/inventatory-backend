import { GetAllShippingCompaniesHandler } from './get-all-shipping-companies.handler';
import { GetSingleShippingCompanyHandler } from './get-single-shipping-company.handler';

const queryHandlers = [
  GetAllShippingCompaniesHandler,
  GetSingleShippingCompanyHandler,
];

export default queryHandlers;

