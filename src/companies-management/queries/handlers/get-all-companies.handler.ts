import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllCompnaiesQuery } from '../impl/get-all-companies.query';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from 'src/companies-management/entity/create-company.entity';
import { UserEntity } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetAllCompnaiesQuery)
export class GetAllCompaniesQueryHandler
  implements IQueryHandler<GetAllCompnaiesQuery>
{
  constructor(
    @InjectRepository(CompanyEntity)
    private companyRepository: Repository<CompanyEntity>,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async execute(query: GetAllCompnaiesQuery): Promise<any> {
    const { pageNumber, pageSize, searchTerm, role, id } = query;
    const isPaginated = !!(pageNumber && pageSize);

    let baseQuery = this.companyRepository
      .createQueryBuilder('company')
      .leftJoin('company.users', 'user');

    if (searchTerm) {
      baseQuery = baseQuery.where('company.companyName ILIKE :search', {
        search: `%${searchTerm}%`,
      });
    }

    if (isPaginated) {
      const [companies, totalCount] = await baseQuery
        .skip((pageNumber - 1) * pageSize)
        .take(pageSize)
        .orderBy('company.createdAt', 'DESC')
        .getManyAndCount();

      return {
        data: companies,
        totalCount,
        pageNumber: Number(pageNumber),
        pageSize: Number(pageSize),
      };
    }

    if (role === 'super_admin') {
      baseQuery = this.companyRepository
        .createQueryBuilder('company')
        .where((qb) => {
          const subQuery = qb
            .subQuery()
            .select('u.companyId')
            .from(UserEntity, 'u')
            .where('u.role = :adminRole', { adminRole: 'admin' })
            .getQuery();
          return `company.id NOT IN ${subQuery}`;
        });
    } else if (role === 'admin') {
      const adminUser = await this.userRepository.findOne({
        where: { id, role: 'admin' },
        select: ['companyId'],
      });

      if (!adminUser) {
        return { data: [] };
      }

      baseQuery = this.companyRepository
        .createQueryBuilder('company')
        .where('company.id = :companyId', { companyId: adminUser.companyId });
    }

    const companies = await baseQuery
      .select(['company.id', 'company.companyName'])
      .orderBy('company.createdAt', 'DESC')
      .getMany();

    return { data: companies };
  }
}
