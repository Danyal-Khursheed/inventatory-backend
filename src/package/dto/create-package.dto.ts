import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsNotEmpty, Min, Length } from 'class-validator';

export class CreatePackageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  item: string;

  @ApiProperty()
  @IsInt()
  @Min(1, { message: 'size must be greater than 0' })
  size: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  sku: string;

  @ApiProperty()
  @IsInt()
  @Min(1, { message: 'quantity must be greater than 0' })
  quantity: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  upc: string;
}
