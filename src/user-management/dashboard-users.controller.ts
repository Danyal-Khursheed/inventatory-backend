import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserDto } from './dtos/create-user.dto';
import { CreateUserCommand } from './commands/impl/create-user.command';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdateUserCommand } from './commands/impl/update-user.command';
import { DeleteUserCommand } from './commands/impl/delete-user.command';
import { GetAllUsersQuery } from './queries/impl/get-all-users.query';
import { GetUserQuery } from './queries/impl/get-single-user.query';
import { RequestWithUser } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from 'src/middlewares/roles.gaurd';
import { Roles } from 'src/middlewares/roles.decorator';
import { Role } from 'src/middlewares/roles.enum';

@Controller('dashboardUsers')
export class DashboardUsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('/get-all-users')
  @Roles(Role.super_admin, Role.admin)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  async getAllUsers(
    @Request() req: RequestWithUser,
    @Query('pageNumber') pageNumber: number,
    @Query('pageSize') pageSize: number,
    @Query('searchTerm') searchTerm?: string,
  ): Promise<any> {
    const { role, companyId } = req.user;
    return await this.queryBus.execute(
      new GetAllUsersQuery(role, companyId, pageNumber, pageSize, searchTerm),
    );
  }

  @Get(':id')
  @Roles(Role.super_admin, Role.admin)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  async getUserById(@Param('id') id: string): Promise<any> {
    return await this.queryBus.execute(new GetUserQuery(id));
  }

  @Post('create-user')
  @Roles(Role.super_admin, Role.admin)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  async createUser(@Body() data: CreateUserDto): Promise<any> {
    return await this.commandBus.execute(new CreateUserCommand(data));
  }

  @Put('update-user')
  @Roles(Role.super_admin, Role.admin)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  async updateUser(@Body() data: UpdateUserDto): Promise<any> {
    return await this.commandBus.execute(new UpdateUserCommand(data));
  }

  @Delete(':id')
  @Roles(Role.super_admin, Role.admin)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  async deleteUser(@Param('id') id: string): Promise<any> {
    return await this.commandBus.execute(new DeleteUserCommand(id));
  }
}
