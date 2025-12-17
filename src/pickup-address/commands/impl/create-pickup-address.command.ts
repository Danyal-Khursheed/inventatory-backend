import { CreatePickupAddressDto } from 'src/pickup-address/dto/create-pickup-address.dto';

export class CreatePickupAddressCommand {
  constructor(public readonly dto: CreatePickupAddressDto) {}
}

