import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export class CreatePortfolioDto {
  @ApiProperty({
    example: 'USD',
    description: 'Currency',
    enum: ['USD'],
  })
  @IsEnum(['USD'])
  currency: string;

  @ApiProperty({
    example: 'AAPL',
    description: 'Symbol',
  })
  @IsString()
  product: string;

  @ApiProperty({
    example: 'US',
    description: 'Market',
    enum: ['US'],
  })
  @IsEnum(['US'])
  market: string;

  constructor(partial: Partial<CreatePortfolioDto>) {
    Object.assign(this, partial);
  }
}
