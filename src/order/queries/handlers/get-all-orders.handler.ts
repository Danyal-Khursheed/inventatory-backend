import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllOrdersQuery } from '../impl/get-all-orders.query';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from '../../entities/order.entity';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

@QueryHandler(GetAllOrdersQuery)
export class GetAllOrdersHandler implements IQueryHandler<GetAllOrdersQuery> {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepo: Repository<OrderEntity>,
  ) {}

  async execute({ pageNumber, pageSize }: GetAllOrdersQuery): Promise<any> {
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

        const [orders, totalCount] = await this.orderRepo.findAndCount({
          relations: [
            'warehouse',
            'countryOrigin',
            'pickupAddress',
            'shippingCompany',
            'orderItems',
            'orderItems.warehouseItem',
          ],
          skip: (pageNumber - 1) * pageSize,
          take: pageSize,
          order: { createdAt: 'DESC' },
        });

        return {
          data: orders,
          totalCount,
          pageNumber: Number(pageNumber),
          pageSize: Number(pageSize),
        };
      }

      const orders = await this.orderRepo.find({
        relations: [
          'warehouse',
          'countryOrigin',
          'pickupAddress',
          'shippingCompany',
          'orderItems',
          'orderItems.warehouseItem',
        ],
        order: { createdAt: 'DESC' },
      });

      return { data: orders };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to retrieve orders: ${error.message}`,
      );
    }
  }
}

