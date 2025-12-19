import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsBoolean, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemDto } from './order-item.dto';

export class OrderPackageDto {
  @ApiProperty()
  @IsNumber()
  @Min(0)
  length: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  width: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  height: number;

  @ApiProperty()
  @IsBoolean()
  isDocument: boolean;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  deadWeight: number;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

