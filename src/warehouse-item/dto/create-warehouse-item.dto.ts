import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateWarehouseItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  upc?: string;

  @ApiProperty()
  @IsNumber()
  @Min(0, { message: 'pricePerItem must be greater than or equal to 0' })
  pricePerItem: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'weightPerItem must be greater than or equal to 0' })
  weightPerItem?: number;

  @ApiProperty()
  @IsNumber()
  @Min(0, { message: 'quantity must be greater than or equal to 0' })
  quantity: number;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  warehouseId: string;
}

