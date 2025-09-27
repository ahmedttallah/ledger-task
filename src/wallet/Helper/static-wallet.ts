/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export const StaticWallet = {
  id: 'static-wallet-1',
  balance: 1000,
  currency: 'EGP',
  createdAt: new Date(),
  deposit(amount: number) {
    this.balance += amount;
  },
  withdraw(amount: number) {
    if (this.balance < amount) {
      throw new Error('Insufficient funds');
    }
    this.balance += amount;
  },
};
