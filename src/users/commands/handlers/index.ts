import { JwtService } from '@nestjs/jwt';
import { CreateUserHandler } from './register-user.handler';
import { LoginUserHandler } from './login-user.handler';
import { AuthService } from 'src/auth/auth.service';
import { PostRegistrationLoginHandler } from './post-registration-login.handler';
import { ForgotPasswordHandler } from './forgot-password.handler';
import { ResetPasswordHandler } from './reset-password.handler';

export default [
  CreateUserHandler,
  LoginUserHandler,
  PostRegistrationLoginHandler,
  ForgotPasswordHandler,
  ResetPasswordHandler,
  AuthService,
  JwtService,
];
