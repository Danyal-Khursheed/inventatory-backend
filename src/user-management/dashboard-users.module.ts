import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardUsersController } from './dashboard-users.controller';
import { UserEntity } from 'src/users/entities/users.entity';
import commandHandlers from './commands/handlers';
import queryHandlers from './queries/handlers';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [DashboardUsersController],
  providers: [...commandHandlers, ...queryHandlers],
})
export class DashboardUsersModule {}
