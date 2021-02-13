import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { Notification, NotificationRepository } from '@tab/core';
import { classToPlain, plainToClass } from 'class-transformer';
import { ObjectID } from 'mongodb';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsApiService {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly repository: NotificationRepository,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto,
    accountId: string,
  ): Promise<Notification> {
    const notification = plainToClass(
      Notification,
      classToPlain(createNotificationDto, { excludeExtraneousValues: true }),
      { excludeExtraneousValues: true },
    );
    notification.providerName = notification.provider.name;
    notification.accountId = accountId;

    const notificationStored = await this.repository.findOne({
      providerName: notification.provider.name,
      accountId: accountId,
    });

    if (notificationStored != null) {
      throw new BadRequestException('This notification already exists');
    }

    return await this.repository.save(notification);
  }

  async findAll(accountId: string): Promise<Notification[]> {
    return this.repository.find({ accountId });
  }

  async findOne(id: string, accountId: string): Promise<Notification> {
    const entity = await this.repository.findOne({
      _id: new ObjectID(id),
      accountId,
    });
    if (entity == null) {
      throw new NotFoundException();
    }
    return entity;
  }

  async update(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
    accountId: string,
  ): Promise<Notification> {
    const notification = await this.findOne(id, accountId);
    if (notification.enabled != updateNotificationDto.enabled) {
      notification.enabled = updateNotificationDto.enabled;

      await this.repository.replaceOne({ _id: new ObjectID(id) }, notification);
    }
    return notification;
  }

  async remove(id: string, accountId: string) {
    await this.findOne(id, accountId);
    return this.repository.delete({ _id: new ObjectID(id), accountId });
  }
}
