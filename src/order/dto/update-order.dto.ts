import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsUUID,
  IsEnum,
  IsDateString,
  IsBoolean,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ReceiverDto } from './receiver.dto';
import { BoxDto } from './box.dto';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export class UpdateOrderDto {
  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  warehouseId?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  countryOriginId?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  pickupAddressId?: string;

  @ApiProperty({ required: false, type: ReceiverDto })
  @ValidateNested()
  @Type(() => ReceiverDto)
  @IsOptional()
  receiver?: ReceiverDto;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  cod?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  referenceId?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  codAmount?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  instructions?: string;

  @ApiProperty({ required: false, type: BoxDto })
  @ValidateNested()
  @Type(() => BoxDto)
  @IsOptional()
  box?: BoxDto;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  shippingCompanyId?: string;

  @ApiProperty({ required: false, enum: OrderStatus })
  @IsEnum(OrderStatus)
  @IsOptional()
  orderStatus?: OrderStatus;

  @ApiProperty({ required: false, enum: PaymentStatus })
  @IsEnum(PaymentStatus)
  @IsOptional()
  paymentStatus?: PaymentStatus;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  deliveryDate?: string;
}

