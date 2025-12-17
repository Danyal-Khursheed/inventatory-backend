import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCompanyOriginCommand } from '../impl/create-company-origin.command';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyOrigin } from 'src/companies_origin_management/entity/companies.entity';
import { Repository } from 'typeorm';

@CommandHandler(CreateCompanyOriginCommand)
export class CreateCompanyOriginHandler
  implements ICommandHandler<CreateCompanyOriginCommand>
{
  constructor(
    @InjectRepository(CompanyOrigin)
    private readonly companyOriginRepo: Repository<CompanyOrigin>,
  ) {}

  async execute(command: CreateCompanyOriginCommand): Promise<any> {
    const { dto } = command;

    const create = await this.companyOriginRepo.create(dto);
    await this.companyOriginRepo.save(create);

    return { message: 'Company created successfull', result: create };
  }
}
