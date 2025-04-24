import { RegisterUserDto } from 'src/users/dto/register-user.dto';
export class RegisterUserCommand {
  constructor(public readonly dto: RegisterUserDto) {}
}
