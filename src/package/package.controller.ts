import {
  Body,
  Controller,
  Delete,
  Get,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/middlewares/roles.gaurd';
import { CreatePackageCommand } from './commands/impl/create-package.command';
import { CreatePackageDto } from './dto/create-package.dto';
import { GetAllPackagesQuery } from './queries/impl/get-all-packages.query';
import { GetSinglePackageQuery } from './queries/impl/get-single-package';
import { DeletePackageCommand } from './commands/impl/delete-package.command';
import { UpdatePackageDto } from './dto/update-package.dto';
import { UpdatePackageCommand } from './commands/impl/update-package.command';

@Controller('packages')
export class PackagesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Post('create-package')
  @ApiOperation({ summary: 'Create a new package' })
  @ApiBody({ type: CreatePackageDto })
  @ApiResponse({
    status: 201,
    description: 'Package created successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Package created' },
      },
    },
  })
  async createPackage(@Body() dto: CreatePackageDto): Promise<any> {
    return await this.commandBus.execute(new CreatePackageCommand(dto));
  }

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Get('get-all-packages')
  async getAllPackages(
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const page = pageNumber ? parseInt(pageNumber, 10) : undefined;
    const size = pageSize ? parseInt(pageSize, 10) : undefined;
    return await this.queryBus.execute(new GetAllPackagesQuery(page, size));
  }

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Get('get-single-package')
  async getSinglePackage(@Query('id', new ParseUUIDPipe()) id: string) {
    return await this.queryBus.execute(new GetSinglePackageQuery(id));
  }

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'update package' })
  @ApiBody({ type: CreatePackageDto })
  @ApiResponse({
    status: 201,
    description: 'Package updated successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Package created' },
      },
    },
  })
  @Patch('update-package')
  async updatePackage(
    @Query('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdatePackageDto,
  ): Promise<any> {
    return this.commandBus.execute(new UpdatePackageCommand(id, dto));
  }

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Delete('get-single-package')
  async deletePackage(@Query('id', new ParseUUIDPipe()) id: string) {
    return await this.commandBus.execute(new DeletePackageCommand(id));
  }
}
