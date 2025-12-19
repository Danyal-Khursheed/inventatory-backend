import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetSingleWarehouseQuery } from '../impl/get-single-warehouse.query';
import { InjectRepository } from '@nestjs/typeorm';
import { WarehouseEntity } from '../../entities/warehouse.entity';
import { Repository } from 'typeorm';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

@QueryHandler(GetSingleWarehouseQuery)
export class GetSingleWarehouseHandler
  implements IQueryHandler<GetSingleWarehouseQuery>
{
  constructor(
    @InjectRepository(WarehouseEntity)
    private warehouseRepo: Repository<WarehouseEntity>,
  ) {}

  async execute({ id }: GetSingleWarehouseQuery): Promise<any> {
    try {
      const warehouse = await this.warehouseRepo.findOne({
        where: { id },
        relations: ['warehouseItems'],
      });

      if (!warehouse) {
        throw new NotFoundException(`Warehouse with ID "${id}" not found`);
      }

      return { data: warehouse };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to retrieve warehouse: ${error.message}`,
      );
    }
  }
}

