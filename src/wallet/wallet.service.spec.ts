/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { CurrencyConversionService } from './Helper/currency-conversion.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { StaticWallet } from './Helper/static-wallet';
import { BadRequestException } from '@nestjs/common';

describe('WalletService', () => {
  let service: WalletService;
  let repo: Repository<Transaction>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        CurrencyConversionService,
        {
          provide: getRepositoryToken(Transaction),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<WalletService>(WalletService);
    repo = module.get<Repository<Transaction>>(getRepositoryToken(Transaction));

    StaticWallet.balance = 1000;
  });

  it('should deposit and increase balance', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);
    jest.spyOn(repo, 'create').mockImplementation((data: any) => data);
    jest.spyOn(repo, 'save').mockImplementation(async (tx) => {
      return tx as Transaction;
    });

    const result = await service.createTransaction({
      amount: 200,
      currency: 'EGP',
      transactionId: 'tx-deposit-1',
    });

    expect(result.wallet.balance).toBe(1200);
    expect(result.transaction.type).toBe('deposit');
  });

  it('should withdraw and decrease balance', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);
    jest.spyOn(repo, 'create').mockImplementation((data: any) => data);
    jest.spyOn(repo, 'save').mockImplementation(async (tx) => {
      return tx as Transaction;
    });

    const result = await service.createTransaction({
      amount: -300,
      currency: 'EGP',
      transactionId: 'tx-withdraw-1',
    });

    expect(result.wallet.balance).toBe(700);
    expect(result.transaction.type).toBe('withdrawal');
  });

  it('should reject withdrawal if insufficient funds', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);

    jest
      .spyOn(repo, 'create')
      .mockImplementation((data: any) => data as Transaction);
    jest
      .spyOn(repo, 'save')
      .mockImplementation(async (tx) => tx as Transaction);

    const wallet = StaticWallet;
    wallet.balance = 50;

    await expect(
      service.createTransaction({
        transactionId: 'tx-withdraw-2',
        amount: -100,
        currency: 'USD',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should be idempotent (return existing transaction)', async () => {
    const fakeTx = { id: 'tx-123' } as Transaction;
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(fakeTx);

    const result = await service.createTransaction({
      amount: 100,
      currency: 'EGP',
      transactionId: 'tx-123',
    });

    expect(result.transaction).toBe(fakeTx);
  });

  it('should handle currency conversion', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);
    jest.spyOn(repo, 'create').mockImplementation((data: any) => data);
    jest.spyOn(repo, 'save').mockImplementation(async (tx) => {
      return tx as Transaction;
    });

    const result = await service.createTransaction({
      amount: 10,
      currency: 'USD',
      transactionId: 'tx-usd-1',
    });

    expect(result.wallet.balance).toBe(1500);
    expect(result.transaction.amountEGP).toBe(500);
  });

  it('should keep balance consistent under concurrent transactions', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValue(null);
    jest.spyOn(repo, 'create').mockImplementation((data: any) => data);
    jest
      .spyOn(repo, 'save')
      .mockImplementation(async (tx) => tx as Transaction);

    StaticWallet.balance = 1000;

    await Promise.all([
      service.createTransaction({
        transactionId: 'tx-concurrent-1',
        amount: -200,
        currency: 'EGP',
      }),
      service.createTransaction({
        transactionId: 'tx-concurrent-2',
        amount: -300,
        currency: 'EGP',
      }),
    ]);

    expect(StaticWallet.balance).toBe(500);
  });
});
