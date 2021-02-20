import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
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
import { Notification } from '@tab/core';
import { classToPlain } from 'class-transformer';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationsApiService } from './notifications.api.service';

@ApiBearerAuth()
@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard, ScopesGuard)
export class NotificationsApiController {
  constructor(
    private readonly service: NotificationsApiService,
    private readonly authorizationContextService: AuthorizationContextService,
  ) {}

  @Post()
  @Scopes('write:notifications')
  @ApiBody({
    type: CreateNotificationDto,
  })
  @ApiOperation({
    summary: 'Create notification',
  })
  @ApiCreatedResponse({
    description: 'Notification created',
    type: Notification,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  create(
    @Body(new ValidationPipe()) createNotificationDto: CreateNotificationDto,
  ) {
    const accountId = this.authorizationContextService.context.accountId;
    return this.service.create(createNotificationDto, accountId);
  }

  @Patch(':id')
  @Scopes('write:notifications')
  @ApiBody({
    type: UpdateNotificationDto,
  })
  @ApiOperation({
    summary: 'Update notification',
  })
  @ApiOkResponse({
    description: 'Notification updated',
    type: Notification,
  })
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateNotificationDto: UpdateNotificationDto,
  ) {
    const accountId = this.authorizationContextService.context.accountId;
    return this.service.update(id, updateNotificationDto, accountId);
  }

  @Get()
  @Scopes('read:notifications')
  @ApiOperation({ summary: 'Get all notifications' })
  @ApiOkResponse({
    description: 'List of notifications',
    type: Notification,
    isArray: true,
  })
  async findAll(@Res() res) {
    const accountId = this.authorizationContextService.context.accountId;
    const result = await this.service.findAll(accountId);

    res.set({ 'X-Total-Count': result.length });
    res.status(HttpStatus.OK).send(classToPlain(result));
    return result;
  }

  @Get(':id')
  @Scopes('read:notifications')
  @ApiOperation({ summary: 'Get notification by id' })
  @ApiOkResponse({
    description: 'Notification',
    type: Notification,
  })
  findOne(@Param('id') id: string) {
    const accountId = this.authorizationContextService.context.accountId;
    return this.service.findOne(id, accountId);
  }

  @Delete(':id')
  @Scopes('write:notifications')
  @ApiOperation({ summary: 'Delete notification' })
  @ApiOkResponse()
  remove(@Param('id') id: string) {
    const accountId = this.authorizationContextService.context.accountId;
    return this.service.remove(id, accountId);
  }
}
