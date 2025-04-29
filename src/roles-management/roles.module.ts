import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import commandHandlers from './commands/handlers';
import { RolesEntity } from './entities/create-role.entity';
import { RolesPermsMappingEntity } from './entities/roles-perms-mapping.entity';
import { RolesController } from './roles.controller';
import { GetAllRolesQueryHandle } from './queries/handlers/get-all-roles.handler';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([RolesEntity, RolesPermsMappingEntity]),
  ],
  controllers: [RolesController],
  providers: [...commandHandlers, GetAllRolesQueryHandle],
})
export class RolesModule {}
