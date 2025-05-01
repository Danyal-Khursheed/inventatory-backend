import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import commandHandlers from './commands/handlers';
import { RolesEntity } from './entities/create-role.entity';
import { RolePermissionEntity } from './entities/role-permissions.entity';
import { RolesController } from './roles.controller';
import { GetAllRolesQueryHandle } from './queries/handlers/get-all-roles.handler';
import { PermissionEntity } from 'src/permissions-management/entity/permissions.entity';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      RolesEntity,
      RolePermissionEntity,
      PermissionEntity,
    ]),
  ],
  controllers: [RolesController],
  providers: [...commandHandlers, GetAllRolesQueryHandle],
})
export class RolesModule {}
