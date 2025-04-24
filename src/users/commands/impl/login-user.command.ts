import { LoginUserDto } from 'src/users/dto/login_user.dto';

export class LoginUserCommand {
  constructor(public readonly dto: LoginUserDto) {}
}
