import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, Length } from 'class-validator';

export class UpdateWarehouseDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  countryName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Length(2, 2)
  countryCode?: string;
}

