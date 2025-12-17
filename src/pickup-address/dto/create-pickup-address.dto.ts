import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Length,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class CreatePickupAddressDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address_nick: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address_line1: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address_line2?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  zip_code?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(1, 5)
  phone_code: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  mobile_no: string;

  @ApiProperty({ default: 0 })
  @IsInt()
  @Min(0)
  @Max(1)
  @IsOptional()
  is_default?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  latitude: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  longitude: string;

  @ApiProperty({ required: false, nullable: true })
  @IsString()
  @IsOptional()
  pickup_data?: string | null;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  hash: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  country_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  country_code: string;
}

