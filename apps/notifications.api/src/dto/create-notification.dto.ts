import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmptyObject,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export class NotificationProvider {
  @Expose()
  @IsEnum(['TELEGRAM', 'SLACK'])
  public name: string;

  @Expose({ name: 'webhook_url' })
  @ValidateIf((o) => o.name === 'SLACK')
  @IsString()
  public webhookUrl: string;

  @Expose()
  @ValidateIf((o) => o.name === 'TELEGRAM')
  @IsString()
  public token: string;

  @Expose({ name: 'chat_id' })
  @ValidateIf((o) => o.name === 'TELEGRAM')
  @IsString()
  public chatId: string;
}

export class CreateNotificationDto {
  @Expose()
  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => NotificationProvider)
  provider: NotificationProvider;

  @Expose()
  @IsBoolean()
  enabled: boolean;

  constructor(partial: Partial<CreateNotificationDto>) {
    Object.assign(this, partial);
  }
}
