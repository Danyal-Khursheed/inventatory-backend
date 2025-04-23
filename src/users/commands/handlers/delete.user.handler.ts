/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { CreateUserCommand } from '../impl/createUser.command';
import { UserEntity } from 'src/users/entity/users.entity';
import { DeleteUserCommand } from '../impl/deleteUser.command';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async execute(command: DeleteUserCommand): Promise<any> {
    await this.userRepository.delete({
      id: command.id,
    });
    return { success: true, message: 'User deleted Successfully' };
  }
}
