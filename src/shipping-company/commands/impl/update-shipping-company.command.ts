import { UpdateShippingCompanyDto } from '../../dto/update-shipping-company.dto';

export class UpdateShippingCompanyCommand {
  constructor(
    public readonly id: string,
    public readonly dto: UpdateShippingCompanyDto,
  ) {}
}

