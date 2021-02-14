import { Expose, Transform } from 'class-transformer';
import { ObjectID } from 'mongodb';
import { Column, Entity, Index, ObjectIdColumn } from 'typeorm';

@Entity('portfolios')
@Index(['accountId', 'product'])
export class Portfolio {
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
  accountId: string;

  @Column()
  @Index()
  market: string;

  @Column()
  currency: string;

  @Index()
  @Column()
  product: string;
}
