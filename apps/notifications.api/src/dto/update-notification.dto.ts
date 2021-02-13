import { Expose } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class UpdateNotificationDto {
  @Expose()
  @IsBoolean()
  enabled: boolean;

  constructor(partial: Partial<UpdateNotificationDto>) {
    Object.assign(this, partial);
  }
}
