import { Controller, Get, Query, Request } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetAllPermissionsQuery } from './queries/impl/get-all-permissions.query';
import { RequestWithUser } from 'src/auth/auth.guard';
import { GetUserPermissionsQuery } from './queries/impl/get-user-permissions.query';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async getAllPermissions(
    @Query('pageNumber') pageNumber?: number,
    @Query('pageSize') pageSize?: number,
  ): Promise<any> {
    return await this.queryBus.execute(
      new GetAllPermissionsQuery(pageNumber, pageSize),
    );
  }

  @Get('/get-user-permissions')
  async getUserPermissions(@Request() req: RequestWithUser): Promise<any> {
    const { role } = req.user;
    return await this.queryBus.execute(new GetUserPermissionsQuery(role));
  }
}
