import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { InjectRepository } from '@nestjs/typeorm';
import { PackageEntity } from 'src/package/entities/package.entity';
import { Repository } from 'typeorm';
import { GetAllCompaniesOriginQuery } from '../impl/get-all-companies-origin.query';
import { CompanyOrigin } from 'src/companies_origin_management/entity/companies.entity';

@QueryHandler(GetAllCompaniesOriginQuery)
export class GetAllCompaniesOriginHandler
  implements IQueryHandler<GetAllCompaniesOriginQuery>
{
  constructor(
    @InjectRepository(CompanyOrigin)
    private companyOriginRepo: Repository<CompanyOrigin>,
  ) {}
  async execute({
    pageNumber,
    pageSize,
  }: GetAllCompaniesOriginQuery): Promise<any> {
    const isPaginated = !!(pageNumber && pageSize);

    if (isPaginated) {
      const [packages, totalCount] = await this.companyOriginRepo.findAndCount({
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
      });

      return {
        data: packages,
        totalCount,
        pageNumber: Number(pageNumber),
        pageSize: Number(pageSize),
      };
    }

    const companyOrigin = await this.companyOriginRepo.find();

    return { data: companyOrigin };
  }
}
