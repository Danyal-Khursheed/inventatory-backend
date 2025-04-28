import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entity/users.entity';
import { UpdateUserCommand } from '../impl/update-user.command';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async execute(command: UpdateUserCommand): Promise<any> {
    const {
      dto: { id, ...rest },
    } = command;

    await this.userRepository.update({ id }, rest);

    return { message: 'User updated successfully' };
  }
}
