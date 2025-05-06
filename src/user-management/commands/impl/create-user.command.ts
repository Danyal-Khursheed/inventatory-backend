import { CreateUserDto } from 'src/user-management/dtos/create-user.dto';
export class CreateUserCommand {
  constructor(public readonly dto: CreateUserDto) {}
}
