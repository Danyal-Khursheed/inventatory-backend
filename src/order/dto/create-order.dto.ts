import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
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

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  hash: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  serviceName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  serviceType: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  orderTotal: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  paymentCurrency: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

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

  @ApiProperty({ type: [OrderPackageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderPackageDto)
  packages: OrderPackageDto[];

  @ApiProperty({ type: ReceiverDto })
  @ValidateNested()
  @Type(() => ReceiverDto)
  receiver: ReceiverDto;

  @ApiProperty({ type: SenderDto })
  @ValidateNested()
  @Type(() => SenderDto)
  sender: SenderDto;

  @ApiProperty({ type: SenderAddressDto })
  @ValidateNested()
  @Type(() => SenderAddressDto)
  senderAddress: SenderAddressDto;
}

