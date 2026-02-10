import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
  IsArray,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ReceiverDto } from './receiver.dto';
import { BoxDto } from './box.dto';

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

  @ApiProperty({ type: ReceiverDto })
  @ValidateNested()
  @Type(() => ReceiverDto)
  receiver: ReceiverDto;

  @ApiProperty({ default: false })
  @IsBoolean()
  cod: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  referenceId?: string;

  @ApiProperty({ required: false, default: 0 })
  @IsNumber()
  @IsOptional()
  codAmount?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  instructions?: string;

  @ApiProperty({ type: BoxDto, required: false })
  @ValidateNested()
  @Type(() => BoxDto)
  @IsOptional()
  box?: BoxDto;

  @ApiProperty({ type: [OrderItemInputDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemInputDto)
  items: OrderItemInputDto[];
}
