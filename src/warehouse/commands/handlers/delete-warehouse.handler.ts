import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WarehouseEntity } from '../../entities/warehouse.entity';
import { DeleteWarehouseCommand } from '../impl/delete-warehouse.command';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

@CommandHandler(DeleteWarehouseCommand)
export class DeleteWarehouseHandler
  implements ICommandHandler<DeleteWarehouseCommand>
{
  constructor(
    @InjectRepository(WarehouseEntity)
    private readonly warehouseRepo: Repository<WarehouseEntity>,
  ) {}

  async execute(command: DeleteWarehouseCommand) {
    try {
      const { id } = command;

      const warehouse = await this.warehouseRepo.findOne({ where: { id } });
      if (!warehouse) {
        throw new NotFoundException(`Warehouse with ID "${id}" not found`);
      }

      await this.warehouseRepo.remove(warehouse);

      return { message: 'Warehouse deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to delete warehouse: ${error.message}`,
      );
    }
  }
}

