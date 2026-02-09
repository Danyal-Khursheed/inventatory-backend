import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShippingCompanyEntity } from '../../entities/shipping-company.entity';
import { WarehouseEntity } from '../../../warehouse/entities/warehouse.entity';
import { CreateShippingCompanyCommand } from '../impl/create-shipping-company.command';
import {
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

@CommandHandler(CreateShippingCompanyCommand)
export class CreateShippingCompanyHandler
  implements ICommandHandler<CreateShippingCompanyCommand>
{
  constructor(
    @InjectRepository(ShippingCompanyEntity)
    private readonly shippingCompanyRepo: Repository<ShippingCompanyEntity>,
    @InjectRepository(WarehouseEntity)
    private readonly warehouseRepo: Repository<WarehouseEntity>,
  ) {}

  async execute(command: CreateShippingCompanyCommand) {
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

      const shippingCompany = this.shippingCompanyRepo.create(dto);
      const saved = await this.shippingCompanyRepo.save(shippingCompany);

      return {
        message: 'Shipping company created successfully',
        result: saved,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to create shipping company: ${error.message}`,
      );
    }
  }
}

