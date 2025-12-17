import { UpdatePickupAddressDto } from 'src/pickup-address/dto/update-pickup-address.dto';

export class UpdatePickupAddressCommand {
  constructor(
    public readonly id: string,
    public readonly dto: UpdatePickupAddressDto,
  ) {}
}

