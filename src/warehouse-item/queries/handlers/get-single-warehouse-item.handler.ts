import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetSingleWarehouseItemQuery } from '../impl/get-single-warehouse-item.query';
import { InjectRepository } from '@nestjs/typeorm';
import { WarehouseItemEntity } from '../../entities/warehouse-item.entity';
import { Repository } from 'typeorm';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

@QueryHandler(GetSingleWarehouseItemQuery)
export class GetSingleWarehouseItemHandler
  implements IQueryHandler<GetSingleWarehouseItemQuery>
{
  constructor(
    @InjectRepository(WarehouseItemEntity)
    private warehouseItemRepo: Repository<WarehouseItemEntity>,
  ) {}

  async execute({ id }: GetSingleWarehouseItemQuery): Promise<any> {
    try {
      const warehouseItem = await this.warehouseItemRepo.findOne({
        where: { id },
        relations: ['warehouse'],
      });

      if (!warehouseItem) {
        throw new NotFoundException(
          `Warehouse item with ID "${id}" not found`,
        );
      }

      return { data: warehouseItem };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to retrieve warehouse item: ${error.message}`,
      );
    }
  }
}

