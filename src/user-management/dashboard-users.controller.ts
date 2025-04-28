import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserDto } from './dtos/create-user.dto';
import { CreateUserCommand } from './commands/impl/create-user.command';
import { Public } from 'src/auth/auth.guard';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdateUserCommand } from './commands/impl/update-user.command';
import { DeleteUserCommand } from './commands/impl/delete-user.command';
import { GetAllUsersQuery } from './queries/impl/get-all-users.query';

@Controller('dashboardUsers')
export class DashboardUsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Public()
  @Get('/get-all-users')
  async getAllUser(): Promise<any> {
    return await this.queryBus.execute(new GetAllUsersQuery());
  }

  @Public()
  @Post('create-user')
  async createUser(@Body() data: CreateUserDto): Promise<any> {
    return await this.commandBus.execute(new CreateUserCommand(data));
  }

  @Public()
  @Put('update-user')
  async updateUser(@Body() data: UpdateUserDto): Promise<any> {
    return await this.commandBus.execute(new UpdateUserCommand(data));
  }

  @Public()
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<any> {
    return await this.commandBus.execute(new DeleteUserCommand(id));
  }
}
