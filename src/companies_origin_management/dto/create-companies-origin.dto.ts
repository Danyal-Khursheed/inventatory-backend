import {
  IsString,
  IsNotEmpty,
  IsLatitude,
  IsLongitude,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyOriginDto {
  @ApiProperty({
    example: 'BIXBITE GENERAL TRADING LLC',
    description: 'Registered company name',
  })
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({
    example: 'company-address',
    description: 'Nickname for the address',
  })
  @IsString()
  @IsNotEmpty()
  addressNick: string;

  @ApiProperty({
    example: 'Al Sajaah, Al Sajaah',
    description: 'Primary address line',
  })
  @IsString()
  @IsNotEmpty()
  addressLine1: string;

  @ApiProperty({
    example: 'Sharjah',
    description: 'City name',
  })
  @IsString()
  @IsNotEmpty()
  cityName: string;

  @ApiProperty({
    example: 'United Arab Emirates',
    description: 'Country name',
  })
  @IsString()
  @IsNotEmpty()
  countryName: string;

  @ApiProperty({
    example: 'AE',
    description: 'ISO 3166-1 alpha-2 country code',
    minLength: 2,
    maxLength: 2,
  })
  @IsString()
  @Length(2, 2)
  countryCode: string;

  @ApiProperty({
    example: '00000',
    description: 'ZIP / Postal code',
  })
  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @ApiProperty({
    example: '25.3171535',
    description: 'Latitude coordinate',
  })
  @IsLatitude()
  latitude: string;

  @ApiProperty({
    example: '55.6330992',
    description: 'Longitude coordinate',
  })
  @IsLongitude()
  longitude: string;

  @ApiProperty({
    example: '+971',
    description: 'Phone country code',
    maxLength: 5,
  })
  @IsString()
  @Length(1, 5)
  phoneCode: string;

  @ApiProperty({
    example: '503957740',
    description: 'Mobile phone number without country code',
  })
  @IsString()
  @IsNotEmpty()
  mobileNo: string;
}
