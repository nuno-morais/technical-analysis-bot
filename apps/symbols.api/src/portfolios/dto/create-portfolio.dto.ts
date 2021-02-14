import { IsEnum, IsString } from 'class-validator';

export class CreatePortfolioDto {
  @IsEnum(['USD'])
  currency: string;

  @IsString()
  product: string;

  @IsEnum(['US'])
  market: string;

  constructor(partial: Partial<CreatePortfolioDto>) {
    Object.assign(this, partial);
  }
}
