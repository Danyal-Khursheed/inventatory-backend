import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetSinglePickupAddressQuery } from '../impl/get-single-pickup-address.query';
import { InjectRepository } from '@nestjs/typeorm';
import { PickupAddressEntity } from '../../entities/pickup-address.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetSinglePickupAddressQuery)
export class GetSinglePickupAddressHandler
  implements IQueryHandler<GetSinglePickupAddressQuery>
{
  constructor(
    @InjectRepository(PickupAddressEntity)
    private pickupAddressRepo: Repository<PickupAddressEntity>,
  ) {}
  
  async execute({ id }: GetSinglePickupAddressQuery): Promise<any> {
    const pickupAddress = await this.pickupAddressRepo.findOne({ where: { id } });

    if (!pickupAddress) {
      throw new NotFoundException('Pickup address not found');
    }

    return { data: pickupAddress };
  }
}

