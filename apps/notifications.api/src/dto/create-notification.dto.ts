import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    example: 'TELEGRAM',
    description: 'Notification provider name',
    enum: ['TELEGRAM', 'SLACK'],
  })
  @Expose()
  @IsEnum(['TELEGRAM', 'SLACK'])
  public name: string;

  @ApiProperty({
    name: 'webhook_url',
    example: 'https://hooks.slack.com/services/<id>',
    description: 'Webhook url for Slack notifications',
  })
  @Expose({ name: 'webhook_url' })
  @ValidateIf((o) => o.name === 'SLACK')
  @IsString()
  public webhookUrl: string;

  @ApiProperty({
    example: '129312391:BBFj541xI3V10_kM86jWRScJ-TOKENNEA',
    description: 'Token for TELEGRAM notifications',
  })
  @Expose()
  @ValidateIf((o) => o.name === 'TELEGRAM')
  @IsString()
  public token: string;

  @ApiProperty({
    name: 'chat_id',
    example: '120938129308',
    description: 'Chat id for TELEGRAM notifications',
  })
  @Expose({ name: 'chat_id' })
  @ValidateIf((o) => o.name === 'TELEGRAM')
  @IsString()
  public chatId: string;
}

export class CreateNotificationDto {
  @ApiProperty({
    type: NotificationProvider,
    description: 'Notification provider',
  })
  @Expose()
  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => NotificationProvider)
  provider: NotificationProvider;

  @ApiProperty({
    example: true,
    description: 'Notification enabled',
  })
  @Expose()
  @IsBoolean()
  enabled: boolean;

  constructor(partial: Partial<CreateNotificationDto>) {
    Object.assign(this, partial);
  }
}
