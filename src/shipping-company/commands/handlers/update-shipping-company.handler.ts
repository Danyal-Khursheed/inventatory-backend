import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShippingCompanyEntity } from '../../entities/shipping-company.entity';
import { WarehouseEntity } from '../../../warehouse/entities/warehouse.entity';
import { UpdateShippingCompanyCommand } from '../impl/update-shipping-company.command';
import {
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

@CommandHandler(UpdateShippingCompanyCommand)
export class UpdateShippingCompanyHandler
  implements ICommandHandler<UpdateShippingCompanyCommand>
{
  constructor(
    @InjectRepository(ShippingCompanyEntity)
    private readonly shippingCompanyRepo: Repository<ShippingCompanyEntity>,
    @InjectRepository(WarehouseEntity)
    private readonly warehouseRepo: Repository<WarehouseEntity>,
  ) {}

  async execute(command: UpdateShippingCompanyCommand) {
    try {
      const { id, dto } = command;

      const shippingCompany = await this.shippingCompanyRepo.findOne({
        where: { id },
      });
      if (!shippingCompany) {
        throw new NotFoundException(
          `Shipping company with ID "${id}" not found`,
        );
      }

      // Verify warehouse if being updated
      if (dto.warehouseId) {
        const warehouse = await this.warehouseRepo.findOne({
          where: { id: dto.warehouseId },
        });
        if (!warehouse) {
          throw new NotFoundException(
            `Warehouse with ID "${dto.warehouseId}" not found`,
          );
        }
      }

      Object.assign(shippingCompany, dto);
      const updated = await this.shippingCompanyRepo.save(shippingCompany);

      return {
        message: 'Shipping company updated successfully',
        result: updated,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to update shipping company: ${error.message}`,
      );
    }
  }
}

