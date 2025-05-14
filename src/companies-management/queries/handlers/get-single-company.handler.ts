import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from 'src/companies-management/entity/create-company.entity';
import { Repository } from 'typeorm';
import { GetCompanyQuery } from '../impl/get-single-company.query';
import { BadRequestException } from '@nestjs/common';

@QueryHandler(GetCompanyQuery)
export class GetSingleCompanyQueryHandler
  implements IQueryHandler<GetCompanyQuery>
{
  constructor(
    @InjectRepository(CompanyEntity)
    private companyRepository: Repository<CompanyEntity>,
  ) {}

  async execute(data: GetCompanyQuery): Promise<Partial<CompanyEntity>> {
    const company = await this.companyRepository.findOne({
      where: { id: data.id },
    });
    if (!company)
      throw new BadRequestException(`No company found with id: ${data.id}`);
    return company;
  }
}
