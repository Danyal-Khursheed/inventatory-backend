import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardUsersController } from './dashboard-users.controller';
import { UserEntity } from 'src/users/entities/users.entity';
import commandHandlers from './commands/handlers';
import queryHandlers from './queries/handlers';
import { CompanyEntity } from 'src/companies-management/entity/create-company.entity';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([UserEntity, CompanyEntity])],
  controllers: [DashboardUsersController],
  providers: [...commandHandlers, ...queryHandlers],
})
export class DashboardUsersModule {}
