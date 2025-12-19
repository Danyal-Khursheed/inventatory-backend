import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllShippingCompaniesQuery } from '../impl/get-all-shipping-companies.query';
import { InjectRepository } from '@nestjs/typeorm';
import { ShippingCompanyEntity } from '../../entities/shipping-company.entity';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

@QueryHandler(GetAllShippingCompaniesQuery)
export class GetAllShippingCompaniesHandler
  implements IQueryHandler<GetAllShippingCompaniesQuery>
{
  constructor(
    @InjectRepository(ShippingCompanyEntity)
    private shippingCompanyRepo: Repository<ShippingCompanyEntity>,
  ) {}

  async execute({
    pageNumber,
    pageSize,
  }: GetAllShippingCompaniesQuery): Promise<any> {
    try {
      const isPaginated = !!(pageNumber && pageSize);

      if (isPaginated) {
        if (pageNumber < 1) {
          throw new BadRequestException(
            'pageNumber must be greater than or equal to 1',
          );
        }
        if (pageSize < 1) {
          throw new BadRequestException(
            'pageSize must be greater than or equal to 1',
          );
        }
        if (pageSize > 100) {
          throw new BadRequestException('pageSize cannot exceed 100');
        }

        const [companies, totalCount] =
          await this.shippingCompanyRepo.findAndCount({
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
          });

        return {
          data: companies,
          totalCount,
          pageNumber: Number(pageNumber),
          pageSize: Number(pageSize),
        };
      }

      const companies = await this.shippingCompanyRepo.find();

      return { data: companies };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to retrieve shipping companies: ${error.message}`,
      );
    }
  }
}

