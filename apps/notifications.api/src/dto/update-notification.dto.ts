import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class UpdateNotificationDto {
  @ApiProperty({
    example: true,
    description: 'Notification enabled',
  })
  @Expose()
  @IsBoolean()
  enabled: boolean;

  constructor(partial: Partial<UpdateNotificationDto>) {
    Object.assign(this, partial);
  }
}
