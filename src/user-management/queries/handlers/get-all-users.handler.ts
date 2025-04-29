import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllUsersQuery } from '../impl/get-all-users.query';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetAllUsersQuery)
export class GetAllUsersQueryHandle implements IQueryHandler<GetAllUsersQuery> {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async execute(query: GetAllUsersQuery): Promise<any> {
    const { pageNumber, pageSize } = query;

    const [users, totalCount] = await this.usersRepository.findAndCount({
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });

    const sanitizedUsers = users.map((u) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, refreshToken, ...rest } = u;
      return rest;
    });

    return {
      data: sanitizedUsers,
      totalCount,
      pageNumber,
      pageSize,
    };
  }
}
