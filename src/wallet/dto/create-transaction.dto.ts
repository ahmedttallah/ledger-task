import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty({ required: false, example: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ required: true, example: 'tx-123' })
  @IsString()
  transactionId: string;
}
