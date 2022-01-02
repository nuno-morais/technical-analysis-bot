import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { ObjectID } from 'mongodb';
import { Column, Entity, Index, ObjectIdColumn } from 'typeorm';

@Entity('trades')
@Index(['accountId', 'product'])
export class Trade {
  @ApiProperty({
    name: 'id',
    example: '602aeeb176fb0900042b4d7d',
    description: 'Trade id',
  })
  @Expose({ name: 'id' })
  @Transform(
    (input) =>
      input != null && input.value != null ? input.value.toString() : undefined,
    {
      toPlainOnly: true,
    },
  )
  @Transform(
    (input) =>
      input != null && input.value != null
        ? new ObjectID(input.value)
        : undefined,
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
  @Expose({ name: 'account_id' })
  @Index()
  @Column()
  accountId: string;

  @ApiProperty({
    example: 'US',
    description: 'Market name',
  })
  @Column()
  @Index()
  market: string;

  @ApiProperty({
    example: 'USD',
    description: 'Currency',
  })
  @Column()
  currency: string;

  @ApiProperty({
    example: 'AAPL',
    description: 'Symbol name',
  })
  @Index()
  @Column()
  product: string;

  @ApiProperty({
    example: 'eToro',
    description: 'Broker provider',
  })
  @Index()
  @Column()
  provider: string;

  @ApiProperty({
    example: 2,
    description: 'Number of shares',
  })
  @Column()
  shares: number;

  @ApiProperty({
    example: '2012-10-10',
    description: 'Opened at',
  })
  @Transform(
    (input) => {
      return input != null && input.value != null
        ? input.value.toISOString != null
          ? input.value.toISOString()
          : input.value
        : undefined;
    },
    {
      toPlainOnly: true,
    },
  )
  @Transform(
    (input) => {
      return input != null && input.value != null
        ? new Date(input.value)
        : undefined;
    },
    {
      toClassOnly: true,
    },
  )
  @Column({ type: 'datetime' })
  opened_at: Date;

  @ApiProperty({
    example: 120,
    description: 'Price per share',
  })
  @Column()
  opened_price: number;

  @ApiProperty({
    example: '2012-10-10',
    description: 'Closed at',
  })
  @Transform(
    (input) => {
      return input != null && input.value != null
        ? input.value.toISOString != null
          ? input.value.toISOString()
          : input.value
        : undefined;
    },
    {
      toPlainOnly: true,
    },
  )
  @Transform(
    (input) => {
      return input != null && input.value != null
        ? new Date(input.value)
        : undefined;
    },
    {
      toClassOnly: true,
    },
  )
  @Column({ type: 'datetime' })
  closed_at: Date;

  @ApiProperty({
    example: 120,
    description: 'Price per share',
  })
  @Column()
  closed_price: number;

  @Index()
  @Column()
  trade_id: string;

  @Transform(
    (input) => {
      return input != null && input.value != null
        ? input.value.toISOString != null
          ? input.value.toISOString()
          : input.value
        : undefined;
    },
    {
      toPlainOnly: true,
    },
  )
  @Transform(
    (input) => {
      return input != null && input.value != null
        ? new Date(input.value)
        : undefined;
    },
    {
      toClassOnly: true,
    },
  )
  @Column({ type: 'datetime' })
  updated_at: Date;

  @ApiProperty({
    example: 120,
    description: 'Price per share',
  })
  @Column()
  fees: number[];
}
