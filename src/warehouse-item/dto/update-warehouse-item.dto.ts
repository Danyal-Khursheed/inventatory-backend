import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsUUID, IsOptional, Min } from 'class-validator';

export class UpdateWarehouseItemDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'price must be greater than or equal to 0' })
  price?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'quantity must be greater than or equal to 0' })
  quantity?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'weight must be greater than or equal to 0' })
  weight?: number;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  warehouseId?: string;
}

