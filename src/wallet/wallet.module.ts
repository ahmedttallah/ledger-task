import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { CurrencyConversionService } from './Helper/currency-conversion.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  providers: [WalletService, CurrencyConversionService],
  controllers: [WalletController],
})
export class WalletModule {}
