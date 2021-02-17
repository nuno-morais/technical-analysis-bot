import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { ObjectID } from 'mongodb';
import { Column, Entity, Index, ObjectIdColumn } from 'typeorm';

@Entity('portfolios')
@Index(['accountId', 'product'])
export class Portfolio {
  @ApiProperty({
    name: 'id',
    example: '602aeeb176fb0900042b4d7d',
    description: 'Portfolio id',
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
}
