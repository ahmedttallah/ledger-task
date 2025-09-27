import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { StaticWallet } from './Helper/static-wallet';
import { CurrencyConversionService } from './Helper/currency-conversion.service';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Transaction)
    private readonly txRepo: Repository<Transaction>,
    private readonly currencyService: CurrencyConversionService,
  ) {}

  async createTransaction(dto: CreateTransactionDto) {
    const wallet = StaticWallet;

    if (dto.transactionId) {
      const existing = await this.txRepo.findOne({
        where: { id: dto.transactionId },
      });
      if (existing) return { transaction: existing, wallet };
    }

    const amountInEGP = this.currencyService.convertToEGP(
      dto.amount,
      dto.currency || wallet.currency,
    );

    if (dto.amount > 0) {
      wallet.deposit(amountInEGP);
    } else if (dto.amount < 0) {
      if (wallet.balance < Math.abs(amountInEGP)) {
        throw new BadRequestException('Insufficient funds');
      }
      wallet.withdraw(amountInEGP);
    }

    const type = dto.amount > 0 ? 'deposit' : 'withdrawal';

    const tx = this.txRepo.create({
      id: dto.transactionId,
      walletId: wallet.id,
      amountEGP: amountInEGP,
      originalAmount: dto.amount,
      currency: dto.currency || wallet.currency,
      type,
    });

    const transaction = await this.txRepo.save(tx);

    return { transaction, wallet };
  }
}
