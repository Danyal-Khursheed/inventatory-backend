import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WarehouseItemEntity } from '../../entities/warehouse-item.entity';
import { WarehouseEntity } from '../../../warehouse/entities/warehouse.entity';
import { CreateBulkWarehouseItemCommand } from '../impl/create-bulk-warehouse-item.command';
import {
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

@CommandHandler(CreateBulkWarehouseItemCommand)
export class CreateBulkWarehouseItemHandler
  implements ICommandHandler<CreateBulkWarehouseItemCommand>
{
  constructor(
    @InjectRepository(WarehouseItemEntity)
    private readonly warehouseItemRepo: Repository<WarehouseItemEntity>,
    @InjectRepository(WarehouseEntity)
    private readonly warehouseRepo: Repository<WarehouseEntity>,
  ) {}

  async execute(command: CreateBulkWarehouseItemCommand) {
    try {
      const { dto } = command;

      if (!dto.items || dto.items.length === 0) {
        throw new BadRequestException('Items array cannot be empty');
      }

      // Get unique warehouse IDs from the items
      const warehouseIds = [...new Set(dto.items.map((item) => item.warehouseId))];

      // Verify all warehouses exist
      const warehouses = await this.warehouseRepo.find({
        where: warehouseIds.map((id) => ({ id })),
      });

      if (warehouses.length !== warehouseIds.length) {
        const foundIds = warehouses.map((w) => w.id);
        const missingIds = warehouseIds.filter((id) => !foundIds.includes(id));
        throw new NotFoundException(
          `Warehouse(s) with ID(s) "${missingIds.join(', ')}" not found`,
        );
      }

      // Create all items
      const warehouseItems = dto.items.map((itemDto) =>
        this.warehouseItemRepo.create(itemDto),
      );

      const savedItems = await this.warehouseItemRepo.save(warehouseItems);

      return {
        message: `Successfully created ${savedItems.length} warehouse item(s)`,
        result: savedItems,
        count: savedItems.length,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to create warehouse items in bulk: ${error.message}`,
      );
    }
  }
}

