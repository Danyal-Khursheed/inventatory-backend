import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsController } from './permissions.controller';
import { GetAllPermissionsQueryHandler } from './queries/handlers/get-all-permissions.handler';
import { PermissionEntity } from './entity/permissions.entity';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([PermissionEntity])],
  controllers: [PermissionsController],
  providers: [GetAllPermissionsQueryHandler],
})
export class PermissionsModule {}
