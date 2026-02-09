import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID } from 'class-validator';

export class UpdateShippingCompanyDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  serviceName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  serviceType?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  warehouseId?: string;
}

