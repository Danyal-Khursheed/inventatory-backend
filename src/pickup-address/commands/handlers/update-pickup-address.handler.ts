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
    
    if (dto.addressNick !== undefined) updateData.addressNick = dto.addressNick;
    if (dto.address !== undefined) updateData.address = dto.address;
    if (dto.zipCode !== undefined) updateData.zipCode = dto.zipCode;
    if (dto.mobileNo !== undefined) updateData.mobileNo = dto.mobileNo;
    if (dto.latitude !== undefined) updateData.latitude = dto.latitude;
    if (dto.longitude !== undefined) updateData.longitude = dto.longitude;
    if (dto.cityName !== undefined) updateData.cityName = dto.cityName;
    if (dto.countryName !== undefined) updateData.countryName = dto.countryName;
    if (dto.countryCode !== undefined) updateData.countryCode = dto.countryCode;
    if (dto.warehouseId !== undefined) {
      // Verify warehouse exists if being updated
      const warehouse = await this.warehouseRepo.findOne({
        where: { id: dto.warehouseId },
      });
      if (!warehouse) {
        throw new NotFoundException(
          `Warehouse with ID "${dto.warehouseId}" not found`,
        );
      }
      updateData.warehouseId = dto.warehouseId;
    }

    Object.assign(pickupAddress, updateData);

    const updatedPickupAddress = await this.pickupAddressRepo.save(pickupAddress);

    return {
      message: 'Pickup address updated successfully',
      result: updatedPickupAddress,
    };
  }
}

