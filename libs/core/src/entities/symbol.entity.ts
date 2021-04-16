import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { ObjectID } from 'mongodb';
import { Column, Entity, Index, ObjectIdColumn } from 'typeorm';

@Entity('symbols')
export class Symbol {
  @ApiProperty({
    name: 'id',
    example: '602aeeb176fb0900042b4d7d',
    description: 'Symbol id',
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
    example: '2012-10-10',
    description: 'Updated at',
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
  updated_at: Date;

  @ApiProperty({
    example: 120,
    description: 'Price',
  })
  @Column()
  price: number;
}
