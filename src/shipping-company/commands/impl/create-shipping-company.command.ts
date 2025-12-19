import { CreateShippingCompanyDto } from '../../dto/create-shipping-company.dto';

export class CreateShippingCompanyCommand {
  constructor(public readonly dto: CreateShippingCompanyDto) {}
}

