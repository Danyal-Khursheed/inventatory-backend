import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PickupAddressEntity } from '../../entities/pickup-address.entity';
import { WarehouseEntity } from '../../../warehouse/entities/warehouse.entity';
import { CreatePickupAddressCommand } from '../impl/create-pickup-address.command';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

@CommandHandler(CreatePickupAddressCommand)
export class CreatePickupAddressHandler
  implements ICommandHandler<CreatePickupAddressCommand>
{
  constructor(
    @InjectRepository(PickupAddressEntity)
    private readonly pickupAddressRepo: Repository<PickupAddressEntity>,
    @InjectRepository(WarehouseEntity)
    private readonly warehouseRepo: Repository<WarehouseEntity>,
  ) {}

  async execute(command: CreatePickupAddressCommand) {
    try {
      const { dto } = command;

      // Verify warehouse exists
      const warehouse = await this.warehouseRepo.findOne({
        where: { id: dto.warehouse_id },
      });
      if (!warehouse) {
        throw new NotFoundException(
          `Warehouse with ID "${dto.warehouse_id}" not found`,
        );
      }

      const pickupAddress = this.pickupAddressRepo.create({
        addressNick: dto.address_nick,
        address: dto.address,
        zipCode: dto.zip_code,
        mobileNo: dto.mobile_no,
        latitude: dto.latitude,
        longitude: dto.longitude,
        cityName: dto.city_name,
        countryName: dto.country_name,
        countryCode: dto.country_code,
        warehouseId: dto.warehouse_id,
      });

      await this.pickupAddressRepo.save(pickupAddress);

      return {
        message: 'Pickup address created successfully',
        result: pickupAddress,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to create pickup address: ${error.message}`,
      );
    }
  }
}

