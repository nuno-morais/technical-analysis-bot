import { Exclude, Expose, Transform } from 'class-transformer';
import { ObjectID } from 'mongodb';
import { Column, Entity, Index, ObjectIdColumn } from 'typeorm';

export enum NotificationProviders {
  SLACK = 'SLACK',
  TELEGRAM = 'TELEGRAM',
}

export class NotificationProvider {
  @Column({ enum: NotificationProvider })
  public name: NotificationProviders;

  [key: string]: string;
}

@Entity('notifications')
@Index(['accountId', 'enabled'])
export class Notification {
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

  @Index()
  @Column()
  @Expose({ name: 'account_id' })
  accountId: string;

  @Index()
  @Column({ nullable: false })
  @Exclude()
  providerName: string;

  @Column({ type: 'simple-json', nullable: false })
  @Expose()
  provider: NotificationProvider;

  @Column({ default: true })
  @Expose()
  enabled: boolean;
}
