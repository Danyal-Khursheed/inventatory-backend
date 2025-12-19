import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllWarehouseItemsQuery } from '../impl/get-all-warehouse-items.query';
import { InjectRepository } from '@nestjs/typeorm';
import { WarehouseItemEntity } from '../../entities/warehouse-item.entity';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

@QueryHandler(GetAllWarehouseItemsQuery)
export class GetAllWarehouseItemsHandler
  implements IQueryHandler<GetAllWarehouseItemsQuery>
{
  constructor(
    @InjectRepository(WarehouseItemEntity)
    private warehouseItemRepo: Repository<WarehouseItemEntity>,
  ) {}

  async execute({
    warehouseId,
    pageNumber,
    pageSize,
  }: GetAllWarehouseItemsQuery): Promise<any> {
    try {
      const isPaginated = !!(pageNumber && pageSize);

      const whereCondition = warehouseId ? { warehouseId } : {};

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

        const [warehouseItems, totalCount] =
          await this.warehouseItemRepo.findAndCount({
            where: whereCondition,
            relations: ['warehouse'],
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
          });

        return {
          data: warehouseItems,
          totalCount,
          pageNumber: Number(pageNumber),
          pageSize: Number(pageSize),
        };
      }

      const warehouseItems = await this.warehouseItemRepo.find({
        where: whereCondition,
        relations: ['warehouse'],
      });

      return { data: warehouseItems };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to retrieve warehouse items: ${error.message}`,
      );
    }
  }
}

