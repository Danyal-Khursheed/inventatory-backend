import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsController } from './permissions.controller';
import { GetAllPermissionsQueryHandler } from './queries/handlers/get-all-permissions.handler';
import { PermissionEntity } from './entity/permissions.entity';
import { GetUserPermissionsQueryHandler } from './queries/handlers/get-user-permissions.handler';
import { RolesEntity } from 'src/roles-management/entities/create-role.entity';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([PermissionEntity, RolesEntity]),
  ],
  controllers: [PermissionsController],
  providers: [GetAllPermissionsQueryHandler, GetUserPermissionsQueryHandler],
})
export class PermissionsModule {}
