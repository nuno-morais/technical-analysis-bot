import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationsApiService } from './notifications.api.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard, ScopesGuard)
export class NotificationsApiController {
  constructor(
    private readonly service: NotificationsApiService,
    private readonly authorizationContextService: AuthorizationContextService,
  ) {}

  @Post()
  @Scopes('write:notifications')
  create(
    @Body(new ValidationPipe()) createNotificationDto: CreateNotificationDto,
  ) {
    const accountId = this.authorizationContextService.context.accountId;
    return this.service.create(createNotificationDto, accountId);
  }

  @Patch(':id')
  @Scopes('write:notifications')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateNotificationDto: UpdateNotificationDto,
  ) {
    const accountId = this.authorizationContextService.context.accountId;
    return this.service.update(id, updateNotificationDto, accountId);
  }

  @Get()
  @Scopes('read:notifications')
  findAll() {
    const accountId = this.authorizationContextService.context.accountId;
    return this.service.findAll(accountId);
  }

  @Get(':id')
  @Scopes('read:notifications')
  findOne(@Param('id') id: string) {
    const accountId = this.authorizationContextService.context.accountId;
    return this.service.findOne(id, accountId);
  }

  @Delete(':id')
  @Scopes('write:notifications')
  remove(@Param('id') id: string) {
    const accountId = this.authorizationContextService.context.accountId;
    return this.service.remove(id, accountId);
  }
}
