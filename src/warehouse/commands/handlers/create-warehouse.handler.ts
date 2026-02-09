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

      // Validate countryCode length if provided
      if (dto.countryCode && dto.countryCode.length !== 2) {
        throw new BadRequestException(
          'countryCode must be exactly 2 characters (ISO 3166-1 alpha-2 format)',
        );
      }

      const warehouse = this.warehouseRepo.create(dto);
      const savedWarehouse = await this.warehouseRepo.save(warehouse);

      return {
        message: 'Warehouse created successfully',
        result: savedWarehouse,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error.code === '23505' // PostgreSQL unique constraint violation
      ) {
        if (error.code === '23505') {
          throw new BadRequestException(
            'A warehouse with this name already exists',
          );
        }
        throw error;
      }
      
      // Handle database constraint errors
      if (error.code === '23503') {
        throw new BadRequestException(
          'Invalid reference: One or more referenced entities do not exist',
        );
      }

      throw new InternalServerErrorException(
        `Failed to create warehouse: ${error.message || 'Unknown error occurred'}`,
      );
    }
  }
}

