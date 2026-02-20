import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  IsOptional,
  Min,
  IsEnum,
} from 'class-validator';
import { ProductCategory } from '../enums/product-category.enum';

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

  @ApiProperty({ enum: ProductCategory, required: false })
  @IsEnum(ProductCategory)
  @IsOptional()
  productCategory?: ProductCategory;

  @ApiProperty({ required: false, default: 0 })
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'retrnxboxDamaged must be greater than or equal to 0' })
  retrnxboxDamaged?: number;
}

