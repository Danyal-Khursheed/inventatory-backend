/* eslint-disable @typescript-eslint/no-unused-vars */
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { GetUserQuery } from '../impl/get-single-user.query';
import { BadRequestException } from '@nestjs/common';

@QueryHandler(GetUserQuery)
export class GetSingleUserQueryHandle implements IQueryHandler<GetUserQuery> {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async execute(data: GetUserQuery): Promise<Partial<UserEntity>> {
    const user = await this.usersRepository.findOne({ where: { id: data.id } });
    if (!user)
      throw new BadRequestException(`No user found with id: ${data.id}`);
    const { password, refreshToken, ...rest } = user;
    return rest;
  }
}
