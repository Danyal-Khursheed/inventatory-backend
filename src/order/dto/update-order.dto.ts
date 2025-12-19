import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsUUID,
  IsDateString,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderPackageDto } from './order-package.dto';
import { ReceiverDto } from './receiver.dto';
import { SenderDto } from './sender.dto';
import { SenderAddressDto } from './sender-address.dto';

export class UpdateOrderDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  hash?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  serviceName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  serviceType?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  orderTotal?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  paymentCurrency?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  preferredDate?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  referenceId?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  shippingCompanyId?: string;

  @ApiProperty({ type: [OrderPackageDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderPackageDto)
  @IsOptional()
  packages?: OrderPackageDto[];

  @ApiProperty({ type: ReceiverDto, required: false })
  @ValidateNested()
  @Type(() => ReceiverDto)
  @IsOptional()
  receiver?: ReceiverDto;

  @ApiProperty({ type: SenderDto, required: false })
  @ValidateNested()
  @Type(() => SenderDto)
  @IsOptional()
  sender?: SenderDto;

  @ApiProperty({ type: SenderAddressDto, required: false })
  @ValidateNested()
  @Type(() => SenderAddressDto)
  @IsOptional()
  senderAddress?: SenderAddressDto;
}

