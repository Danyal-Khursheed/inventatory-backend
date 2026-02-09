import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllWarehousesQuery } from '../impl/get-all-warehouses.query';
import { InjectRepository } from '@nestjs/typeorm';
import { WarehouseEntity } from '../../entities/warehouse.entity';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

@QueryHandler(GetAllWarehousesQuery)
export class GetAllWarehousesHandler
  implements IQueryHandler<GetAllWarehousesQuery>
{
  constructor(
    @InjectRepository(WarehouseEntity)
    private warehouseRepo: Repository<WarehouseEntity>,
  ) {}

  async execute({
    pageNumber,
    pageSize,
  }: GetAllWarehousesQuery): Promise<any> {
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

        const [warehouses, totalCount] =
          await this.warehouseRepo.findAndCount({
            relations: ['warehouseItems'],
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
          });

        return {
          data: warehouses,
          totalCount,
          pageNumber: Number(pageNumber),
          pageSize: Number(pageSize),
        };
      }

      const warehouses = await this.warehouseRepo.find({
        relations: ['warehouseItems'],
      });

      return { data: warehouses };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to retrieve warehouses: ${error.message}`,
      );
    }
  }
}

