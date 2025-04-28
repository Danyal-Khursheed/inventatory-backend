import { LoginUserDto } from 'src/users/dtos/login_user.dto';

export class LoginUserCommand {
  constructor(public readonly dto: LoginUserDto) {}
}
