import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PickupAddressEntity } from '../../entities/pickup-address.entity';
import { CreatePickupAddressCommand } from '../impl/create-pickup-address.command';

@CommandHandler(CreatePickupAddressCommand)
export class CreatePickupAddressHandler
  implements ICommandHandler<CreatePickupAddressCommand>
{
  constructor(
    @InjectRepository(PickupAddressEntity)
    private readonly pickupAddressRepo: Repository<PickupAddressEntity>,
  ) {}

  async execute(command: CreatePickupAddressCommand) {
    const { dto } = command;

    const pickupAddress = this.pickupAddressRepo.create({
      addressNick: dto.address_nick,
      addressLine1: dto.address_line1,
      addressLine2: dto.address_line2,
      zipCode: dto.zip_code,
      phoneCode: dto.phone_code,
      mobileNo: dto.mobile_no,
      isDefault: dto.is_default ?? 0,
      latitude: dto.latitude,
      longitude: dto.longitude,
      pickupData: dto.pickup_data ?? null,
      hash: dto.hash,
      cityName: dto.city_name,
      countryName: dto.country_name,
      countryCode: dto.country_code,
    });

    await this.pickupAddressRepo.save(pickupAddress);

    return { message: 'Pickup address created successfully', result: pickupAddress };
  }
}

