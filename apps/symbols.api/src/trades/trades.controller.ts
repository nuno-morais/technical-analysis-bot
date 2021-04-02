import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
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
import { Trade } from '@tab/core';
import { classToPlain } from 'class-transformer';
import { CreateTradeDto } from './dto/create-trade.dto';
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
  async findAll(@Res() res) {
    const accountId = this.authorizationContextService.context.accountId;
    const result = await this.tradesService.findAll(accountId);

    res.set({ 'X-Total-Count': result.length });
    res.status(HttpStatus.OK).send(classToPlain(result));

    return result;
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
}
