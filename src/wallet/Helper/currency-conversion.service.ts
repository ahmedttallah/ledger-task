import { Injectable } from '@nestjs/common';

@Injectable()
export class CurrencyConversionService {
  private readonly mockRates: Record<string, number> = {
    EGP: 1,
    USD: 50,
    EUR: 60,
  };

  convertToEGP(amount: number, currency: string): number {
    const rate = this.mockRates[currency] ?? 1;
    return Number(amount) * rate;
  }
}
