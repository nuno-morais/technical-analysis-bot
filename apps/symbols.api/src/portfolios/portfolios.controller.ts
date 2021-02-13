import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  AuthorizationContextService,
  JwtAuthGuard,
  Scopes,
  ScopesGuard,
} from '@tab/authentication';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { PortfoliosService } from './portfolios.service';

@Controller('portfolios')
@UseGuards(JwtAuthGuard, ScopesGuard)
export class PortfoliosController {
  constructor(
    private readonly portfoliosService: PortfoliosService,
    private readonly authorizationContextService: AuthorizationContextService,
  ) {}

  @Post()
  @Scopes('write:portfolios')
  create(@Body(new ValidationPipe()) createPortfolioDto: CreatePortfolioDto) {
    const accountId = this.authorizationContextService.context.accountId;
    return this.portfoliosService.create(createPortfolioDto, accountId);
  }

  @Get()
  @Scopes('read:portfolios')
  findAll() {
    const accountId = this.authorizationContextService.context.accountId;
    return this.portfoliosService.findAll(accountId);
  }

  @Get(':id')
  @Scopes('read:portfolios')
  findOne(@Param('id') id: string) {
    const accountId = this.authorizationContextService.context.accountId;
    return this.portfoliosService.findOne(id, accountId);
  }

  @Delete(':id')
  @Scopes('write:portfolios')
  remove(@Param('id') id: string) {
    const accountId = this.authorizationContextService.context.accountId;
    return this.portfoliosService.remove(id, accountId);
  }
}
