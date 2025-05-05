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
    const { role, companyId, pageNumber, pageSize, searchTerm } = query;

    const qb = this.usersRepository.createQueryBuilder('user');

    if (role !== 'super-admin') {
      qb.where('user.companyId = :companyId', { companyId });
    }

    if (searchTerm) {
      const searchCondition =
        '(user.fullName ILIKE :search OR user.email ILIKE :search)';
      if (role !== 'super-admin') {
        qb.andWhere(searchCondition, { search: `%${searchTerm}%` });
      } else {
        qb.where(searchCondition, { search: `%${searchTerm}%` });
      }
    }

    const [users, totalCount] = await qb
      .skip((pageNumber - 1) * pageSize)
      .take(pageSize)
      .orderBy('user.createdAt', 'DESC')
      .getManyAndCount();

    const sanitizedUsers = users.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ password, refreshToken, ...rest }) => rest,
    );

    return {
      data: sanitizedUsers,
      totalCount,
      pageNumber: Number(pageNumber),
      pageSize: Number(pageSize),
    };
  }
}
