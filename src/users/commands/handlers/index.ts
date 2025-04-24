import { JwtService } from '@nestjs/jwt';
import { CreateUserHandler } from './register-user.handler';
import { DeleteUserHandler } from './delete-user.handler';
import { LoginUserHandler } from './login-user.handler';
import { AuthService } from 'src/auth/auth.service';

export default [
  CreateUserHandler,
  DeleteUserHandler,
  LoginUserHandler,
  AuthService,
  JwtService,
];
