import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllPickupAddressesQuery } from '../impl/get-all-pickup-addresses.query';
import { InjectRepository } from '@nestjs/typeorm';
import { PickupAddressEntity } from '../../entities/pickup-address.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetAllPickupAddressesQuery)
export class GetAllPickupAddressesHandler
  implements IQueryHandler<GetAllPickupAddressesQuery>
{
  constructor(
    @InjectRepository(PickupAddressEntity)
    private pickupAddressRepo: Repository<PickupAddressEntity>,
  ) {}
  
  async execute({ pageNumber, pageSize }: GetAllPickupAddressesQuery): Promise<any> {
    const isPaginated = !!(pageNumber && pageSize);

    if (isPaginated) {
      const [pickupAddresses, totalCount] = await this.pickupAddressRepo.findAndCount({
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
      });

      return {
        data: pickupAddresses,
        totalCount,
        pageNumber: Number(pageNumber),
        pageSize: Number(pageSize),
      };
    }

    const pickupAddresses = await this.pickupAddressRepo.find();

    return { data: pickupAddresses };
  }
}

