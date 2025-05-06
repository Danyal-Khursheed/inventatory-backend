import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCompanyCommand } from '../impl/create-company.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity } from 'src/companies-management/entity/create-company.entity';

@CommandHandler(CreateCompanyCommand)
export class CreateCompanyHandler
  implements ICommandHandler<CreateCompanyCommand>
{
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
  ) {}

  async execute(command: CreateCompanyCommand): Promise<any> {
    const { dto } = command;

    const company = this.companyRepository.create({
      logo: dto.logo,
      companyName: dto.companyName,
      description: dto.description,
      email: dto.email,
      address: dto.address,
      countryCode: dto.countryCode,
      phoneNumber: dto.phoneNumber,
    });

    await this.companyRepository.save(company);

    return { message: 'Company Created Successfully' };
  }
}
