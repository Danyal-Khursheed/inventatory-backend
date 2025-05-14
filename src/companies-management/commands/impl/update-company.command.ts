import { UpdateCompanyDto } from 'src/companies-management/dtos/update-company.dto';

export class UpdateCompanyCommand {
  constructor(public readonly dto: UpdateCompanyDto) {}
}
