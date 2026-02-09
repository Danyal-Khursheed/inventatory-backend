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
import { CreatePickupAddressCommand } from './commands/impl/create-pickup-address.command';
import { CreatePickupAddressDto } from './dto/create-pickup-address.dto';
import { GetAllPickupAddressesQuery } from './queries/impl/get-all-pickup-addresses.query';
import { GetSinglePickupAddressQuery } from './queries/impl/get-single-pickup-address.query';
import { DeletePickupAddressCommand } from './commands/impl/delete-pickup-address.command';
import { UpdatePickupAddressDto } from './dto/update-pickup-address.dto';
import { UpdatePickupAddressCommand } from './commands/impl/update-pickup-address.command';

@Controller('pickup-addresses')
export class PickupAddressController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Post('create-pickup-address')
  @ApiOperation({ summary: 'Create a new pickup address' })
  @ApiBody({ type: CreatePickupAddressDto })
  @ApiResponse({
    status: 201,
    description: 'Pickup address created successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Pickup address created successfully' },
      },
    },
  })
  async createPickupAddress(@Body() dto: CreatePickupAddressDto): Promise<any> {
    return await this.commandBus.execute(new CreatePickupAddressCommand(dto));
  }

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Get('get-all-pickup-addresses')
  @ApiOperation({ summary: 'Get all pickup addresses' })
  async getAllPickupAddresses(
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const page = pageNumber ? parseInt(pageNumber, 10) : undefined;
    const size = pageSize ? parseInt(pageSize, 10) : undefined;
    return await this.queryBus.execute(
      new GetAllPickupAddressesQuery(page, size),
    );
  }

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Get('get-single-pickup-address')
  @ApiOperation({ summary: 'Get a single pickup address by ID' })
  async getSinglePickupAddress(
    @Query('id', new ParseUUIDPipe()) id: string,
  ) {
    return await this.queryBus.execute(new GetSinglePickupAddressQuery(id));
  }

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update pickup address' })
  @ApiBody({ type: UpdatePickupAddressDto })
  @ApiResponse({
    status: 200,
    description: 'Pickup address updated successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Pickup address updated successfully' },
      },
    },
  })
  @Patch('update-pickup-address')
  async updatePickupAddress(
    @Query('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdatePickupAddressDto,
  ): Promise<any> {
    return this.commandBus.execute(new UpdatePickupAddressCommand(id, dto));
  }

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Delete('delete-pickup-address')
  @ApiOperation({ summary: 'Delete a pickup address' })
  async deletePickupAddress(@Query('id', new ParseUUIDPipe()) id: string) {
    return await this.commandBus.execute(new DeletePickupAddressCommand(id));
  }
}

