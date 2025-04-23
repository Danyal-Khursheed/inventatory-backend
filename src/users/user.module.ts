import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './user.controller';
import { CreateUserHandler } from './commands/handlers/create-user-handler';
import { UserEntity } from './entity/users.entity';
import { DeleteUserHandler } from './commands/handlers/delete.user.handler';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [CreateUserHandler, DeleteUserHandler],
})
export class UsersModule {}