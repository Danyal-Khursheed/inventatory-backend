import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Length,
} from 'class-validator';

export class CreatePickupAddressDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  addressNick: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  zipCode?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  mobileNo: string;

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
  cityName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  countryName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  countryCode: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  warehouseId: string;
}
