import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ObjectID } from 'mongodb';
import { Column, Entity, Index, ObjectIdColumn } from 'typeorm';

export enum NotificationProviders {
  SLACK = 'SLACK',
  TELEGRAM = 'TELEGRAM',
}

export class NotificationProvider {
  @ApiProperty({
    example: 'TELEGRAM',
    description: 'Notification provider name',
    enum: NotificationProviders,
  })
  @Column({ enum: NotificationProvider })
  public name: NotificationProviders;

  [key: string]: string;
}

@Entity('notifications')
@Index(['accountId', 'enabled'])
export class Notification {
  @ApiProperty({
    name: 'id',
    example: '602aeeb176fb0900042b4d7d',
    description: 'Notification id',
  })
  @Expose({ name: 'id' })
  @Transform((input) => (input != null ? input.value.toString() : undefined), {
    toPlainOnly: true,
  })
  @Transform(
    (input) => (input != null ? new ObjectID(input.value) : undefined),
    {
      toClassOnly: true,
    },
  )
  @ObjectIdColumn()
  _id: ObjectID;

  @ApiProperty({
    name: 'account_id',
    example: '602aeeb176fb0900042b4d7d',
    description: 'Account id',
  })
  @Index()
  @Column()
  @Expose({ name: 'account_id' })
  accountId: string;

  @Index()
  @Column({ nullable: false })
  @Exclude()
  providerName: string;

  @ApiProperty({
    description: 'Notification Provider',
    type: NotificationProvider,
  })
  @Column({ type: 'simple-json', nullable: false })
  @Expose()
  provider: NotificationProvider;

  @ApiProperty({
    example: true,
    description: 'Notification enabled',
  })
  @Column({ default: true })
  @Expose()
  enabled: boolean;
}
