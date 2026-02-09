import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WarehouseItemEntity } from '../../entities/warehouse-item.entity';
import { WarehouseEntity } from '../../../warehouse/entities/warehouse.entity';
import { UpdateWarehouseItemCommand } from '../impl/update-warehouse-item.command';
import {
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

@CommandHandler(UpdateWarehouseItemCommand)
export class UpdateWarehouseItemHandler
  implements ICommandHandler<UpdateWarehouseItemCommand>
{
  constructor(
    @InjectRepository(WarehouseItemEntity)
    private readonly warehouseItemRepo: Repository<WarehouseItemEntity>,
    @InjectRepository(WarehouseEntity)
    private readonly warehouseRepo: Repository<WarehouseEntity>,
  ) {}

  async execute(command: UpdateWarehouseItemCommand) {
    try {
      const { id, dto } = command;

      const warehouseItem = await this.warehouseItemRepo.findOne({
        where: { id },
      });
      if (!warehouseItem) {
        throw new NotFoundException(
          `Warehouse item with ID "${id}" not found`,
        );
      }

      // If warehouseId is being updated, verify the new warehouse exists
      if (dto.warehouseId && dto.warehouseId !== warehouseItem.warehouseId) {
        const warehouse = await this.warehouseRepo.findOne({
          where: { id: dto.warehouseId },
        });
        if (!warehouse) {
          throw new NotFoundException(
            `Warehouse with ID "${dto.warehouseId}" not found`,
          );
        }
      }

      Object.assign(warehouseItem, dto);
      const updatedWarehouseItem = await this.warehouseItemRepo.save(
        warehouseItem,
      );

      return {
        message: 'Warehouse item updated successfully',
        result: updatedWarehouseItem,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to update warehouse item: ${error.message}`,
      );
    }
  }
}

