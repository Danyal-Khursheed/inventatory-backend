import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateRoleDto } from './dtos/create-role.dto';
import { CreateRoleCommand } from './commands/impl/create-role.command';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { UpdateRoleCommand } from './commands/impl/update-role.command';
import { DeleteRoleCommand } from './commands/impl/delete-role.command';
import { GetAllRolesQuery } from './queries/impl/get-all-roles.query';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/middlewares/roles.decorator';
import { Role } from 'src/middlewares/roles.enum';
import { RolesGuard } from 'src/middlewares/roles.gaurd';

@Controller('roles')
export class RolesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @Roles(Role.super_admin, Role.admin)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  async getAllRoles(
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<any> {
    const page = pageNumber ? parseInt(pageNumber, 10) : undefined;
    const size = pageSize ? parseInt(pageSize, 10) : undefined;

    return this.queryBus.execute(new GetAllRolesQuery(page, size));
  }

  @Post('create-role')
  @Roles(Role.super_admin)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  async createRole(@Body() data: CreateRoleDto): Promise<any> {
    return await this.commandBus.execute(
      new CreateRoleCommand(data.roleName, data.description, data.permissions),
    );
  }

  @Put('update-role')
  @Roles(Role.super_admin)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
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
  @Roles(Role.super_admin)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  async deleteRole(@Param('id') id: string): Promise<any> {
    return await this.commandBus.execute(new DeleteRoleCommand(id));
  }
}
