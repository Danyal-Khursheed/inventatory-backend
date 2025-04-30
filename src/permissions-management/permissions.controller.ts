import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetAllPermissionsQuery } from './queries/impl/get-all-permissions.query';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async getAllPermissions(): Promise<any> {
    return await this.queryBus.execute(new GetAllPermissionsQuery());
  }
}
