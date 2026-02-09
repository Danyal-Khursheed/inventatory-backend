import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class SubmitOrderDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  shippingCompanyId: string;
}

