import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WarehouseEntity } from '../../entities/warehouse.entity';
import { UpdateWarehouseCommand } from '../impl/update-warehouse.command';
import {
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

@CommandHandler(UpdateWarehouseCommand)
export class UpdateWarehouseHandler
  implements ICommandHandler<UpdateWarehouseCommand>
{
  constructor(
    @InjectRepository(WarehouseEntity)
    private readonly warehouseRepo: Repository<WarehouseEntity>,
  ) {}

  async execute(command: UpdateWarehouseCommand) {
    try {
      const { id, dto } = command;

      const warehouse = await this.warehouseRepo.findOne({ where: { id } });
      if (!warehouse) {
        throw new NotFoundException(`Warehouse with ID "${id}" not found`);
      }

      Object.assign(warehouse, dto);
      const updatedWarehouse = await this.warehouseRepo.save(warehouse);

      return {
        message: 'Warehouse updated successfully',
        result: updatedWarehouse,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to update warehouse: ${error.message}`,
      );
    }
  }
}

