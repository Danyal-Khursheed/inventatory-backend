import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity } from 'src/companies-management/entity/create-company.entity';
import { DeleteCompanyCommand } from '../impl/delete-company.commands';
import { UserEntity } from 'src/users/entities/users.entity';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(DeleteCompanyCommand)
export class DeleteCompanyHandler
  implements ICommandHandler<DeleteCompanyCommand>
{
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async execute(command: DeleteCompanyCommand): Promise<any> {
    const { id } = command;

    const user = await this.userRepository.findOne({
      where: { companyId: id },
    });

    if (user) {
      throw new BadRequestException(
        'Delete all users against this company first',
      );
    }

    await this.companyRepository.delete({ id });

    return { success: true, message: 'Company deleted successfully' };
  }
}
