import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PickupAddressEntity } from '../../entities/pickup-address.entity';
import { UpdatePickupAddressCommand } from '../impl/update-pickup-address.command';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(UpdatePickupAddressCommand)
export class UpdatePickupAddressHandler
  implements ICommandHandler<UpdatePickupAddressCommand>
{
  constructor(
    @InjectRepository(PickupAddressEntity)
    private readonly pickupAddressRepo: Repository<PickupAddressEntity>,
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
    if (dto.address_line1 !== undefined) updateData.addressLine1 = dto.address_line1;
    if (dto.address_line2 !== undefined) updateData.addressLine2 = dto.address_line2;
    if (dto.zip_code !== undefined) updateData.zipCode = dto.zip_code;
    if (dto.phone_code !== undefined) updateData.phoneCode = dto.phone_code;
    if (dto.mobile_no !== undefined) updateData.mobileNo = dto.mobile_no;
    if (dto.is_default !== undefined) updateData.isDefault = dto.is_default;
    if (dto.latitude !== undefined) updateData.latitude = dto.latitude;
    if (dto.longitude !== undefined) updateData.longitude = dto.longitude;
    if (dto.pickup_data !== undefined) updateData.pickupData = dto.pickup_data;
    if (dto.hash !== undefined) updateData.hash = dto.hash;
    if (dto.city_name !== undefined) updateData.cityName = dto.city_name;
    if (dto.country_name !== undefined) updateData.countryName = dto.country_name;
    if (dto.country_code !== undefined) updateData.countryCode = dto.country_code;

    Object.assign(pickupAddress, updateData);

    const updatedPickupAddress = await this.pickupAddressRepo.save(pickupAddress);

    return {
      message: 'Pickup address updated successfully',
      result: updatedPickupAddress,
    };
  }
}

