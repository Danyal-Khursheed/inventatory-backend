import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsArray,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemInputDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  warehouseItemId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  totalPrice?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  totalWeight?: number;
}

export class CreateOrderDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  warehouseId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  countryOriginId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  pickupAddressId: string;

  @ApiProperty({ type: [OrderItemInputDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemInputDto)
  items: OrderItemInputDto[];
}
