import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { CreateWarehouseItemDto } from './create-warehouse-item.dto';
import { keysSnakeToCamel } from '../../common/utils/snake-to-camel';

export class CreateBulkWarehouseItemDto {
  @ApiProperty({ type: [CreateWarehouseItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWarehouseItemDto)
  @Transform(({ value }: { value: unknown }) =>
    Array.isArray(value) ? value.map((item) => keysSnakeToCamel(item)) : value,
  )
  items: CreateWarehouseItemDto[];
}

