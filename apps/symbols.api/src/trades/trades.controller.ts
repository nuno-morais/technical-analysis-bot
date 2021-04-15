import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  AuthorizationContextService,
  JwtAuthGuard,
  Scopes,
  ScopesGuard,
} from '@tab/authentication';
import { QueryOptions } from '@tab/common';
import { Trade } from '@tab/core';
import { classToPlain } from 'class-transformer';
import { CreateTradeDto } from './dto/create-trade.dto';
import { UpdateTradeDto } from './dto/update-trade.dto';
import { TradesService } from './trades.service';

@ApiBearerAuth()
@ApiTags('trades')
@Controller('trades')
@UseGuards(JwtAuthGuard, ScopesGuard)
export class TradesController {
  constructor(
    private readonly tradesService: TradesService,
    private readonly authorizationContextService: AuthorizationContextService,
  ) {}

  @Post()
  @Scopes('write:trades')
  @ApiBody({
    type: CreateTradeDto,
  })
  @ApiOperation({
    summary: 'Create trade',
  })
  @ApiCreatedResponse({
    description: 'Trade created',
    type: Trade,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  create(@Body(new ValidationPipe()) createTradeDto: CreateTradeDto) {
    const accountId = this.authorizationContextService.context.accountId;
    return this.tradesService.create(createTradeDto, accountId);
  }

  @Get()
  @Scopes('read:trades')
  @ApiOperation({ summary: 'Get all trades' })
  @ApiOkResponse({
    description: 'List of trades',
    type: Trade,
    isArray: true,
  })
  async findAll(@Res() res, @Query() query: QueryOptions) {
    query = new QueryOptions({ ...query });
    const accountId = this.authorizationContextService.context.accountId;
    const result = await this.tradesService.findAll(accountId, query);

    res.set({ 'X-Total-Count': result.count });
    res.status(HttpStatus.OK).send(classToPlain(result.items));

    return result.items;
  }

  @Get(':id')
  @Scopes('read:trades')
  @ApiOperation({ summary: 'Get trade by id' })
  @ApiOkResponse({
    description: 'Trade',
    type: Trade,
  })
  findOne(@Param('id') id: string) {
    const accountId = this.authorizationContextService.context.accountId;
    return this.tradesService.findOne(id, accountId);
  }

  @Delete(':id')
  @Scopes('write:trades')
  @ApiOperation({ summary: 'Delete trade' })
  @ApiOkResponse()
  remove(@Param('id') id: string) {
    const accountId = this.authorizationContextService.context.accountId;
    return this.tradesService.remove(id, accountId);
  }

  @Patch(':id')
  @Scopes('write:trades')
  @ApiOperation({ summary: 'Update trade' })
  @ApiOkResponse()
  patch(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateTradeDto: UpdateTradeDto,
  ) {
    const accountId = this.authorizationContextService.context.accountId;
    updateTradeDto.id = id;
    return this.tradesService.update(updateTradeDto, accountId);
  }

  @Put(':id')
  @Scopes('write:trades')
  @ApiOperation({ summary: 'Update trade' })
  @ApiOkResponse()
  put(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateTradeDto: UpdateTradeDto,
  ) {
    const accountId = this.authorizationContextService.context.accountId;
    updateTradeDto.id = id;
    return this.tradesService.update(updateTradeDto, accountId);
  }
}
