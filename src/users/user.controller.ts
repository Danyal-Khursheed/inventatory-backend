import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterUserCommand } from './commands/impl/register-user.command';
import { DeleteUserCommand } from './commands/impl/delete-user.command';
import { LoginUserDto } from './dto/login_user.dto';
import { LoginUserCommand } from './commands/impl/login-user.command';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('register')
  async register(@Body() data: RegisterUserDto): Promise<any> {
    return await this.commandBus.execute(new RegisterUserCommand(data));
  }

  @Post('login')
  async login(@Body() data: LoginUserDto): Promise<any> {
    return await this.commandBus.execute(new LoginUserCommand(data));
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<any> {
    return await this.commandBus.execute(new DeleteUserCommand(id));
  }
}
