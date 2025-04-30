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
import { CreateRoleDto } from './dtos/create-role.dto';
import { CreateRoleCommand } from './commands/impl/create-role.command';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { UpdateRoleCommand } from './commands/impl/update-role.command';
import { DeleteRoleCommand } from './commands/impl/delete-role.command';
import { GetAllRolesQuery } from './queries/impl/get-all-roles.query';

@Controller('roles')
export class RolesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getAllRoles(): Promise<any> {
    return await this.queryBus.execute(new GetAllRolesQuery());
  }

  @Post('create-role')
  async createRole(@Body() data: CreateRoleDto): Promise<any> {
    return await this.commandBus.execute(
      new CreateRoleCommand(data.roleName, data.description, data.permissions),
    );
  }

  @Put('update-role')
  async updateRole(@Body() data: UpdateRoleDto): Promise<any> {
    return await this.commandBus.execute(
      new UpdateRoleCommand(
        data.roleId,
        data.roleName,
        data.description,
        data.permissions,
      ),
    );
  }

  @Delete(':id')
  async deleteRole(@Param('id') id: string): Promise<any> {
    return await this.commandBus.execute(new DeleteRoleCommand(id));
  }
}
