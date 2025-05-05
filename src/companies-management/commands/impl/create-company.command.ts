import { CreateCompanyDto } from 'src/companies-management/dtos/create-company.dto';
export class CreateCompanyCommand {
  constructor(public readonly dto: CreateCompanyDto) {}
}
