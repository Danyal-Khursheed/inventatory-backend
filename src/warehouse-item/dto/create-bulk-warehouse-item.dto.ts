import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateWarehouseItemDto } from './create-warehouse-item.dto';

export class CreateBulkWarehouseItemDto {
  @ApiProperty({ type: [CreateWarehouseItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWarehouseItemDto)
  items: CreateWarehouseItemDto[];
}

