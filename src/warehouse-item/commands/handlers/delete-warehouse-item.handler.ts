import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WarehouseItemEntity } from '../../entities/warehouse-item.entity';
import { DeleteWarehouseItemCommand } from '../impl/delete-warehouse-item.command';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

@CommandHandler(DeleteWarehouseItemCommand)
export class DeleteWarehouseItemHandler
  implements ICommandHandler<DeleteWarehouseItemCommand>
{
  constructor(
    @InjectRepository(WarehouseItemEntity)
    private readonly warehouseItemRepo: Repository<WarehouseItemEntity>,
  ) {}

  async execute(command: DeleteWarehouseItemCommand) {
    try {
      const { id } = command;

      const warehouseItem = await this.warehouseItemRepo.findOne({
        where: { id },
      });
      if (!warehouseItem) {
        throw new NotFoundException(
          `Warehouse item with ID "${id}" not found`,
        );
      }

      await this.warehouseItemRepo.remove(warehouseItem);

      return { message: 'Warehouse item deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to delete warehouse item: ${error.message}`,
      );
    }
  }
}

