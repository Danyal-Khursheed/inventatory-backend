import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserDto } from './dto/create_user.dto';
import { CreateUserCommand } from './commands/impl/createUser.command';
import { DeleteUserCommand } from './commands/impl/deleteUser.command';

@Controller('users')
export class UsersController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async createUser(@Body() data: CreateUserDto) {
    const { userName, email } = data;
    return await this.commandBus.execute(new CreateUserCommand(userName, email));
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return await this.commandBus.execute(new DeleteUserCommand(id));
  }
}
