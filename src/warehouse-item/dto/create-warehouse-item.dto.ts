import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class CreateWarehouseItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  @Min(0, { message: 'price must be greater than or equal to 0' })
  price: number;

  @ApiProperty()
  @IsNumber()
  @Min(0, { message: 'quantity must be greater than or equal to 0' })
  quantity: number;

  @ApiProperty()
  @IsNumber()
  @Min(0, { message: 'weight must be greater than or equal to 0' })
  weight: number;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  warehouseId: string;
}

