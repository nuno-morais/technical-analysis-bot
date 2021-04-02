import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTradeDto {
  @ApiProperty({
    example: 'US',
    description: 'Market',
    enum: ['US', 'HKD', 'CUSTOM'],
  })
  @IsEnum(['US', 'HKD', 'CUSTOM'])
  market: string;

  @ApiProperty({
    example: 'USD',
    description: 'Currency',
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
    example: 2,
    description: 'Number of shares',
  })
  @IsNumber()
  shares: number;

  @ApiProperty({
    example: '2012-10-10',
    description: 'Opened at',
  })
  @IsISO8601()
  opened_at: Date;

  @ApiProperty({
    example: 120,
    description: 'Price per share',
  })
  @IsNumber()
  opened_price: number;

  @ApiProperty({
    example: '2012-10-10',
    description: 'Closed at',
  })
  @IsOptional()
  @IsISO8601()
  closed_at: Date;

  @ApiProperty({
    example: 120,
    description: 'Price per share',
  })
  @IsOptional()
  @IsNumber()
  closed_price: number;
}
