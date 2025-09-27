import { Controller, Post, Body } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Transaction } from './entities/transaction.entity';

@ApiTags('Wallet')
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('transaction')
  @ApiOperation({
    summary: 'Record a new transaction',
  })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({
    status: 201,
    description: 'Transaction recorded successfully.',
    type: Transaction,
  })
  @ApiResponse({
    status: 400,
    description: 'Insufficient funds or invalid input.',
  })
  async createTransaction(@Body() dto: CreateTransactionDto) {
    return this.walletService.createTransaction(dto);
  }
}
