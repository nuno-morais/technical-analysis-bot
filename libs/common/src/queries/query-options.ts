import { Expose, Type } from 'class-transformer';

export class QueryOptions {
  @Type(() => Number)
  @Expose({ name: '_end' })
  public end: number;

  @Expose({ name: '_order' })
  public order: string;

  @Expose({ name: '_sort' })
  public sort: string;

  @Type(() => Number)
  @Expose({ name: '_start' })
  public start: number;

  public constructor(data: Partial<QueryOptions> = null) {
    if (data != null) {
      this.end = Number(data['_end'] || data.end || 0);
      this.order = data['_order'] || data.order;
      this.sort = data['_sort'] || data.sort;
      this.start = Number(data['_start'] || data.start || 0);
    }
  }

  public toMongoQuery() {
    const condition: { skip; take; order } = {
      skip: undefined,
      take: undefined,
      order: undefined,
    };
    if (this.start != null) {
      condition.skip = Number(this.start);
    }
    if (this.start != null && this.end != null) {
      condition.take = Number(this.end) - Number(this.start);
    }
    if (this.order != null && this.sort != null) {
      condition.order = { [this.sort]: this.order };
    }
    return condition;
  }
}
