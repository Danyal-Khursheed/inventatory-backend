import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WarehouseItemEntity } from '../../entities/warehouse-item.entity';
import { WarehouseEntity } from '../../../warehouse/entities/warehouse.entity';
import { CreateWarehouseItemCommand } from '../impl/create-warehouse-item.command';
import {
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

@CommandHandler(CreateWarehouseItemCommand)
export class CreateWarehouseItemHandler
  implements ICommandHandler<CreateWarehouseItemCommand>
{
  constructor(
    @InjectRepository(WarehouseItemEntity)
    private readonly warehouseItemRepo: Repository<WarehouseItemEntity>,
    @InjectRepository(WarehouseEntity)
    private readonly warehouseRepo: Repository<WarehouseEntity>,
  ) {}

  async execute(command: CreateWarehouseItemCommand) {
    try {
      const { dto } = command;

      // Verify warehouse exists
      const warehouse = await this.warehouseRepo.findOne({
        where: { id: dto.warehouseId },
      });
      if (!warehouse) {
        throw new NotFoundException(
          `Warehouse with ID "${dto.warehouseId}" not found`,
        );
      }

      const warehouseItem = this.warehouseItemRepo.create(dto);
      const savedWarehouseItem = await this.warehouseItemRepo.save(warehouseItem);

      return {
        message: 'Warehouse item created successfully',
        result: savedWarehouseItem,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to create warehouse item: ${error.message}`,
      );
    }
  }
}

