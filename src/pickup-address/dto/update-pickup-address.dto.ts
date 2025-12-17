import { PartialType } from '@nestjs/swagger';
import { CreatePickupAddressDto } from './create-pickup-address.dto';

export class UpdatePickupAddressDto extends PartialType(CreatePickupAddressDto) {}

