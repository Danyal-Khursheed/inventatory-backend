import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PickupAddressEntity } from '../../entities/pickup-address.entity';
import { WarehouseEntity } from '../../../warehouse/entities/warehouse.entity';
import { UpdatePickupAddressCommand } from '../impl/update-pickup-address.command';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

@CommandHandler(UpdatePickupAddressCommand)
export class UpdatePickupAddressHandler
  implements ICommandHandler<UpdatePickupAddressCommand>
{
  constructor(
    @InjectRepository(PickupAddressEntity)
    private readonly pickupAddressRepo: Repository<PickupAddressEntity>,
    @InjectRepository(WarehouseEntity)
    private readonly warehouseRepo: Repository<WarehouseEntity>,
  ) {}

  async execute(command: UpdatePickupAddressCommand) {
    const { id, dto } = command;

    const pickupAddress = await this.pickupAddressRepo.findOne({
      where: { id },
    });

    if (!pickupAddress) {
      throw new NotFoundException('Pickup address not found');
    }

    const updateData: Partial<PickupAddressEntity> = {};
    
    if (dto.address_nick !== undefined) updateData.addressNick = dto.address_nick;
    if (dto.address !== undefined) updateData.address = dto.address;
    if (dto.zip_code !== undefined) updateData.zipCode = dto.zip_code;
    if (dto.mobile_no !== undefined) updateData.mobileNo = dto.mobile_no;
    if (dto.latitude !== undefined) updateData.latitude = dto.latitude;
    if (dto.longitude !== undefined) updateData.longitude = dto.longitude;
    if (dto.city_name !== undefined) updateData.cityName = dto.city_name;
    if (dto.country_name !== undefined) updateData.countryName = dto.country_name;
    if (dto.country_code !== undefined) updateData.countryCode = dto.country_code;
    if (dto.warehouse_id !== undefined) {
      // Verify warehouse exists if being updated
      const warehouse = await this.warehouseRepo.findOne({
        where: { id: dto.warehouse_id },
      });
      if (!warehouse) {
        throw new NotFoundException(
          `Warehouse with ID "${dto.warehouse_id}" not found`,
        );
      }
      updateData.warehouseId = dto.warehouse_id;
    }

    Object.assign(pickupAddress, updateData);

    const updatedPickupAddress = await this.pickupAddressRepo.save(pickupAddress);

    return {
      message: 'Pickup address updated successfully',
      result: updatedPickupAddress,
    };
  }
}

