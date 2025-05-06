import { UpdateUserDto } from 'src/user-management/dtos/update-user.dto';
export class UpdateUserCommand {
  constructor(public readonly dto: UpdateUserDto) {}
}
