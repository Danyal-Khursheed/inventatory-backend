import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetSingleOrderQuery } from '../impl/get-single-order.query';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from '../../entities/order.entity';
import { Repository } from 'typeorm';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

@QueryHandler(GetSingleOrderQuery)
export class GetSingleOrderHandler implements IQueryHandler<GetSingleOrderQuery> {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepo: Repository<OrderEntity>,
  ) {}

  async execute({ id }: GetSingleOrderQuery): Promise<any> {
    try {
      const order = await this.orderRepo.findOne({
        where: { id },
        relations: [
          'packages',
          'packages.items',
          'receiver',
          'sender',
          'senderAddress',
          'shippingCompany',
        ],
      });

      if (!order) {
        throw new NotFoundException(`Order with ID "${id}" not found`);
      }

      return { data: order };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to retrieve order: ${error.message}`,
      );
    }
  }
}

