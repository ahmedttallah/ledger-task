import { Entity, Column, CreateDateColumn, PrimaryColumn } from 'typeorm';

@Entity('transactions')
export class Transaction {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  walletId: string;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string): number => parseFloat(value),
    },
  })
  amountEGP: number;

  @Column()
  type: 'deposit' | 'withdrawal';

  @Column()
  currency: string;

  @Column('decimal', { precision: 18, scale: 2 })
  originalAmount: number;

  @CreateDateColumn()
  createdAt: Date;
}
