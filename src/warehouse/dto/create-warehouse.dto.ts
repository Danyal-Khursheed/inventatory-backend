import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateWarehouseDto {
  @ApiProperty({
    description: 'Warehouse name',
    example: 'Main Warehouse',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Warehouse address',
    example: '123 Main Street',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'City where the warehouse is located',
    example: 'Dubai',
    required: false,
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({
    description: 'Country name where the warehouse is located',
    example: 'United Arab Emirates',
    required: false,
  })
  @IsString()
  @IsOptional()
  countryName?: string;

  @ApiProperty({
    description: 'ISO 3166-1 alpha-2 country code (exactly 2 characters)',
    example: 'AE',
    minLength: 2,
    maxLength: 2,
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(2, 2)
  countryCode?: string;
}

