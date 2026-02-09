import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
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
  address: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  zip_code?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  mobile_no: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  latitude: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  longitude: string;

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

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  warehouse_id: string;
}

