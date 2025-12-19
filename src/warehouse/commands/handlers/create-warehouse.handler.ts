import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WarehouseEntity } from '../../entities/warehouse.entity';
import { CreateWarehouseCommand } from '../impl/create-warehouse.command';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

@CommandHandler(CreateWarehouseCommand)
export class CreateWarehouseHandler
  implements ICommandHandler<CreateWarehouseCommand>
{
  constructor(
    @InjectRepository(WarehouseEntity)
    private readonly warehouseRepo: Repository<WarehouseEntity>,
  ) {}

  async execute(command: CreateWarehouseCommand) {
    try {
      const { dto } = command;

      const warehouse = this.warehouseRepo.create(dto);
      const savedWarehouse = await this.warehouseRepo.save(warehouse);

      return {
        message: 'Warehouse created successfully',
        result: savedWarehouse,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to create warehouse: ${error.message}`,
      );
    }
  }
}

