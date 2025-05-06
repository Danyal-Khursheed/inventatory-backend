import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetAllPermissionsQuery } from './queries/impl/get-all-permissions.query';
import { RequestWithUser } from 'src/auth/auth.guard';
import { GetUserPermissionsQuery } from './queries/impl/get-user-permissions.query';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from 'src/middlewares/roles.gaurd';
import { Roles } from 'src/middlewares/roles.decorator';
import { Role } from 'src/middlewares/roles.enum';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @Roles(Role.super_admin)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  async getAllPermissions(
    @Query('pageNumber') pageNumber?: number,
    @Query('pageSize') pageSize?: number,
  ): Promise<any> {
    return await this.queryBus.execute(
      new GetAllPermissionsQuery(pageNumber, pageSize),
    );
  }

  @Get('/get-user-permissions')
  @Roles(Role.super_admin, Role.admin, Role.user)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  async getUserPermissions(@Request() req: RequestWithUser): Promise<any> {
    const { role } = req.user;
    return await this.queryBus.execute(new GetUserPermissionsQuery(role));
  }
}
