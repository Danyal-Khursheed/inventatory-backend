import { Body, Controller, Post, Request } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterUserDto } from './dtos/register-user.dto';
import { RegisterUserCommand } from './commands/impl/register-user.command';
import { LoginUserDto } from './dtos/login_user.dto';
import { LoginUserCommand } from './commands/impl/login-user.command';
import { Public, RequestWithUser } from 'src/auth/auth.guard';
import { PostRegistrationLoginCommand } from './commands/impl/post-registration-login.command';
import { UnauthorizedException } from '@nestjs/common';
import { Headers } from '@nestjs/common';
import { ForgotPasswordCommand } from './commands/impl/forgot-password.command';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { ResetPasswordCommand } from './commands/impl/reset-password.command';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly commandBus: CommandBus) {}

  @Public()
  @Post('register')
  async register(@Body() data: RegisterUserDto): Promise<any> {
    return await this.commandBus.execute(new RegisterUserCommand(data));
  }

  @Public()
  @Post('login')
  async login(@Body() data: LoginUserDto): Promise<any> {
    return await this.commandBus.execute(new LoginUserCommand(data));
  }

  @Public()
  @ApiExcludeEndpoint()
  @Post('post-registration-login')
  async postRegistrationLogin(
    @Body('email') email: string,
    @Headers('authorization') authHeader: string,
  ): Promise<any> {
    const token = authHeader?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Missing registration token');
    }

    return await this.commandBus.execute(
      new PostRegistrationLoginCommand(email, token),
    );
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    const result: { otp: string; token: string } =
      await this.commandBus.execute(new ForgotPasswordCommand(dto.email));
    return {
      message: 'OTP generated successfully',
      otp: result.otp,
      token: result.token,
    };
  }

  @Post('reset-password')
  async resetPassword(
    @Body() data: ResetPasswordDto,
    @Request() req: RequestWithUser,
  ): Promise<any> {
    const { id } = req.user;
    return await this.commandBus.execute(
      new ResetPasswordCommand(id, data.otp, data.newPassword),
    );
  }
}
