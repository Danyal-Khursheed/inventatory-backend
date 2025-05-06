import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsObject } from 'class-validator';

export class PermissionGroup {
  [key: string]: string[];
}

export class CreateRoleDto {
  @ApiProperty()
  @IsString()
  roleName: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Permissions grouped by feature/module',
    example: [
      { dashboard: ['view', 'create'] },
      { userManagemnt: ['view', 'create'] },
    ],
    type: 'array',
    items: {
      type: 'object',
      additionalProperties: {
        type: 'array',
        items: { type: 'string' },
      },
    },
  })
  @IsArray()
  @IsObject({ each: true })
  permissions: PermissionGroup[];
}
