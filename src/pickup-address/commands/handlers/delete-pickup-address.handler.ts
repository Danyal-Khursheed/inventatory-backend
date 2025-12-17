import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeletePickupAddressCommand } from '../impl/delete-pickup-address.command';
import { InjectRepository } from '@nestjs/typeorm';
import { PickupAddressEntity } from '../../entities/pickup-address.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(DeletePickupAddressCommand)
export class DeletePickupAddressHandler
  implements ICommandHandler<DeletePickupAddressCommand>
{
  constructor(
    @InjectRepository(PickupAddressEntity)
    private readonly pickupAddressRepo: Repository<PickupAddressEntity>,
  ) {}

  async execute({ id }: DeletePickupAddressCommand): Promise<any> {
    const pickupAddress = await this.pickupAddressRepo.findOne({ where: { id } });

    if (!pickupAddress) {
      throw new NotFoundException('Pickup address not found');
    }
    
    await this.pickupAddressRepo.remove(pickupAddress);
    return { message: 'Pickup address deleted successfully' };
  }
}

