import { CreateCompanyOriginDto } from 'src/companies_origin_management/dto/create-companies-origin.dto';

export class CreateCompanyOriginCommand {
  constructor(public readonly dto: CreateCompanyOriginDto) {}
}
