import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested, IsArray } from 'class-validator';
import { CreatePackageDto } from './create-package.dto';

export class CreateBulkPackageDTO {
  @ApiProperty({
    type: [CreatePackageDto],
    description: 'List of packages',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePackageDto)
  packages: CreatePackageDto[];
}
