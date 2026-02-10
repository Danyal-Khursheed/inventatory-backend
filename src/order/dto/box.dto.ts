import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class BoxDto {
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
  @IsNumber()
  @Min(0)
  volumetricWeight: number;
}
