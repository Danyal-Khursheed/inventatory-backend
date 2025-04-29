import { PermissionGroup } from 'src/roles-management/dtos/create-role.dto';

export class CreateRoleCommand {
  constructor(
    public readonly roleName: string,
    public readonly description: string,
    public readonly permissions: PermissionGroup[],
  ) {}
}
