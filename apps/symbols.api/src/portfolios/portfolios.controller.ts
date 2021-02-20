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
import { Portfolio } from '@tab/core';
import { classToPlain } from 'class-transformer';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { PortfoliosService } from './portfolios.service';

@ApiBearerAuth()
@ApiTags('portfolios')
@Controller('portfolios')
@UseGuards(JwtAuthGuard, ScopesGuard)
export class PortfoliosController {
  constructor(
    private readonly portfoliosService: PortfoliosService,
    private readonly authorizationContextService: AuthorizationContextService,
  ) {}

  @Post()
  @Scopes('write:portfolios')
  @ApiBody({
    type: CreatePortfolioDto,
  })
  @ApiOperation({
    summary: 'Create portfolio',
  })
  @ApiCreatedResponse({
    description: 'Portfolio created',
    type: Portfolio,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  create(@Body(new ValidationPipe()) createPortfolioDto: CreatePortfolioDto) {
    const accountId = this.authorizationContextService.context.accountId;
    return this.portfoliosService.create(createPortfolioDto, accountId);
  }

  @Get()
  @Scopes('read:portfolios')
  @ApiOperation({ summary: 'Get all portfolios' })
  @ApiOkResponse({
    description: 'List of portfolios',
    type: Portfolio,
    isArray: true,
  })
  async findAll(@Res() res) {
    const accountId = this.authorizationContextService.context.accountId;
    const result = await this.portfoliosService.findAll(accountId);

    res.set({ 'X-Total-Count': result.length });
    res.status(HttpStatus.OK).send(classToPlain(result));

    return result;
  }

  @Get(':id')
  @Scopes('read:portfolios')
  @ApiOperation({ summary: 'Get portfolio by id' })
  @ApiOkResponse({
    description: 'Portfolio',
    type: Portfolio,
  })
  findOne(@Param('id') id: string) {
    const accountId = this.authorizationContextService.context.accountId;
    return this.portfoliosService.findOne(id, accountId);
  }

  @Delete(':id')
  @Scopes('write:portfolios')
  @ApiOperation({ summary: 'Delete portfolio' })
  @ApiOkResponse()
  remove(@Param('id') id: string) {
    const accountId = this.authorizationContextService.context.accountId;
    return this.portfoliosService.remove(id, accountId);
  }
}
