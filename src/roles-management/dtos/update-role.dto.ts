import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsUUID, IsObject } from 'class-validator';

export class PermissionGroup {
  [key: string]: string[];
}

export class UpdateRoleDto {
  @ApiProperty()
  @IsUUID()
  roleId: string;

  @ApiProperty({ example: 'super_admin' })
  @IsString()
  roleName: string;

  @ApiProperty({ example: 'Updated description for the role' })
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
