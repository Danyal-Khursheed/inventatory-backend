import { RegisterUserDto } from 'src/users/dtos/register-user.dto';
export class RegisterUserCommand {
  constructor(public readonly dto: RegisterUserDto) {}
}
