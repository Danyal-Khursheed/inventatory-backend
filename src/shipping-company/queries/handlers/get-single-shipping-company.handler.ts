import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetSingleShippingCompanyQuery } from '../impl/get-single-shipping-company.query';
import { InjectRepository } from '@nestjs/typeorm';
import { ShippingCompanyEntity } from '../../entities/shipping-company.entity';
import { Repository } from 'typeorm';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

@QueryHandler(GetSingleShippingCompanyQuery)
export class GetSingleShippingCompanyHandler
  implements IQueryHandler<GetSingleShippingCompanyQuery>
{
  constructor(
    @InjectRepository(ShippingCompanyEntity)
    private shippingCompanyRepo: Repository<ShippingCompanyEntity>,
  ) {}

  async execute({ id }: GetSingleShippingCompanyQuery): Promise<any> {
    try {
      const company = await this.shippingCompanyRepo.findOne({
        where: { id },
      });

      if (!company) {
        throw new NotFoundException(
          `Shipping company with ID "${id}" not found`,
        );
      }

      return { data: company };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to retrieve shipping company: ${error.message}`,
      );
    }
  }
}

