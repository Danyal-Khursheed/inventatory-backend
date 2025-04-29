import { PermissionGroup } from 'src/roles-management/dtos/update-role.dto';

export class UpdateRoleCommand {
  constructor(
    public readonly roleId: string,
    public readonly roleName: string,
    public readonly description: string,
    public readonly permissions: PermissionGroup[],
  ) {}
}
